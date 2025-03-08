import { Command } from "@effect/cli";
import { Config, Console, Effect } from "effect";
import { interactiveShell } from "./interactiveShell.ts";
import { FileSystem, Terminal } from "@effect/platform";

const readStdin = Effect.promise(async () => {
  if (process.stdin.isTTY) {
    return "";
  }

  let stdin = "";

  for await (const line of console) {
    stdin += line + "\n";
  }

  return stdin;
});

export const ed = Command.make("ed", {}, ({}) => {
  const e = Effect.gen(function* () {
    const stdin = yield* readStdin;
    const editor = yield* Config.string("EDITOR").pipe(
      Config.withDefault("nvim"),
    );

    const terminal = yield* Terminal.Terminal;
    const fs = yield* FileSystem.FileSystem;

    const tmpFile = yield* fs.makeTempFile();
    yield* Effect.addFinalizer(() => Effect.orDie(fs.remove(tmpFile)));

    yield* fs.writeFileString(tmpFile, stdin);

    yield* interactiveShell(editor, tmpFile)

    yield* terminal.display(yield* fs.readFileString(tmpFile));
  });

  return Effect.scoped(e);
});
