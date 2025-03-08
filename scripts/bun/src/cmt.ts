import { Args, Command } from "@effect/cli";
import { Chunk, Console, Effect, Stream } from "effect";
import { getCommentedLines } from "./cmt/getCommentedLines.ts";
import { invariant } from "./invariant.ts";
import { stdinStream } from "./stdin.ts";

const file = Args.file({ name: "file" });

export const cmt = Command.make("cmt", { file }, ({ file }) => {
  const e = Effect.gen(function* () {
    const stdinLines = Chunk.toArray(
      yield* stdinStream.pipe(
        Stream.map((e) => e.toString()),
        Stream.runCollect,
      ),
    );

    invariant(stdinLines.length > 0, "no stdin, cannot comment anything");

    const commentedLines = yield* getCommentedLines(stdinLines, file);

    yield* Console.log(commentedLines.join("\n"));
  });

  return e;
});
