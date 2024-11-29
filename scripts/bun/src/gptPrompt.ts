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

export const gptPrompt = (
  prompt: string,
  { keyfile = defaultKeyPath, saveAnswers = true, model = defaultModel } = {},
) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;

    if (!(yield* fs.exists(keyfile))) {
      yield* Effect.fail(`keyfile ${keyfile} not found`);
      throw undefined; // should not be reached
    }

    const openApiApiKey = yield* fs.readFileString(keyfile);

    if (!openApiApiKey) {
      yield* Effect.fail(`keyfile ${keyfile} is empty`);
      throw undefined; // should not be reached
    }

    const data = { model, messages: [{ role: "user", content: prompt }] };

    const stringifiedData = JSON.stringify(data, null, 2);

    if (saveAnswers) {
      yield* fs.writeFileString(historyFilePath, stringifiedData + "\n", {
        flag: "a",
      });
      yield* fs.writeFileString(lastAnswerFilePath, stringifiedData + "\n", {
        flag: "w",
      });
    }

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
      yield* Effect.fail("bad response from chatgpt");
      throw undefined; // should not be reached
    }

    let responseContent = response.choices[0].message.content;

    yield* fs.writeFileString(historyFilePath, responseContent + "\n\n", {
      flag: "a",
    });

    yield* fs.writeFileString(lastAnswerFilePath, responseContent + "\n", {
      flag: "a",
    });

    return responseContent;
  });
