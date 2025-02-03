import { Command } from "@effect/cli";
import { Terminal } from "@effect/platform";
import { Effect, Stream } from "effect";
import { EOL } from "os";

const stdinStream = Stream.fromAsyncIterable(
  console,
  () => new Error("Failed to read from stdin"),
);

export const dots = Command.make(
  "dots",
  {},

  () => {
    const dot = "○";
    // const dot = '·'
    const e = Effect.gen(function* () {
      const terminal = yield* Terminal.Terminal;
      let isFirst = true;

      yield* Stream.runForEach(stdinStream, (line) => {
        if (isFirst) {
          isFirst = false;
          return terminal.display(line.replaceAll(/\s+/g, " " + dot + " "));
        }

        return terminal.display(EOL + line.replaceAll(/\s+/g, " " + dot + " "));
      });
    });

    return e;
  },
);
