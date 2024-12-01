import { Command } from "@effect/cli";
import { $ } from 'bun';
import { Effect } from "effect";
import { bunHome } from "./dirs";

export const build = Command.make("build", {}, () => {
  const e = Effect.gen(function* () {
    const home = yield* bunHome

    yield* Effect.promise(() => $`cd ${home} && npm run build`)
  });

  return e;
});
