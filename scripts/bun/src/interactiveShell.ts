import { FileSystem } from "@effect/platform";
import { Effect } from "effect";

export const interactiveShell = (program: string, ...args: string[]) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;

    return yield* fs.open("/dev/tty", { flag: "r" }).pipe(
      Effect.flatMap((keyboardStream) =>
        Effect.promise(
          () =>
            Bun.spawn({
              cmd: [program, ...args],
              stdin: "pipe",
              stdout: "pipe",
              stderr: "pipe",
              stdio: [keyboardStream.fd, 1, 2],
            }).exited,
        ),
      ),
      Effect.scoped,
    );
  });

export const editor = (...args: string[]) => {
  const editorCmd = Bun.env.EDITOR || "vi";

  return interactiveShell(editorCmd, ...args);
};
