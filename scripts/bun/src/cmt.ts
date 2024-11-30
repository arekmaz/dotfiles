import { Args, Command } from "@effect/cli";
import { FileSystem } from "@effect/platform";
import { Console, Effect } from "effect";
import { invariant } from "./invariant.js";

const file = Args.file({ name: "file" });

const readStdin = Effect.promise(async () => {
  if (process.stdin.isTTY) {
    return [];
  }

  let stdin = [];

  for await (const line of console) {
    stdin.push(line);
  }
  // if the last line is "", that means a newline was the last char,
  // in that case remove it
  if (stdin.at(-1) === "") {
    stdin.pop();
  }

  return stdin;
});

export const cmt = Command.make("cmt", { file }, ({ file }) => {
  const e = Effect.gen(function* () {
    const stdin = yield* readStdin;

    invariant(stdin.length > 0, "no stdin, cannot comment anything");

    const fs = yield* FileSystem.FileSystem;

    invariant(yield* fs.exists(file), `file ${file} does not exist`);

    const commentedLines = yield* getCommentedLines(stdin, file);

    for (const line of commentedLines) {
      yield* Console.log(line);
    }
  });

  return e;
});

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

type LowestIndentation = ReturnType<typeof getLowestIndentation>;

const splitNewline = (s: string) => s.split(/\r?\n/);

const isLineEmpty = (line: string) => /^( |\t)*$/.test(line);

const getCommentedLines = (lines: string[], filename: string) =>
  Effect.gen(function* () {
    const lowestIndentation = getLowestIndentation(
      lines.filter((line) => !isLineEmpty(line)),
    );
    const fs = yield* FileSystem.FileSystem;

    const fileContents = yield* fs.readFileString(filename);

    return lines.map((line) =>
      commentLine(line, filename, lines, lowestIndentation, fileContents),
    );
  });

const commentLine = (
  line: string,
  filename: string,
  lines: string[],
  lowestIndentation: LowestIndentation,
  fileContents: string,
) => {
  const indChar = lowestIndentation.type === "space" ? " " : "\t";

  const prependCommentPrefix = (line: string, cmt: string) => {
    const indCount =
      lowestIndentation.type === "no-indent" ? 0 : lowestIndentation.count;

    const result = indChar.repeat(indCount) + cmt + " " + line.slice(indCount);
    return result;
  };

  // TODO: jsx block aware comments
  // TODO: ignore if line already commented?
  // TODO: uncomment
  if (
    [".js", ".jsx", ".json", ".ts", ".tsx", ".go", ".rs"].some((ext) =>
      filename.endsWith(ext),
    )
  ) {
    return prependCommentPrefix(line, "//");
  }

  if ([".css"].some((ext) => filename.endsWith(ext))) {
    return isLineEmpty(line) ? line : prependCommentPrefix(line, "/*") + " */";
  }

  if ([".html"].some((ext) => filename.endsWith(ext))) {
    return isLineEmpty(line) ? line : prependCommentPrefix(line, "<!--") + " -->";
  }

  if ([".hs"].some((ext) => filename.endsWith(ext))) {
    return prependCommentPrefix(line, "--");
  }

  if ([/\b(bashrc|zshrc)\b/].some((re) => re.test(filename))) {
    return prependCommentPrefix(line, "#");
  }

  const firstLine = splitNewline(fileContents)[0];

  if (!firstLine.startsWith("#!/")) {
    return prependCommentPrefix(line, "//");
  }

  if (/\b(bash|zsh|sh)\b/.test(firstLine)) {
    return prependCommentPrefix(line, "#");
  }

  if (/\b(bun|node|deno)\b/.test(firstLine)) {
    return prependCommentPrefix(line, "//");
  }

  return prependCommentPrefix(line, "//");
};
