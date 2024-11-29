import {
  Command,
  CommandExecutor,
  FileSystem,
  Terminal,
} from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect, Schema } from "effect";

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

  const binFilePath = import.meta.dir + "/../bin/" + name;
  const srcFilePath = import.meta.dir + "/../src/" + name + '.tsx'

  yield* fs.writeFileString(
    binFilePath,
    `#!/usr/bin/env bun
import "../src/${name}.tsx";
`,
  );

  yield* fs.writeFileString(
    srcFilePath,
    `console.log("hello from ${srcFilePath}")
`,
  );

  const editorCmd = Bun.env.EDITOR || "vi";

  // run $EDITOR on the new file
  yield* fs.open("/dev/tty", { flag: "r" }).pipe(
    Effect.flatMap((keyboardStream) =>
      Effect.promise(
        () =>
          Bun.spawn({
            cmd: [editorCmd, srcFilePath],
            stdin: "pipe",
            stdout: "pipe",
            stderr: "pipe",
            stdio: [keyboardStream.fd, 1, 2],
          }).exited,
      ),
    ),
    Effect.scoped,
  );

  yield* fs.chmod(binFilePath, 0o777);

  yield* terminal.display(`created a bun script ${binFilePath}\n`);
  yield* terminal.display(`created a bun src file ${srcFilePath}\n`);
}).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
