import { Args, Command } from "@effect/cli";
import { FileSystem } from "@effect/platform";
import { Console, Effect, Stream } from "effect";

const files = Args.file({ name: "file" }).pipe(Args.repeated);

export const fileToPrompt = Command.make(
  "file-to-prompt",
  { files },
  ({ files }) => {
    const e = Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;

      for (const file of files) {
        yield* Console.log(`--- FILE: ${file} ---`);

        yield* fs
          .stream(file)
          .pipe(Stream.runForEach((data) => Console.log(data.toString())));
      }
    });

    return e;
  },
);
