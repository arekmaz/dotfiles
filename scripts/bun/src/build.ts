import { Command } from "@effect/cli";
import { Config, Console, Effect } from "effect";

export const build = Command.make("build", {}, () => {
  const e = Effect.gen(function* () {
    yield* Console.log("building monolith")

    const home = yield* Config.nonEmptyString("HOME")

    yield* Effect.promise(
      () =>
        Bun.spawn({
          cwd: home + "/scripts/bun",
          cmd: ["npm", "run", "build"],
          stdin: "inherit",
          stdout: "inherit",
          stderr: "inherit",
        }).exited,
    );

    yield* Console.log("monolit rebuilt successfully, run ,m")
  });

  return e;
});
