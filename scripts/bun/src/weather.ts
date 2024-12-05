import { Command, Options } from "@effect/cli";
import { Command as Cmd, CommandExecutor } from "@effect/platform";
import { Console, Effect, Stream } from "effect";

const color = Options.boolean("color").pipe(
  Options.withAlias("c"),
  Options.withDefault(() => false),
);

const long = Options.boolean("long").pipe(
  Options.withAlias("l"),
  Options.withDefault(() => false),
);

export const weather = Command.make("weather", { color, long }, ({ color, long }) =>
  Effect.gen(function* () {
    const exec = yield* CommandExecutor.CommandExecutor;
    const cmd = long ? Cmd.make("curl", `wttr.in${color ? "" : "?T"}`) : Cmd.make("curl", `wttr.in?0${color ? '' : 'T'}`)

    yield* exec
      .streamLines(cmd)
      .pipe(
        Stream.filter(
          (l) => l.length > 0 && !/follow .* for .* updates/i.test(l),
        ),
        Stream.runForEach((l) => Console.log(l)),
      );
  }),
);
