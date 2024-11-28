import { Command } from "@effect/cli"
import { Console, Effect } from "effect"
import { gpt } from "./gpt"

const command = Command.make(",m", {}, () =>
  Console.log("Bun Monolith")
).pipe(Command.withSubcommands([gpt]))

export const cli = Command.run(command, {
  name: "Bun Monolith CLI",
  version: "v1.0.0"
})

