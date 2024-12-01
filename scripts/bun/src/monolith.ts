import { Command } from "@effect/cli";
import { FetchHttpClient } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { build } from "./build.js";
import { cmt } from "./cmt.js";
import { gpt } from "./gpt.js";
import { sb } from "./sb.js";
import { tictactoe } from "./tictactoe.jsx";

const command = Command.make(",m").pipe(
  Command.withSubcommands([gpt, tictactoe, sb, cmt, build]),
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
