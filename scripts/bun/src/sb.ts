import { Args, Command } from "@effect/cli";
import { FileSystem } from "@effect/platform";
import { Config, Console, Effect, Schema } from "effect";

const filename = Args.text({ name: "filename" }).pipe(Args.repeated);

const sbHome = Config.nonEmptyString("SB_HOME");
const sbInbox = Config.nonEmptyString("SB_INBOX");

const newNote = Command.make("new", { filename }, ({ filename }) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;

    const name = yield* Schema.decodeUnknown(
      Schema.NonEmptyArray(
        Schema.NonEmptyString.pipe(Schema.pattern(/^[a-zA-Z0-9]+$/)),
      ),
    )(filename).pipe(Effect.map((chunks) => chunks.join("_") + ".md"));

    const inbox = yield* sbInbox;

    const newFilePath = inbox + "/" + name;

    if (yield* fs.exists(newFilePath)) {
      throw new Error(`file ${newFilePath} already exists, aborting...`);
    }

    const contentToWrite = `

























---
Links

Created ${new Date().toISOString()}
    `;

    yield* fs.writeFileString(newFilePath, contentToWrite);

    yield* Console.log(
      newFilePath.includes(" ") ? `"${newFilePath}"` : newFilePath,
    );
  }),
);

export const sb = Command.make("sb").pipe(Command.withSubcommands([newNote]));
