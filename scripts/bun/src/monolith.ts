import { Command } from "@effect/cli";
import { Console, Effect } from "effect";
import { gpt } from "./gpt.js";
import { tictactoe } from "./tictactoe.jsx";
import { sb } from "./sb.js";
import { cmt } from "./cmt.js";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { FetchHttpClient } from "@effect/platform";

const command = Command.make(",m", {}, () => Console.log("Bun Monolith")).pipe(
  Command.withSubcommands([gpt, tictactoe, sb, cmt]),
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
