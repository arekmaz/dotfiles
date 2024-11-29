import { Args, Command, Options } from "@effect/cli";
import { Console, Effect } from "effect";
import { gptPrompt } from "./gptPrompt.js";

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

const model = Options.choice("model", [defaultModel, "gpt-3.5-turbo"]).pipe(
  Options.withAlias("m"),
  Options.withDefault(defaultModel),
);

const prompt = Args.text({ name: "prompt" }).pipe(Args.repeated);

const readStdin = Effect.promise(async () => {
  if (process.stdin.isTTY) {
    return "";
  }

  let stdin = "";

  for await (const line of console) {
    stdin += line;
  }

  return stdin;
});

export const gpt = Command.make(
  "gpt",
  { prompt, keyfile, model, codeOnly },
  ({ prompt, keyfile, model, codeOnly }) => {
    const e = Effect.gen(function* () {
      const stdin = yield* readStdin;

      const content = `${
        codeOnly
          ? `you will loose points if you output anything else than minimal valid working code:

`
          : ""
      }${prompt.concat([stdin]).join(" ")}`;

      let responseContent = yield* gptPrompt(content, { model, keyfile });

      if (
        codeOnly
      ) {
        responseContent = responseContent
        .replace(/[\s\S]*```.+\n/, "").replace(/```[\s\S]*/, '')
      }

      yield* Console.log(responseContent);
    });

    return e;
  },
);
