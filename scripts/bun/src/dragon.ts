import { Command } from "@effect/cli";
import { Terminal } from "@effect/platform";
import { Effect, Random, Ref } from "effect";

const weapons = { stick: 2, dagger: 5 };
type Weapon = keyof typeof weapons;

type Eq = { weapon: Weapon };

const maxHealth = (level: number) => 20 + (level - 1) * 2;

const requiredLvlExp = [200, 500, 700, 1000, 2000];

const getExpRequiredForLvl = (lvl: number) =>
  requiredLvlExp[Math.min(lvl - 1, requiredLvlExp.length - 1)];

const lvlByExp = (exp: number) => {
  let result = 0;
  let expLeft = exp;

  for (const required of requiredLvlExp) {
    result++;
    if (expLeft < required) {
      return result;
    }
    expLeft -= required;
  }

  return result;
};

const startingExp = 0;
const startingLevel = lvlByExp(startingExp);

export class Player extends Effect.Service<Player>()("Player", {
  effect: Effect.gen(function* () {
    const data = yield* Ref.make<{
      name: string;
      health: number;
      level: number;
      eq: Eq;
      gold: number;
      exp: number;
    }>({
      name: "Player",
      health: maxHealth(startingLevel),
      level: startingLevel,
      eq: { weapon: "stick" },
      gold: 500,
      exp:
        startingExp -
        requiredLvlExp.slice(0, startingLevel - 1).reduce((a, b) => a + b, 0),
    });

    return data;
  }),
}) {
  static data = this.use((s) => s);

  static name = Effect.map(this.data, (d) => d.name);

  static eq = Effect.map(this.data, (d) => d.eq);

  static level = Effect.map(this.data, (d) => d.level);
  static exp = Effect.map(this.data, (d) => d.exp);

  static gold = Effect.map(this.data, (d) => d.gold);
  static updateGold = (fn: (o: number) => number) =>
    this.use((d) => Ref.update(d, (o) => ({ ...o, gold: fn(o.gold) })));

  static health = Effect.map(this.data, (d) => d.health);
  static maxHealth = Effect.map(this.data, (d) => maxHealth(d.level));
  static updateHealth = (fn: (o: number) => number) =>
    this.use((d) => Ref.update(d, (o) => ({ ...o, health: fn(o.health) })));
}

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

const displayYield = Effect.fn("displayYield")(function* (
  s: string | TemplateStringsArray = `Press <ENTER> to continue`,
  ...args: any[]
) {
  const terminal = yield* Terminal.Terminal;

  yield* display(s, ...args);
  while (true) {
    const input = yield* terminal.readInput;

    if (input.key.name === "return") {
      break;
    }
  }
});

const newLine = display``;

const choice = <A, E, R, C extends Record<string, Effect.Effect<A, E, R>>>(
  choices: C,
) =>
  Effect.fn("choice")(function* (
    opts: {
      defaultOption?: keyof C & string;
      promptPrefix?: string;
    } = {},
  ) {
    const terminal = yield* Terminal.Terminal;

    let input: string = "";

    const prompt = display`${opts.promptPrefix ?? "Enter an option"} [${Object.keys(
      choices,
    )
      .map((c) => c.toUpperCase())
      .join(",")}]: ${opts.defaultOption ? `(${opts.defaultOption})` : ""}`;

    while (!(input in choices)) {
      yield* prompt;
      yield* newLine;
      input = (yield* terminal.readInput).key.name.toLowerCase();

      if (input === "return") {
        input = opts.defaultOption ?? "";
      }
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
  })();
});

const stats = Effect.fn("stats")(function* () {
  yield* display`--------------------------------`;
  yield* display`${yield* Player.name}'s stats:`;
  yield* display`--------------------------------`;
  yield* newLine;
  const level = yield* Player.level;

  yield* display`
    Health: ${yield* Player.health}/${yield* Player.maxHealth}
    Level: ${level}
    Exp: ${yield* Player.exp}/${getExpRequiredForLvl(level)}
    Equipped weapon: ${yield* Effect.map(Player.eq, (eq) => eq.weapon)}
  `;

  yield* newLine;
});

