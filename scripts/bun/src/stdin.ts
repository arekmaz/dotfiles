import { Effect, Stream } from "effect";

export const stdinStream = Effect.gen(function* () {
  if (process.stdin.isTTY) {
    return Stream.empty;
  }

  return Stream.fromAsyncIterable(console, () => new Error("stdin error"));
});

export const stdinString = stdinStream.pipe(
  Effect.flatMap(Stream.runFold("", (a, b) => a + "\n" + b)),
);
