import { Command } from "@effect/cli";
import { Terminal } from "@effect/platform";
import { Effect } from "effect";

const home = Bun.env.HOME || "~";

const displayLines = (s: string | TemplateStringsArray, ...args: string[]) => {
  if (typeof s === "string") {
    return s.replace(/^([\s\r\n])+/gm, "").replace(/\n?$/, "\n");
  }

  let result = "";

  for (let i = 0; i < s.length; i++) {
    if (i === 0) {
      result += s[0];
      continue;
    }

    result += args[i - 1] + s[i];
  }

  return result.replace(/^([\s\r\n])+/gm, "").replace(/\n?$/, "\n");
};

const display = Effect.fn("display")(function* (
  s: string | TemplateStringsArray,
  ...args: string[]
) {
  const terminal = yield* Terminal.Terminal;
  yield* terminal.display(displayLines(s, ...args));
});

const newLine = display``;

const choice = Effect.fn("choice")(function* <
  C extends Record<string, Effect.Effect<any, any, any>>,
>(choices: C) {
  const terminal = yield* Terminal.Terminal;

  const prompt = display`Enter an option [${Object.keys(choices)
    .map((l) => l.toUpperCase())
    .join(",")}]:`;

  let input: string = "";

  while (!(input in choices)) {
    yield* prompt;
    yield* newLine;
    input = (yield* terminal.readInput).key.name.toLowerCase();
  }

  return yield* choices[input];
});

const quit = Effect.sync(() => process.exit(0));

export const dragon = Command.make("dragon", {}, ({}) => {
  const game = Effect.gen(function* (): any {
    yield* display`Game started`;
    yield* newLine;

    yield* townSquare();

    yield* newLine;
    yield* display`Game finished`;
    yield* newLine;
    yield* display`-------------`;
    yield* newLine;

    yield* game;
  });

  return game;
});

const townSquare = Effect.fn("townSquare")(function* () {
  yield* display`
  Welcome to the Town Square, where do you want to go?
  `;
  yield* newLine;
  yield* display`
  [F] go to the forest
  [B] swords and armours
  [H] town's healer
  [I] the inn
  [S] show stats
  [Q] quit the game`;
  yield* newLine;

  yield* choice({
    f: forest(),
    b: display`shop`,
    h: display`healer`,
    i: display`the inn`,
    s: stats(),
    q: display`quitting...`.pipe(Effect.zipRight(quit)),
  });
});

const stats = Effect.fn("stats")(function* () {
  yield* display`Stats`;
});

const forest = Effect.fn("forest")(function* (): any {
  yield* display`You arrive at the deep dark forest`;
  yield* display``;
  yield* display`
    What do you do next?
  [L] look for something to kill
  [S] show stats
  [R] return to the town square`;

  yield* choice({
    l: display`looking`,
    s: stats(),
    r: townSquare(),
  });
});
