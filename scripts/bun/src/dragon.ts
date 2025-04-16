import { Command } from "@effect/cli";
import { Terminal } from "@effect/platform";
import { Effect, Random, Ref, Schema } from "effect";

const weapons = { stick: 2, dagger: 5 };
type Weapon = keyof typeof weapons;

type Eq = { weapon: Weapon };

type PlayerClass = "mage" | "assassin" | "warrior" | "archer";

const maxHealth = (level: number) => 20 + (level - 1) * 2;

const requiredLvlExp = [50, 100, 170, 250, 400];

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

export class Player extends Effect.Service<Player>()("Player", {
  effect: Effect.gen(function* () {
    const startingLvl = lvlByExp(startingExp);

    const data = yield* Ref.make<{
      name: string;
      health: number;
      eq: Eq;
      gold: number;
      exp: number;
      class: PlayerClass;
    }>({
      class: "warrior",
      name: "Player",
      health: maxHealth(startingLvl),
      eq: { weapon: "stick" },
      gold: 500,
      exp:
        startingExp -
        requiredLvlExp.slice(0, startingLvl - 1).reduce((a, b) => a + b, 0),
    });

    return data;
  }),
}) {
  static data = this.use((s) => s);

  static name = Effect.map(this.data, (d) => d.name);
  static class = Effect.map(this.data, (d) => d.class);

  static eq = Effect.map(this.data, (d) => d.eq);
  static weapon = Effect.map(this.data, (d) => d.eq.weapon);

  static level = Effect.map(this.data, (d) => lvlByExp(d.exp));
  static exp = Effect.map(this.data, (d) => d.exp);
  // returns how many level-ups did player get
  static addExp = (e: number) =>
    this.use((d) =>
      Ref.modify(d, (o) => [
        lvlByExp(o.exp + e) - lvlByExp(o.exp),
        { ...o, exp: o.exp + e },
      ]),
    );

  static gold = Effect.map(this.data, (d) => d.gold);
  static updateGold = (fn: (o: number) => number) =>
    this.use((d) => Ref.update(d, (o) => ({ ...o, gold: fn(o.gold) })));

  static health = Effect.map(this.data, (d) => d.health);
  static isAlive = Effect.map(this.data, (d) => d.health > 0);
  static maxHealth = Effect.map(this.data, (d) => maxHealth(lvlByExp(d.exp)));
  static updateHealth = (fn: (o: number) => number) =>
    this.use((d) => Ref.update(d, (o) => ({ ...o, health: fn(o.health) })));
}

const displayLines = (s: string | TemplateStringsArray, ...args: any[]) => {
  if (typeof s === "string") {
    return s
      .replace(/^[\n\r]+/, "")
      .replace(/^([\s])+/gm, "")
      .replace(/\n?$/, "\n");
  }

  let result = "";

  for (let i = 0; i < s.length; i++) {
    if (i === 0) {
      result += s[0];
      continue;
    }

    result += args[i - 1] + s[i];
  }

  return result
    .replace(/^[\n\r]+/, "")
    .replace(/^([ ])+/gm, "")
    .replace(/\n?$/, "\n");
};

const display = Effect.fn("display")(function* (
  s: string | TemplateStringsArray,
  ...args: any[]
) {
  const terminal = yield* Terminal.Terminal;
  yield* terminal.display(displayLines(s, ...args));
});

const displayYield = Effect.fn("displayYield")(function* (
  s?: string | TemplateStringsArray,
  ...args: any[]
) {
  const terminal = yield* Terminal.Terminal;

  if (s !== undefined) {
    yield* display(s, ...args);
  }

  yield* display(`Press <ENTER> to continue`);
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
      .join(
        ",",
      )}]: ${opts.defaultOption ? `(${opts.defaultOption.toUpperCase()})` : ""}`;

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
});

const restartGameIfPlayerIsDead = Effect.gen(function* () {
  if (yield* Player.isAlive) {
    return;
  }

  yield* Player.updateGold(() => 0);
  const maxHealth = yield* Player.maxHealth;
  yield* Player.updateHealth(() => maxHealth);
  yield* displayYield`You died, you lost your gold, the game will restart`;
  yield* game;
});

const gameSetup = Effect.gen(function* () {
  const terminal = yield* Terminal.Terminal;
  const ref = yield* Player;

  yield* display`Welcome to the dragon game`;
  yield* newLine;
  yield* display`What's your name?`;

  const readName: Effect.Effect<string, never, Terminal.Terminal> =
    terminal.readLine.pipe(
      Effect.flatMap(
        Schema.decode(
          Schema.Trim.pipe(Schema.nonEmptyString(), Schema.maxLength(100)),
        ),
      ),
      Effect.tapError(() => display`Your name cannot be empty`),
      Effect.orElse(() => readName),
    );

  const userName = yield* readName;
  yield* Ref.update(ref, (data) => ({ ...data, name: userName }));

  yield* display`
    Hello, ${userName}!

    What is your class?
      [M] mage
      [A] assassin
      [W] warrior
      [R] archer`;

  yield* choice({
    m: Ref.update(ref, (data) => ({ ...data, class: "mage" as const })),
    a: Ref.update(ref, (data) => ({ ...data, class: "assassin" as const })),
    w: Ref.update(ref, (data) => ({ ...data, class: "warrior" as const })),
    r: Ref.update(ref, (data) => ({ ...data, class: "archer" as const })),
  })();
});

