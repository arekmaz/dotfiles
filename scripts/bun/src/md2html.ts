import { Command } from "@effect/cli";
import { Console, Effect } from "effect";

const readStdin = Effect.promise(async () => {
  if (process.stdin.isTTY) {
    return "";
  }

  let stdin = "";

  for await (const line of console) {
    stdin += "\n" + line;
  }

  return stdin;
});

export const md2html = Command.make("md2html", {}, () => {
  const e = Effect.gen(function* () {
    const stdIn = yield* readStdin;

    function escapeHtml(str: string) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function parseMarkdown(md: string) {
      let html = "";
      const lines = md.split("\n");
      let inCodeBlock = false;

      for (let line of lines) {
        line = line.trim();

        if (line.startsWith('#')) {
        continue}

        if (line.startsWith("```")) {
          if (!inCodeBlock) {
            html += "<pre><code>";
          } else {
            html += "</code></pre>\n";
          }
          inCodeBlock = !inCodeBlock;
          continue;
        }

        if (inCodeBlock) {
          html += escapeHtml(line) + "\n";
          continue;
        }

        // Headings
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          html += `<h${level}>${escapeHtml(headingMatch[2])}</h${level}>\n`;
          continue;
        }

        // Bold & Italics
        line = line
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/__(.*?)__/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/_(.*?)_/g, "<em>$1</em>")
          .replace(/`([^`]+)`/g, "<code>$1</code>");

        // Blockquote
        if (line.startsWith(">")) {
          html += `<blockquote>${escapeHtml(line.substring(1).trim())}</blockquote>\n`;
          continue;
        }

        // Horizontal Rule
        if (/^---+$/.test(line)) {
          html += "<hr>\n";
          continue;
        }

        // Lists
        if (/^(\*|-)\s+/.test(line)) {
          html += `<ul><li>${escapeHtml(line.substring(2))}</li></ul>\n`;
          continue;
        }

        if (/^\d+\.\s+/.test(line)) {
          html += `<ol><li>${escapeHtml(line.replace(/^\d+\.\s+/, ""))}</li></ol>\n`;
          continue;
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
          html += `<p>${line}</p>\n`;
        }
      }

      return html;
    }

    yield* Console.log(parseMarkdown(stdIn))
  });

  return e;
});
