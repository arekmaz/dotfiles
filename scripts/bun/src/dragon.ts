import { Command } from "@effect/cli";
import { Terminal } from "@effect/platform";
import { Effect, identity, Ref } from "effect";

export class Player extends Effect.Service<Player>()("Player", {
  effect: Effect.gen(function* () {
    const data = yield* Ref.make<{ health: number; level: number }>({
      health: 20,
      level: 1,
    });
    const level = Effect.map(data, (d) => d.level);

    const maxHealth = Effect.map(data, (d) => d.level * 2 + 10);

    const health = Effect.map(data, (d) => d.health);

    const updateHealth = (fn: (o: number) => number) =>
      Ref.update(data, (d) => ({ ...d, health: fn(d.health) }));

    return { updateHealth, health, level, maxHealth };
  }),
}) {}

const displayLines = (s: string | TemplateStringsArray, ...args: any[]) => {
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
  ...args: any[]
) {
  const terminal = yield* Terminal.Terminal;
  yield* terminal.display(displayLines(s, ...args));
});

const newLine = display``;

const choice = Effect.fn("choice")(function* <
  A,
  E,
  R,
  C extends Record<string, Effect.Effect<A, E, R>>,
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
const clearScreen = Effect.sync(console.clear);

export const dragon = Command.make("dragon", {}, ({}) => {
  const game = Effect.gen(function* (): any {
    yield* clearScreen;
    yield* display`Game started`;
    yield* newLine;

    yield* townSquareIntro;
    yield* townSquare();

    yield* newLine;
    yield* display`Game finished`;
    yield* newLine;
    yield* display`-------------`;
    yield* newLine;
    yield* Effect.sleep(2000);

    yield* game;
  }).pipe(Effect.provide(Player.Default));

  return game;
});

const townSquareIntro = Effect.zipRight(
  display`
  Welcome to the Town Square, where do you want to go?
  `,
  newLine,
);

const townSquare = Effect.fn("townSquare")(function* (): any {
  yield* display`
  [F] go to the forest
  [B] swords and armours
  [H] town's healer
  [I] the inn
  [S] show stats
  [Q] quit the game`;
  yield* newLine;

  yield* choice({
    f: clearScreen.pipe(
      Effect.zipRight(forestIntro),
      Effect.zipRight(forest()),
    ),
    b: display`shop`.pipe(Effect.zipRight(townSquare())),
    h: display`healer`.pipe(Effect.zipRight(townSquare())),
    i: clearScreen.pipe(
      Effect.zipRight(innIntro),
      Effect.zipRight(townSquare()),
    ),
    s: stats().pipe(Effect.zipRight(townSquare())),
    q: display`quitting...`.pipe(Effect.zipRight(quit)),
  });
});

const stats = Effect.fn("stats")(function* () {
  yield* display`Stats:`;
  yield* newLine;

  const { health, level, maxHealth } = yield* Player.use(identity);

  yield* display`
    Health: ${health}/${maxHealth}
    Level: ${level}
  `;

  yield* newLine;
});

const forestIntro = Effect.zipRight(
  display`You arrive at the deep dark forest`,
  newLine,
);

const forest = Effect.fn("forest")(function* (): any {
  yield* display`
    What do you do next?
  [L] look for something to kill
  [S] show stats
  [R] return to the town square`;

  yield* choice({
    l: display`looking`.pipe(Effect.zipRight(forest())),
    s: stats().pipe(Effect.zipRight(forest())),
    r: clearScreen.pipe(
      Effect.zipRight(townSquareIntro),
      Effect.zipRight(townSquare()),
    ),
  });
});

const innIntro = display`Welcome to the Town's Inn, it's awfully crowded today`;

const inn = Effect.fn("inn")(function* (): any {
  yield* display``;
  yield* display`
    What do you do next?
  [N] check town newsboard
  [S] show stats
  [R] return to the town square`;

  yield* choice({
    n: display`news board`.pipe(Effect.zipRight(inn())),
    s: stats().pipe(Effect.zipRight(inn())),
    r: clearScreen.pipe(
      Effect.zipRight(townSquareIntro),
      Effect.zipRight(townSquare()),
    ),
  });
});
