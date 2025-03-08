import { Effect, Stream } from "effect";
import { FileSystem } from "@effect/platform";

export const stdinStream = Effect.gen(function* () {
  if (process.stdin.isTTY) {
    return Stream.empty;
  }

  const fs = yield* FileSystem.FileSystem;

  return fs.stream("/dev/stdin").pipe(Stream.map((a) => a.toString()));
});

export const stdinString = stdinStream.pipe(
  Effect.flatMap(Stream.runFold("", (a, b) => a + "\n" + b)),
);
