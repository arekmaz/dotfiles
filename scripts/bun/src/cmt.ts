import { Args, Command } from "@effect/cli";
import { FileSystem } from "@effect/platform";
import { Console, Effect } from "effect";
import { getCommentedLines } from "./cmt/getCommentedLines.js";
import { invariant } from "./invariant.js";

const file = Args.file({ name: "file" });

const readStdin = Effect.promise(async () => {
  if (process.stdin.isTTY) {
    return [];
  }

  let stdin = [];

  for await (const line of console) {
    stdin.push(line);
  }
  // if the last line is "", that means a newline was the last char,
  // in that case remove it
  if (stdin.at(-1) === "") {
    stdin.pop();
  }

  return stdin;
});

export const cmt = Command.make("cmt", { file }, ({ file }) => {
  const e = Effect.gen(function* () {
    const stdin = yield* readStdin;

    invariant(stdin.length > 0, "no stdin, cannot comment anything");

    const commentedLines = yield* getCommentedLines(stdin, file);

    yield* Console.log(commentedLines.join("\n"));
  });

  return e;
});
