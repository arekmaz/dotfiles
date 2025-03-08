import { Command } from "@effect/cli";
import { FetchHttpClient } from "@effect/platform";
import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { build } from "./build.ts";
import { cmt } from "./cmt.ts";
import { gpt } from "./gpt.ts";
import { ollama } from "./ollama.ts";
import { sb } from "./sb.ts";
import { tictactoe } from "./tictactoe.tsx";
import { ch } from "./ch.ts";
import { weather } from "./weather.ts";
import { md2html } from "./md2html.ts";
import * as misc from "./misc.ts";

const command = Command.make(",m").pipe(
  Command.withSubcommands([
    gpt,
    tictactoe,
    sb,
    cmt,
    build,
    ch,
    weather,
    ollama,
    md2html,
    ...Object.values(misc),
  ]),
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
