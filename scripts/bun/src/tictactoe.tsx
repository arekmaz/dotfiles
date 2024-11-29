import { Command } from "@effect/cli";
import { Effect } from "effect";
import { Box, render, Text, useInput, useStdout } from "ink";
import React, { useState } from "react";

const boardSize = 3;

const winningIndexCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const makeEmptyBoard = (): number[][] =>
  Array(boardSize).fill(Array(boardSize).fill(0));

const Counter = () => {
  const { stdout } = useStdout();

  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  const boxSize = Math.floor(Math.min(stdout.columns, stdout.rows) / 3);

  const [board, setBoard] = useState(makeEmptyBoard);

  const [focus, setFocus] = useState(() => [0, 0]);

  const gameResult = winningIndexCombinations
    .map((comb) => {
      let result = 0;

      for (const n of comb) {
        const field = board[Math.floor(n / boardSize)][n % boardSize];

        if (field === 0) {
          return null;
        }

        if (result !== 0 && field !== result) {
          return null;
        }

        result = field;
      }

      return result === 1 ? "x" : "o";
    })
    .find(Boolean);

  useInput((input, key) => {
    if (input === "q") {
      process.stdin.pause();
      process.exit(0);
    }

    if (input === "r") {
      setBoard(makeEmptyBoard());
      setFocus([0, 0]);
      return;
    }

    if (gameResult) {
      return;
    }

    if (key.leftArrow || input === "h") {
      setFocus(([x, y]) => [Math.max(0, x - 1), y]);
      return;
    }

    if (key.rightArrow || input === "l") {
      setFocus(([x, y]) => [Math.min(boardSize - 1, x + 1), y]);
      return;
    }

    if (key.downArrow || input === "j") {
      setFocus(([x, y]) => [x, Math.min(boardSize - 1, y + 1)]);
      return;
    }

    if (key.upArrow || input === "k") {
      setFocus(([x, y]) => [x, Math.max(0, y - 1)]);
      return;
    }

    if (input === " " && board[focus[1]][focus[0]] === 0) {
      setBoard((b) =>
        b.map((column, columnIndex) =>
          column.map((value, rowIndex) =>
            columnIndex === focus[1] && rowIndex === focus[0]
              ? currentPlayer
              : value,
          ),
        ),
      );
      setCurrentPlayer((p) => (p === 1 ? 2 : 1));
      return;
    }
  });

  return (
    <>
      {gameResult ? (
        <Text>winner: {gameResult}, r - reset, q - quit</Text>
      ) : (
        <Text>current player: {currentPlayer === 1 ? "x" : "o"}, q -quit</Text>
      )}
      {board.map((column, rowIndex) => (
        <Box key={rowIndex}>
          {column.map((value, columnIndex) => (
            <Box
              key={columnIndex}
              width={boxSize}
              height={boxSize / 2}
              alignItems="center"
              justifyContent="center"
              borderStyle={
                focus[0] === columnIndex && focus[1] === rowIndex
                  ? "double"
                  : "single"
              }
            >
              {value === 1 && <Text>{`x`}</Text>}
              {value === 2 && <Text>{`o`}</Text>}
            </Box>
          ))}
        </Box>
      ))}
    </>
  );
};

export const tictactoe = Command.make("tictactoe", {}, ({}) => {
  const e = Effect.gen(function* () {
    process.stdin.resume();
    render(<Counter />);
  });

  return e;
});
