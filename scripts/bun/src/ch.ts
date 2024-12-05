import { Args, Command } from "@effect/cli";
import { $ } from "bun";
import { Effect, Schema } from "effect";

const args = Args.text({ name: "args" }).pipe(Args.repeated);

const inc = Command.make("inc", { args }, ({ args }) =>
  Effect.gen(function* () {
    yield* Effect.promise(
      () =>
        $`open -na "Google Chrome" --args --incognito ${{
          raw: args.join(" "),
        }}`,
    );
  }),
);

const port = Args.text({ name: "port" });

const lh = Command.make("lh", { port }, ({ port }) =>
  Effect.gen(function* () {
    const p = yield* Schema.NumberFromString.pipe(
      Schema.int(),
      Schema.nonNegative(),
      Schema.decode,
    )(port);

    yield* Effect.promise(
      () =>
        $`open -na "Google Chrome" --args --incognito 'http://localhost:${p}`,
    );
  }),
);

export const ch = Command.make("ch", { args }, ({ args }) =>
  Effect.gen(function* () {
    yield* inc.handler({ args });
  }),
).pipe(Command.withSubcommands([inc, lh]));
