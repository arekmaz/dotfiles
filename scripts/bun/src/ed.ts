import { Command } from "@effect/cli";
import { FileSystem, Terminal } from "@effect/platform";
import { Config, Effect } from "effect";
import { interactiveShell } from "./interactiveShell.ts";
import { stdinString } from "./stdin.ts";

export const ed = Command.make("ed", {}, ({}) => {
  const e = Effect.gen(function* () {
    const stdin = yield* stdinString;

    const editor = yield* Config.string("EDITOR").pipe(
      Config.withDefault("nvim"),
    );

    const terminal = yield* Terminal.Terminal;
    const fs = yield* FileSystem.FileSystem;

    const tmpFile = yield* fs.makeTempFile();
    yield* Effect.addFinalizer(() => Effect.orDie(fs.remove(tmpFile)));

    yield* fs.writeFileString(tmpFile, stdin);

    yield* interactiveShell(editor, tmpFile);

    yield* terminal.display(yield* fs.readFileString(tmpFile));
  });

  return Effect.scoped(e);
});
