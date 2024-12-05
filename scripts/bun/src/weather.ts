import { Command, Options } from "@effect/cli";
import { Command as Cmd, CommandExecutor } from "@effect/platform";
import { Console, Effect, Stream } from "effect";

const color = Options.boolean("color").pipe(
  Options.withAlias("c"),
  Options.withDefault(() => false),
);

export const weather = Command.make("weather", { color }, ({ color }) =>
  Effect.gen(function* () {
    const exec = yield* CommandExecutor.CommandExecutor;

    yield* exec
      .streamLines(Cmd.make("curl", `wttr.in${color ? "" : "?T"}`))
      .pipe(
        Stream.filter(
          (l) => l.length > 0 && !/follow .* for .* updates/i.test(l),
        ),
        Stream.runForEach((l) => Console.log(l)),
      );
  }),
);
