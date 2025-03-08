import { Command } from "@effect/cli";
import { Console, Effect, Stream } from "effect";
import { stdinStream } from "./stdin.ts";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const md2html = Command.make("md2html", {}, () => {
  const e = Effect.gen(function* () {
    let inCodeBlock = false;

    const stdin = yield* stdinStream

    stdin.pipe(
      Stream.flatMap((data) => {
        let line = data.trim();

        if (!line || line.startsWith("#")) {
          return Stream.empty;
        }

        if (line.startsWith("```")) {
          const isInCodeBlock = inCodeBlock;

          inCodeBlock = !isInCodeBlock;

          return Stream.succeed(
            isInCodeBlock ? "</code></pre>" : "<pre><code>",
          );
        }

        if (inCodeBlock) {
          return Stream.succeed(escapeHtml(line));
        }

        // Preserve raw HTML
        if (
          /^\s*<[^>]+>.*<\/[^>]+>\s*$/.test(line) ||
          /^\s*<[^>]+\/?>\s*$/.test(line)
        ) {
          return Stream.succeed(line);
        }

        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);

        if (headingMatch) {
          const level = headingMatch[1].length;
          return Stream.succeed(
            `<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`,
          );
        }

        line = line
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/__(.*?)__/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/_(.*?)_/g, "<em>$1</em>")
          .replace(/`([^`]+)`/g, "<code>$1</code>");

        if (line.startsWith(">")) {
          return Stream.succeed(
            `<blockquote>${escapeHtml(line.substring(1).trim())}</blockquote>`,
          );
        }

        // Horizontal Rule
        if (/^---+$/.test(line)) {
          return Stream.succeed("<hr>");
        }

        // Lists
        if (/^(\*|-)\s+/.test(line)) {
          return Stream.succeed(
            `<ul><li>${escapeHtml(line.substring(2))}</li></ul>`,
          );
        }

        if (/^\d+\.\s+/.test(line)) {
          return Stream.succeed(
            `<ol><li>${escapeHtml(line.replace(/^\d+\.\s+/, ""))}</li></ol>`,
          );
        }

        // Links
        line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Images
        line = line.replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          '<img src="$2" alt="$1">',
        );

        // Paragraphs
        if (line) {
          return Stream.succeed(`<p>${line}</p>`);
        }

        return Stream.succeed(line);
      }),
      Stream.runForEach(Console.log),
    );
  });

  return e;
});
