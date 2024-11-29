import { Command } from "@effect/cli"
import { Console } from "effect"
import { gpt } from "./gpt.js"
import { tictactoe } from "./tictactoe.jsx"
import { sb } from "./sb.js"

const command = Command.make(",m", {}, () =>
  Console.log("Bun Monolith")
).pipe(Command.withSubcommands([gpt, tictactoe, sb]))

export const cli = Command.run(command, {
  name: "Bun Monolith CLI",
  version: "v1.0.0"
})

