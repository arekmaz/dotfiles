#!/usr/bin/env bun
import { Effect, Schema } from "effect";
import {
  Terminal,
  FileSystem,
  CommandExecutor,
  Command,
} from "@effect/platform";
import {
  BunTerminal,
  BunRuntime,
  BunCommandExecutor,
  BunFileSystem,
} from "@effect/platform-bun";

Effect.gen(function* () {
  const terminal = yield* Terminal.Terminal;

  const name = yield* Schema.NonEmptyString.pipe(
    (s) => Schema.decode(s),
    (d) => d(Bun.argv[2]),
  );

  const exec = yield* CommandExecutor.CommandExecutor;

  const scriptExists = yield* exec.exitCode(Command.make("which", name));

  if (scriptExists === 0) {
    yield* terminal.display(`script ${name} already exists`);
    return;
  }

  const fs = yield* FileSystem.FileSystem;

  // @ts-expect-error esnext breaks typing for some reason
  const filePath = import.meta.dir + "/" + name;

  yield* fs.writeFileString(
    filePath,
    `#!/usr/bin/env bun\n
console.log("hello from ${filePath}")
`,
  );

  const editorCmd = Bun.env.EDITOR || "vi";

  // run $EDITOR on the new file
  yield* fs.open("/dev/tty", { flag: "r" }).pipe(
    Effect.flatMap((keyboardStream) =>
      Effect.promise(
        () =>
          Bun.spawn({
            cmd: [editorCmd, filePath],
            stdin: "pipe",
            stdout: "pipe",
            stderr: "pipe",
            stdio: [keyboardStream.fd, 1, 2],
          }).exited,
      ),
    ),
    Effect.scoped
  );

  yield* fs.chmod(filePath, 0o777);

  yield* terminal.display(`created a bun script ${filePath}\n`);
}).pipe(
  Effect.provide(BunTerminal.layer),
  Effect.provide(BunCommandExecutor.layer),
  Effect.provide(BunFileSystem.layer),
  BunRuntime.runMain,
);
