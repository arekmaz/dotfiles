import ts from "typescript";
import { invariant } from "../invariant.js";

const splitNewline = (s: string) => s.split(/\r?\n/);

const isLineEmpty = (line: string) => /^( |\t)*$/.test(line);

export function commentJsxLines(
  fileContent: string,
  lines: string[],
  indChar: string,
  indCount: number,
) {
  const jsxLineTypes = getJsxLineTypes(fileContent);
  const fileLines = splitNewline(fileContent);

  invariant(
    jsxLineTypes.length === fileLines.length,
    "could not find a type for every line",
  );

  const selectedLinesStartFromIndex = findRangeStartingIndex(lines, fileLines);

  invariant(
    selectedLinesStartFromIndex !== null,
    "could not place selected lines in the file",
  );

  const selectedLineTypes = jsxLineTypes.slice(
    selectedLinesStartFromIndex,
    selectedLinesStartFromIndex + lines.length,
  );

  invariant(
    selectedLineTypes.length === lines.length,
    "could not match type info for every passed line",
  );

  // TODO: technically only the type of the first line is needed,
  // maybe optimize the algorighm:

  // comment all as jsx if the first line is jsx
  if (selectedLineTypes[0] === "jsx") {
    return lines.map((line) => {
      if (isLineEmpty(line)) {
        return line;
      }

      const result =
        indChar.repeat(indCount) + "{/* " + line.slice(indCount) + " */}";
      return result;
    });
  }

  // treat the rest as ts
  return lines.map((line) => {
    if (isLineEmpty(line)) {
      return line;
    }

    const result = indChar.repeat(indCount) + "// " + line.slice(indCount);

    return result;
  });
}

function getJsxLineTypes(fileContent: string) {
  // from chatgpt - tsx, jsx parsing
  interface LineTypeInfo {
    line: number;
    column: number;
    lineEnd: number;
    columnEnd: number;
    text: string;
    parentText: string;
    type: "jsx" | "typescript";
    parent: "jsx" | "typescript" | null;
    position: "start" | "end";
  }

  const sourceFile = ts.createSourceFile(
    "temp.tsx",
    fileContent,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const lineTypes: LineTypeInfo[] = [];

  function analyzeNode(node: ts.Node) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(),
    );

    const endPosition = node.getEnd();
    const { line: lineEnd, character: columnEnd } =
      sourceFile.getLineAndCharacterOfPosition(endPosition);

    const parentNode = node.parent;

    const isJsx = (n: ts.Node) =>
      ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxChild(n);

    const lineType: LineTypeInfo = {
      position: "start", // default
      line,
      column: character,
      text: node.getText(),
      lineEnd,
      columnEnd,
      parentText: node.getText(),
      type: isJsx(node) ? "jsx" : "typescript",
      parent: parentNode ? (isJsx(parentNode) ? "jsx" : "typescript") : null,
    };

    if (!parentNode) {
      ts.forEachChild(node, analyzeNode);
      return;
    }

    const currentOnIndex = lineTypes[line];

    const endLineNode = lineTypes[lineEnd];

    if (
      !endLineNode ||
      (endLineNode.position === "end" &&
        lineType.columnEnd > endLineNode.columnEnd)
    ) {
      lineTypes[lineEnd] = { ...lineType, position: "end" };
    }

    if (!currentOnIndex) {
      lineTypes[line] = lineType;
      ts.forEachChild(node, analyzeNode);
      return;
    }

    // choose the node that starts earlier, (towards the row start)
    if (currentOnIndex.column > lineType.column) {
      lineTypes[line] = lineType;
      ts.forEachChild(node, analyzeNode);
      return;
    }

    // choose bigger node if they start at the same position
    if (
      currentOnIndex.column === lineType.column &&
      currentOnIndex.text.length < lineType.text.length
    ) {
      lineTypes[line] = lineType;
      ts.forEachChild(node, analyzeNode);
      return;
    }

    ts.forEachChild(node, analyzeNode);
  }

  analyzeNode(sourceFile);

  return splitNewline(fileContent).map((_, i) => {
    const t = lineTypes[i];

    if (!t) {
      return "jsx";
    }

    return t.parent === "jsx" ? "jsx" : "typescript";
  });
}

function findRangeStartingIndex<T>(needle: T[], haystack: T[]) {
  let result = null;

  for (let i = 0; i < haystack.length; ++i) {
    if (result !== null && i - result >= needle.length) {
      return result;
    }

    if (needle[0] === haystack[i] && result === null) {
      result = i;
      continue;
    }

    if (result !== null && haystack[i] !== needle[i - result]) {
      result = null;
      continue;
    }
  }

  return result;
}
