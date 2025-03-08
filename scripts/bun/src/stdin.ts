import { Stream } from "effect";

export const stdinStream = process.stdin.isTTY
  ? Stream.empty
  : Stream.fromAsyncIterable(
      console,
      () => new Error("stdin error"),
    );

export const stdinString = stdinStream.pipe(
  Stream.runFold("", (a, b) => a + "\n" + b),
);
