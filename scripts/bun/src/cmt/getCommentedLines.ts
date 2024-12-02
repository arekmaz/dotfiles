import { FileSystem } from "@effect/platform";
import { Effect } from "effect";
import { invariant } from "../invariant.js";
import { commentJsxLines } from "./commentTsx.js";

const getLowestIndentation = (lines: string[]) => {
  let lowestIndentation:
    | null
    | { type: "no-indent" }
    | { count: number; type: "space" | "tab" } = null;

  const singleIndentDescriptor = (indent: string) => {
    const [spaceMatch] = indent.match(/^ +$/) ?? [];

    if (spaceMatch) {
      return { type: "space" as const, count: spaceMatch.length };
    }

    const [tabMatch] = indent.match(/^\t+$/) ?? [];

    if (tabMatch) {
      return { type: "tab" as const, count: tabMatch.length };
    }

    invariant(false, `invalid indentation test "${indent}"`);
  };

  for (const line of lines) {
    const [indentMatch] = line.match(/^(?: +|\t+)/) ?? [];

    if (
      !indentMatch &&
      (lowestIndentation === null || lowestIndentation.type === "no-indent")
    ) {
      lowestIndentation = { type: "no-indent" };
      continue;
    }

    if (!indentMatch) {
      lowestIndentation = { count: 0, type: lowestIndentation!.type };
      continue;
    }

    const currentIndent = singleIndentDescriptor(indentMatch);

    if (!lowestIndentation) {
      lowestIndentation = currentIndent;
      continue;
    }

    if (lowestIndentation.type === "no-indent") {
      lowestIndentation = { count: 0, type: currentIndent.type };
      continue;
    }

    invariant(
      currentIndent.type === lowestIndentation.type,
      "mixed indentations in stdin",
    );

    lowestIndentation = {
      type: lowestIndentation.type,
      count: Math.min(lowestIndentation.count, currentIndent.count),
    };
  }

  invariant(lowestIndentation, "lowest indentation can't be null");

  return lowestIndentation;
};

const splitNewline = (s: string) => s.split(/\r?\n/);

const isLineEmpty = (line: string) => /^( |\t)*$/.test(line);

export const getCommentedLines = (lines: string[], filename: string) =>
  Effect.gen(function* () {
    const lowestIndentation = getLowestIndentation(
      lines.filter((line) => !isLineEmpty(line)),
    );

    const fs = yield* FileSystem.FileSystem;

    const indChar = lowestIndentation.type === "space" ? " " : "\t";

    const indCount =
      lowestIndentation.type === "no-indent" ? 0 : lowestIndentation.count;

    const prependCommentPrefix =
      (cmt: string, omitEmpty = false) =>
      (line: string) => {
        if (omitEmpty && isLineEmpty(line)) {
          return line;
        }

        const result =
          indChar.repeat(indCount) + cmt + " " + line.slice(indCount);
        return result;
      };

    const wrappingComment =
      (start: string, end: string, omitEmpty = false) =>
      (line: string) => {
        if (omitEmpty && isLineEmpty(line)) {
          return line;
        }
        const result =
          indChar.repeat(indCount) +
          start +
          " " +
          line.slice(indCount) +
          " " +
          end;
        return result;
      };

    if (
      [
        ".js",
        ".cjs",
        ".mjs",
        ".ts",
        ".mts",
        ".cts",

        ".json",
        ".c",
        ".cpp",
        ".json5",
        ".go",
        ".rs",
      ].some((ext) => filename.endsWith(ext))
    ) {
      return lines.map(prependCommentPrefix("/" + "/"));
    }

    if ([".css", ".scss", ".sass"].some((ext) => filename.endsWith(ext))) {
      return lines.map(wrappingComment("/" + "*", "*/", true));
    }

    if (
      [".html", ".md", ".svelte", ".vue"].some((ext) => filename.endsWith(ext))
    ) {
      return lines.map(wrappingComment("<!--", "-->", true));
    }

    if ([".hs", ".sql"].some((ext) => filename.endsWith(ext))) {
      return lines.map(prependCommentPrefix("--"));
    }

    if ([".lua"].some((ext) => filename.endsWith(ext))) {
      return lines.map(prependCommentPrefix('"'));
    }

    if (
      [".sh", ".bash", ".yml", ".yaml", ".toml"].some((ext) =>
        filename.endsWith(ext),
      )
    ) {
      return lines.map(prependCommentPrefix("#"));
    }

    if (
      [/\b(bashrc|zshrc|vimrc|gitignore|Dockerfile|Makefile)\b/].some((re) =>
        re.test(filename),
      )
    ) {
      return lines.map(prependCommentPrefix("#"));
    }

    const fileContents = yield* fs.readFileString(filename);

    if ([".jsx", ".tsx"].some((ext) => filename.endsWith(ext))) {
      return commentJsxLines(fileContents, lines, indChar, indCount);
    }

    const firstLine = splitNewline(fileContents)[0];

    if (/\b(bun|node|deno)\b/.test(firstLine)) {
      return lines.map(prependCommentPrefix("/" + "/"));
    }

    if (firstLine.startsWith("#!/")) {
      return lines.map(prependCommentPrefix("#"));
    }

    if (/\b(bash|zsh|sh)\b/.test(firstLine)) {
      return lines.map(prependCommentPrefix("#"));
    }

    return lines.map(prependCommentPrefix("/" + "/"));
  });
