import { Command } from "@effect/cli";
import { Terminal } from "@effect/platform";
import { Effect } from "effect";

const home = Bun.env.HOME || "~";

const displayLines = (s: string | TemplateStringsArray, ...args: string[]) => {
  if (typeof s === "string") {
    return s.replace(/^([\s\r\n])+/gm, "").replace(/$\n?/, "\n");
  }

  let result = "";

  for (let i = 0; i < s.length; i++) {
    if (i === 0) {
      result += s[0];
      continue;
    }

    result += args[i - 1] + s[i];
  }

  return result.replace(/^([\s\r\n])+/gm, "").replace(/$\n?/, "\n");
};

const display = Effect.fn("display")(function* (
  s: string | TemplateStringsArray,
  ...args: string[]
) {
  const terminal = yield* Terminal.Terminal;
  yield* terminal.display(displayLines(s, ...args));
});

const choice = Effect.fn("choice")(function* <
  C extends Record<string, Effect.Effect<any, any, any>>,
>(choices: C) {
  const terminal = yield* Terminal.Terminal;

  const prompt = display`Enter an option [${Object.keys(choices).join(",")}]`;

  let input: string = "";

  while (!(input in choices)) {
    yield* prompt;
    input = (yield* terminal.readInput).key.name.toLowerCase();
  }

  return yield* choices[input];
});

export const dragon = Command.make("dragon", {}, ({}) => {
  const e = Effect.gen(function* () {
    yield* display`
  [F] go to the forest
  [S] show stats`;

    yield* choice({ a: display`AAAAA` });
  });

  return e;
});
