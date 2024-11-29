import { Command, CommandExecutor, FileSystem } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Console, Effect, Schema } from "effect";

Effect.gen(function* () {
  const name = yield* Schema.NonEmptyString.pipe(Schema.decode, (d) =>
    d(Bun.argv[2]),
  );

  const exec = yield* CommandExecutor.CommandExecutor;

  const scriptExists = yield* exec.exitCode(Command.make("which", name));

  if (scriptExists === 0) {
    throw new Error(`script ${name} already exists`);
  }

  const fs = yield* FileSystem.FileSystem;

  const binFilePath = import.meta.dir + "/../bin/" + name;
  const srcFilePath = import.meta.dir + "/" + name + ".tsx";

  yield* fs.writeFileString(
    binFilePath,
    `#!/usr/bin/env bun
import "../src/${name}.tsx";
`,
  );

  yield* fs.writeFileString(
    srcFilePath,
    `console.log("Hello from ${srcFilePath}!")
`,
  );

  yield* fs.chmod(binFilePath, 0o777);

  yield* Console.log(srcFilePath); // pass this with pipe to e.g. and xargs vim
}).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
