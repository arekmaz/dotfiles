import { Command } from "@effect/cli"
import { Console, Effect } from "effect"

const command = Command.make(",m", {}, () =>
  Console.log("Bun Monolith")
)

export const cli = Command.run(command, {
  name: "Bun Monolith CLI",
  version: "v1.0.0"
})