const forestIntro = Effect.zipRight(
  display`You arrive at the deep dark forest`,
  newLine,
);

const forestBackMsg = Effect.zipRight(
  display`You are back at the forest`,
  newLine,
);

const forest = Effect.fn("forest")(function* (): any {
  yield* display`
    What do you do next?
  [L] look for something to kill
  [S] show stats
  [R] return to the town square`;

  yield* choice({
    l: fight(),
    s: stats().pipe(Effect.zipRight(forest())),
    r: clearScreen.pipe(
      Effect.zipRight(townSquareIntro),
      Effect.zipRight(townSquare()),
    ),
  })();
});

const fight = Effect.fn("fight")(function* () {
  const opponent = { name: "Small Goblin", power: 2, maxHealth: 5 };

  const opRef = yield* Ref.make(opponent.maxHealth);

  const intro = display`You meet ${opponent.name}, power ${opponent.power}, health: ${yield* opRef}/${opponent.maxHealth}`;

  const lvl = yield* Player.level;

  const playerStrike = Random.nextIntBetween(1, lvl * 3).pipe(
    Effect.tap((dmg) => Ref.update(opRef, (h) => h - dmg)),
  );

  const opStrike = Random.nextIntBetween(1, opponent.power).pipe(
    Effect.tap((dmg) => Player.updateHealth((h) => h - dmg)),
  );

  const opIsAlive = Effect.map(opRef, (h) => h > 0);
  const playerIsAlive = Effect.map(Player.health, (h) => h > 0);

  const fightStats = Effect.gen(function* () {
    yield* display`
      ${yield* Player.name}: ${yield* Player.health}/${yield* Player.maxHealth}
      ${opponent.name}: ${yield* opRef}/${opponent.maxHealth}`;
  });

  yield* clearScreen;

  yield* intro;
  yield* newLine;

  yield* Random.nextBoolean.pipe(
    Effect.flatMap((playerStarts) =>
      playerStarts
        ? Effect.flatMap(
            playerStrike,
            (dmg) =>
              display`You manage to strike it first, dealing ${dmg} damage`,
          )
        : Effect.flatMap(
            opStrike,
            (dmg) => display`It suprises you, dealing you ${dmg} damage`,
          ),
    ),
  );

  yield* newLine;

  yield* fightStats;

  yield* newLine;

  while ((yield* playerIsAlive) && (yield* opIsAlive)) {
    yield* display`
    What do you do next?
  [A] Attack
  [S] Stats
  [R] Run for your life`;

    yield* choice({
      a: Effect.gen(function* () {
        const dmg = yield* playerStrike;
        yield* display`You strike ${opponent.name}, dealing ${dmg} damage.`;

        if (!(yield* opIsAlive)) {
          return;
        }

        const opDmg = yield* opStrike;
        yield* display`${opponent.name}, strikes you back, dealing ${opDmg} damage.`;

        yield* newLine;

        yield* fightStats;
      }),

      s: fightStats,
      r: Random.nextIntBetween(3, 6).pipe(
        Effect.tap((lost) => Player.updateGold((g) => Math.max(0, g - lost))),
        Effect.flatMap((lost) => display`You escape, losing ${lost} gold`),
      ),
    })();

    yield* newLine;
  }

  if (!(yield* opIsAlive)) {
    yield* display`You killed ${opponent.name}`;
    yield* newLine;
    yield* displayYield();
  }

  yield* clearScreen;
  yield* forestBackMsg;
  yield* forest();
});

const innIntro = display`Welcome to the Town's Inn, it's awfully crowded today`;

const inn = Effect.fn("inn")(function* (): any {
  yield* newLine;
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
  })();
});