export const dragon = Command.make("dragon", {}, ({}) => {
  return gameSetup.pipe(Effect.zipRight(game), Effect.provide(Player.Default));
});

const townSquareIntro = Effect.zipRight(
  display`
  Welcome to the Town Square, where do you want to go?
  `,
  newLine,
);

const townSquare = Effect.fn("townSquare")(function* (): any {
  yield* display`
  [F] Go to the forest
  [W] Swords and armours
  [H] Town's healer
  [B] Bank
  [I] The inn
  [S] Show stats
  [Q] Quit the game`;
  yield* newLine;

  yield* choice({
    f: clearScreen.pipe(
      Effect.zipRight(forestIntro),
      Effect.zipRight(forest()),
    ),
    w: display`shop`.pipe(Effect.zipRight(townSquare())),
    b: display`bank`.pipe(Effect.zipRight(townSquare())),
    h: Effect.all([clearScreen, healerIntro, healer(), townSquare()]),
    i: Effect.all([clearScreen, innIntro, inn(), townSquare()]),
    s: stats().pipe(Effect.zipRight(townSquare())),
    q: display`quitting...`.pipe(Effect.zipRight(quit)),
  })({ defaultOption: "s" });
});

const stats = Effect.fn("stats")(function* () {
  yield* display`--------------------------------`;
  yield* display`${yield* Player.name}'s stats:`;
  yield* display`--------------------------------`;
  yield* newLine;
  const level = yield* Player.level;

  yield* display`
    Name: ${yield* Player.name}
    Class: ${yield* Player.class}
    Health: ${yield* Player.health}/${yield* Player.maxHealth}
    Level: ${level}
    Exp: ${yield* Player.exp}/${getExpRequiredForLvl(level)}
    Equipped weapon: ${yield* Effect.map(Player.eq, (eq) => eq.weapon)}
    Gold: ${yield* Player.gold}
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
  })({ defaultOption: "s" });
});

const fight = Effect.fn("fight")(function* () {
  const opponents: { name: string; power: number; maxHealth: number }[] = [
    { name: "Small Goblin", power: 2, maxHealth: 5 },
    { name: "Medium Goblin", power: 3, maxHealth: 7 },
    { name: "Big Goblin", power: 5, maxHealth: 10 },
  ];

  const randomOpponent = Random.nextIntBetween(0, opponents.length).pipe(
    Effect.map((i) => opponents[i]),
  );

  const opponent = yield* randomOpponent;

  const opRef = yield* Ref.make(opponent.maxHealth);

  const intro = display`You meet ${opponent.name}, power ${opponent.power}, health: ${yield* opRef}/${opponent.maxHealth}`;

  const lvl = yield* Player.level;

  const playerStrike = Random.nextIntBetween(
    1,
    lvl * 3 + weapons[yield* Player.weapon],
  ).pipe(Effect.tap((dmg) => Ref.update(opRef, (h) => Math.max(h - dmg))));

  const opStrike = Random.nextIntBetween(1, opponent.power).pipe(
    Effect.tap((dmg) => Player.updateHealth((h) => Math.max(0, h - dmg))),
  );

  const opIsAlive = Effect.map(opRef, (h) => h > 0);

  const fightStats = Effect.gen(function* () {
    yield* display`
      ${yield* Player.name}: ${yield* Player.health}/${yield* Player.maxHealth}
      ${opponent.name}: ${yield* opRef}/${opponent.maxHealth}`;
  });
  const continueAfter = Effect.all([clearScreen, forestBackMsg, forest()]);

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

  while ((yield* Player.isAlive) && (yield* opIsAlive)) {
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
        Effect.zipRight(continueAfter),
      ),
    })({ defaultOption: "s" });

    yield* newLine;
  }

  if (!(yield* opIsAlive)) {
    const gainedExp = yield* Random.nextIntBetween(
      Math.round(opponent.maxHealth * 0.5),
      Math.round(opponent.maxHealth * 1.5),
    );
    const gainedGold = yield* Random.nextIntBetween(
      Math.round(opponent.power * 0.5),
      Math.round(opponent.power * 1.5),
    );

    const gainedLevels = yield* Player.addExp(gainedExp);
    yield* Player.updateGold((g) => g + gainedGold);
    yield* display`You killed ${opponent.name} gaining ${gainedExp} exp and ${gainedGold} gold`;
    if (gainedLevels > 0) {
      yield* display`You gained a new level: LEVEL ${yield* Player.level}`;
    }
    yield* newLine;
    yield* displayYield();
  }

  yield* restartGameIfPlayerIsDead;

  yield* continueAfter;
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
  })({ defaultOption: "s" });
});

const healthPointCost = 5;
const healerIntro = display`Welcome to the healer's office, he'll service you right away
The cost is ${healthPointCost} gold for every 1 point of health restored

What do you need?
  `;

const healer = Effect.fn("healer")(function* (): any {
  const playerMaxHealth = yield* Player.maxHealth;

  const healFull = Player.pipe(
    Effect.flatMap((ref) =>
      Ref.modify(ref, (data) => {
        const healthToRestore = playerMaxHealth - data.health;

        if (data.gold >= healthToRestore * healthPointCost) {
          const cost = healthToRestore * healthPointCost;
          return [
            {
              restoredHealth: healthToRestore,
              cost,
            },
            { ...data, health: playerMaxHealth, gold: data.gold - cost },
          ];
        }

        const maxHealthRestorable = Math.floor(data.gold / healthPointCost);
        const cost = maxHealthRestorable * healthPointCost;

        return [
          {
            restoredHealth: maxHealthRestorable,
            cost,
          },
          { ...data, health: playerMaxHealth, gold: data.gold - cost },
        ];
      }),
    ),
  );

  const healSpecified = Effect.gen(function* () {
    const terminal = yield* Terminal.Terminal;
    const data = yield* Player.data;
    const maxPointsAffordable = Math.min(
      Math.floor(data.gold / healthPointCost),
      playerMaxHealth - data.health,
    );
    yield* display`Enter the amount of health points (you can restore max ${maxPointsAffordable} points):`;

    const readAmount: Effect.Effect<number, never, Terminal.Terminal> =
      terminal.readLine.pipe(
        Effect.flatMap(
          Schema.decode(
            Schema.NumberFromString.pipe(
              Schema.int(),
              Schema.between(0, maxPointsAffordable),
            ),
          ),
        ),
        Effect.tapError(
          () =>
            display`Incorrect amount, enter a number between 0-${maxPointsAffordable}`,
        ),
        Effect.orElse(() => readAmount),
      );

    const healthToRestore = yield* readAmount;
    const cost = healthToRestore * healthPointCost;

    yield* Player.updateGold((g) => g - cost);
    yield* Player.updateHealth((h) => h + healthToRestore);

    return { restoredHealth: healthToRestore, cost };
  });

  yield* newLine;
  yield* display`
  [H] heal as much as possible with your gold
  [A] heal a speficied amount of points
  [S] show stats
  [R] return to the town square`;
  yield* newLine;

  yield* choice({
    h: healFull.pipe(
      Effect.tap(
        ({ cost, restoredHealth }) =>
          display`Restored ${restoredHealth}, ${cost} gold paid`,
      ),
      Effect.zipRight(healer()),
    ),
    a: healSpecified.pipe(
      Effect.tap(
        ({ cost, restoredHealth }) =>
          display`Restored ${restoredHealth}, ${cost} gold paid`,
      ),
      Effect.zipRight(healer()),
    ),
    s: stats().pipe(Effect.zipRight(healer())),
    r: clearScreen.pipe(
      Effect.zipRight(townSquareIntro),
      Effect.zipRight(townSquare()),
    ),
  })({ defaultOption: "s" });
});
