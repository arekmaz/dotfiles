import { Config, Effect } from "effect";

export const home = Config.nonEmptyString("HOME")
export const scriptsHome = home.pipe(Effect.map(home => home + '/scripts'))
export const bunHome = scriptsHome.pipe(Effect.map(home => home + '/bun'))
