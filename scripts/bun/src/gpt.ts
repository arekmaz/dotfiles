import { Args, Command, Options } from "@effect/cli";
import {
  FileSystem,
  HttpBody,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Console, Effect, Schema } from "effect";

const home = Bun.env.HOME || "~";
const defaultKeyPath = `${home}/.chatgpt-key`;

const defaultModel = "gpt-4o";

const historyFilePath = `${home}/.gpt-history`;
const lastAnswerFilePath = `${home}/.gpt-last-conv`;

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
      const fs = yield* FileSystem.FileSystem;

      if (!(yield* fs.exists(keyfile))) {
        yield* Console.log(`keyfile ${keyfile} not found`);
        return;
      }

      const openApiApiKey = yield* fs.readFileString(keyfile);

      if (!openApiApiKey) {
        yield* Console.log(`keyfile ${keyfile} is empty`);
        return;
      }

      const stdin = yield* readStdin;

      const content = `${codeOnly ? "output just valid code:\n" : ""}
      ${prompt.concat([stdin]).join(" ")}`

      const data = { model, messages: [{ role: "user", content }] };

      const stringifiedData = JSON.stringify(data, null, 2);

      yield* fs.writeFileString(historyFilePath, stringifiedData + "\n", { flag: "a" });
      yield* fs.writeFileString(lastAnswerFilePath, stringifiedData + "\n", { flag: "w" });

      const openAiRequest = HttpClientRequest.post(
        "https://api.openai.com/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${openApiApiKey}`,
          },
          body: HttpBody.text(stringifiedData, "application/json"),
        },
      );

      const response = yield* HttpClient.execute(openAiRequest).pipe(
        Effect.flatMap(
          HttpClientResponse.schemaBodyJson(
            Schema.Struct({
              choices: Schema.NonEmptyArray(
                Schema.Struct({
                  message: Schema.Struct({ content: Schema.String }),
                }),
              ),
            }),
          ),
        ),
        Effect.scoped,
        Effect.tapError(Console.error),
        Effect.orElseSucceed(() => null),
      );

      if (response === null) {
        yield* Console.error("response error");
        return;
      }

      let responseContent = response.choices[0].message.content;

      if (
        responseContent.startsWith("```") &&
        responseContent.endsWith("```")
      ) {
        responseContent = responseContent
          .replace(/```.*\n/, "")
          .replace(/\n```/, "");
      }

      yield* Console.log(responseContent);

      yield* fs.writeFileString(historyFilePath, responseContent + "\n\n", {
        flag: "a",
      });

      yield* fs.writeFileString(lastAnswerFilePath, responseContent + "\n", {
        flag: "a",
      });
    });

    return e;
  },
);
