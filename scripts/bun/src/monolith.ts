import { Command } from "@effect/cli";
import { FetchHttpClient } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { build } from "./build.js";
import { cmt } from "./cmt.js";
import { gpt } from "./gpt.js";
import { ollama } from "./ollama.js";
import { sb } from "./sb.js";
import { tictactoe } from "./tictactoe.jsx";
import { ch } from "./ch.js";
import { weather } from "./weather.js";
import * as misc from "./misc.js"

const command = Command.make(",m").pipe(
  Command.withSubcommands([gpt, tictactoe, sb, cmt, build, ch, weather, ollama, ...Object.values(misc)]),
);

const cli = Command.run(command, {
  name: "Bun Monolith CLI",
  version: "v1.0.0",
});

cli(process.argv).pipe(
  Effect.provide(BunContext.layer),
  Effect.provide(FetchHttpClient.layer),
  BunRuntime.runMain,
);
