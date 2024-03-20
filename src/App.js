import { useState, useEffect } from "react";

function Square({ value, onSquareClick, isWinningSquare, animate }) {
  return (
    <button
      className={`square ${isWinningSquare ? "winning-square" : ""} ${
        animate ? "fade-in" : ""
      }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({
  xIsNext,
  squares,
  onSquareClick,
  currentMove,
  lastClickedSquare,
  winner,
}) {
  function handleClick(i) {
    if (winner || squares[i]) {
      // console.log("Try again");
      // console.log(winner);
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    const row = Math.ceil(i / 3);
    const col = i % 3;
    const location = `(${row}, ${col})`;

    onSquareClick(nextSquares, location, i);
  }

  const renderSquare = (i) => {
    return (
      <Square
        value={squares[i]}
        key={i}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={winner && winner.line && winner.line.includes(i)}
        animate={lastClickedSquare === i}
      />
    );
  };

  const renderRow = (startId) => {
    return (
      <div className='board-row'>
        {[0, 1, 2].map((j) => renderSquare(j + startId))}
      </div>
    );
  };

  return (
    <>
      {renderRow(0)}
      {renderRow(3)}
      {renderRow(6)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [moveOrderAsc, setMoveOrderAsc] = useState(true);
  const [winner, setWinner] = useState(null);
  const [lastClickedSquare, setLastClickedSquare] = useState(null);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  const status = winner
    ? "Winner: " + winner.winner + "!!!"
    : "Next player: " + (xIsNext ? "X" : "O");

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8],
    ];

    console.log("squares" + squares);

    // iterate through each line and check if each square has the same value
    for (let line of lines) {
      const [a, b, c] = line;

      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        return { winner: squares[a], line };
      }
    }
    if (!squares.includes(null)) {
      return { winner: "Tied", line: null };
    }
    return null;
  }

  useEffect(() => {
    setWinner(calculateWinner(currentSquares));
  }, [currentSquares]);

  function handlePlay(nextSquares, location, lastClickedSquare) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location },
    ];

    setHistory(nextHistory);
    setLastClickedSquare(lastClickedSquare);
    setCurrentMove(currentMove + 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSortToggle() {
    setMoveOrderAsc(!moveOrderAsc); // Toggle sort order
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = "You are at move #" + move;
    } else if (move > 0) {
      description = "Go to move #" + move + ` ${history[move].location}`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className='game'>
      <h1 className='title'>Tic-Tac-Toe</h1>
      <div className='status'>{status}</div>
      <div className='status'>Current move: {currentMove}</div>
      <div className='game-board'>
        <div>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onSquareClick={handlePlay}
            currentMove={currentMove}
            lastClickedSquare={lastClickedSquare}
            winner={winner}
          />
        </div>
        <div className='game-info'>
          <ol>
            <button onClick={handleSortToggle}>
              Change sort order
              <span style={{ marginLeft: "0.5rem" }}>
                {moveOrderAsc ? "\u2193" : "\u2191"}
              </span>
            </button>
            {moveOrderAsc ? moves : moves.reverse()}
          </ol>
        </div>
      </div>
    </div>
  );
}
