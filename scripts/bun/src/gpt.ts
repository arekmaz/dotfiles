import { Args, Command, Options } from "@effect/cli";
import { Console, Effect } from "effect";
import { gptPrompt } from "./gptPrompt.ts";
import { EOL } from "os";
import { stdinString } from "./stdin.ts";

const home = Bun.env.HOME || "~";
const defaultKeyPath = `${home}/.chatgpt-key`;

const defaultModel = "gpt-4o";

const keyfile = Options.file("keyfile").pipe(
  Options.withAlias("k"),
  Options.withDefault(defaultKeyPath),
);

const codeOnly = Options.boolean("code-only").pipe(
  Options.withAlias("c"),
  Options.withDefault(false),
);

const outputQuestion = Options.boolean("output-question").pipe(
  Options.withAlias("q"),
  Options.withDefault(false),
);

const models = [
  defaultModel,
  "gpt-3.5-turbo",
  "o1-mini",
  "o1-preview",
] as const;

const model = Options.choice("model", models).pipe(
  Options.withAlias("m"),
  Options.withDefault(defaultModel),
);

const showModels = Options.boolean("show-models").pipe(
  Options.withDefault(false),
);

const prompt = Args.text({ name: "prompt" }).pipe(Args.repeated);

const ts = Command.make(
  "ts",
  {
    prompt,
    keyfile,
    model,
  },

  ({ prompt, keyfile, model }) => {
    const e = Effect.gen(function* () {
      const stdin = yield* stdinString

      const content = `you will loose points if you output anything else than minimal valid working code in typescript:

      }${prompt.concat([stdin]).join(" ")}`;

      let responseContent = yield* gptPrompt(content, { model, keyfile });

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

export const gpt = Command.make(
  "gpt",
  { prompt, keyfile, model, codeOnly, showModels, outputQuestion },
  ({ prompt, keyfile, model, codeOnly, showModels, outputQuestion }) => {
    const e = Effect.gen(function* () {
      if (showModels) {
        console.log(`Available models: ${models.join(", ")}`);
        return;
      }

      const stdin = yield* readStdin;

      const question = prompt.concat([stdin]).join(" ").trim();

      const content = `${
        codeOnly
          ? `you will loose points if you output anything else than minimal valid working code:

`
          : ""
      }${question}`;

      let responseContent = yield* gptPrompt(content, { model, keyfile });

      if (codeOnly) {
        responseContent = responseContent
          .replace(/[\s\S]*```.+\n/, "")
          .replace(/\n```[\s\S]*/, "");
      }

      if (outputQuestion) {
        yield* Console.log(question + EOL);
      }

      yield* Console.log(responseContent);
    });

    return e;
  },
).pipe(Command.withSubcommands([ts]));
