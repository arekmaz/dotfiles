import { Command, Options } from "@effect/cli";
import { Console, Effect } from "effect";
import { toMdast } from "./md2html/html/toMdast.ts";
import { toText } from "./md2html/html/toText.ts";
// forked from https://github.com/streamich/very-small-parser
import { markdown, html } from "./md2html/index.ts";
import { toHast } from "./md2html/markdown/block/toHast.ts";
import { toText as mdBlockToText } from "./md2html/markdown/block/toText.ts";
import { stdinString } from "./stdin.ts";


const reverse = Options.boolean("reverse").pipe(Options.withAlias("r"));

export const md2html = Command.make("md2html", { reverse }, ({ reverse }) => {
  const e = Effect.gen(function* () {
    const stdin = yield* stdinString;

    if (reverse) {
      const hast = html.html.parse(stdin);
      const mdast = toMdast(hast as any);
      const text = mdBlockToText(mdast);

      yield* Console.log(text);

      return;
    }

    const mdast = markdown.block.parse(stdin);
    const hast = toHast(mdast);
    const htmlOutput = toText(hast);

    yield* Console.log(htmlOutput);
  });

  return e;
});
