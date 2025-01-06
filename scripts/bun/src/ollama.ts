import { Args, Command, Options } from "@effect/cli";
import { Console, Effect } from "effect";
import { $ } from "bun";

const defaultModel = "llama3.2";

const codeOnly = Options.boolean("code-only").pipe(
  Options.withAlias("c"),
  Options.withDefault(false),
);

const models = [defaultModel] as const;

const model = Options.choice("model", models).pipe(
  Options.withAlias("m"),
  Options.withDefault(defaultModel),
);

const showModels = Options.boolean("show-models").pipe(
  Options.withDefault(false),
);

const prompt = Args.text({ name: "prompt" }).pipe(Args.repeated);

const readStdin = Effect.promise(async () => {
  if (process.stdin.isTTY) {
    return "";
  }

  let stdin = "";

  for await (const line of console) {
    stdin += "\n" + line;
  }

  return stdin;
});

const ts = Command.make(
  "ts",
  {
    prompt,
    model,
  },

  ({ prompt, model }) => {
    const e = Effect.gen(function* () {
      const stdin = yield* readStdin;

      const content = `you will loose points if you output anything else than minimal valid working code in typescript:

      }${prompt.concat([stdin]).join(" ")}`;

      let responseContent = yield* Effect.promise(() =>
        $`echo ${content} | ollama run ${model}`.text(),
      );

      if (codeOnly) {
        responseContent = responseContent
          .replace(/[\s\S]*```.+\n/, "")
          .replace(/\n```[\s\S]*/, "");
      }

      yield* Console.log(responseContent);
    });

    return e;
  },
);

export const ollama = Command.make(
  "oll",
  { prompt, model, codeOnly, showModels },
  ({ prompt, model, codeOnly, showModels }) => {
    const e = Effect.gen(function* () {
      if (showModels) {
        console.log(`Available models: ${models.join(", ")}`);
        return;
      }

      const stdin = yield* readStdin;

      const content = `${
        codeOnly
          ? `you will loose points if you output anything else than minimal valid working code:

`
          : ""
      }${prompt.concat([stdin]).join(" ")}`;


      let responseContent = yield* Effect.promise(() =>
        $`echo ${content} | ollama run ${model}`.text(),
      );

      if (codeOnly) {
        responseContent = responseContent
          .replace(/[\s\S]*```.+\n/, "")
          .replace(/\n```[\s\S]*/, "");
      }

      yield* Console.log(responseContent);
    });

    return e;
  },
).pipe(Command.withSubcommands([ts]));
