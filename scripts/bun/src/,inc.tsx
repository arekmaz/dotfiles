import { $ } from "bun";

await $`open -na "Google Chrome" --args --incognito ${{
  raw: process.argv.slice(2).join(" "),
}}`;
