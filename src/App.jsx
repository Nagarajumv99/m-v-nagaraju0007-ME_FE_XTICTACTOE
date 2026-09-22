import { useState } from 'react'
import './App.css'

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const emptyBoard = Array(9).fill('')

function App() {
  const [board, setBoard] = useState(emptyBoard)
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [winner, setWinner] = useState(null)
  const [winningCells, setWinningCells] = useState([])
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const isDraw = !winner && board.every(Boolean)

  function handleCellClick(index) {
    if (board[index] || winner || isDraw) return

    const nextBoard = [...board]
    nextBoard[index] = currentPlayer
    setBoard(nextBoard)

    const line = winningLines.find(([a, b, c]) =>
      nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[a] === nextBoard[c],
    )

    if (line) {
      setWinner(currentPlayer)
      setWinningCells(line)
      setScores((currentScores) => ({
        ...currentScores,
        [currentPlayer]: currentScores[currentPlayer] + 1,
      }))
      return
    }

    if (nextBoard.every(Boolean)) {
      setScores((currentScores) => ({ ...currentScores, draws: currentScores.draws + 1 }))
      return
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
  }

  function restartRound() {
    setBoard(emptyBoard)
    setCurrentPlayer('X')
    setWinner(null)
    setWinningCells([])
  }

  function resetAll() {
    restartRound()
    setScores({ X: 0, O: 0, draws: 0 })
  }

  return (
    <main className="game-shell">
      <section className="game-card" aria-label="Tic-Tac-Toe game">
        <h1>Tic-Tac-Toe</h1>

        <div className="scoreboard" aria-label="Scoreboard">
          <span className="score score-x">X: {scores.X}</span>
          <span className="score score-draws">Draws: {scores.draws}</span>
          <span className="score score-o">O: {scores.O}</span>
        </div>

        <p className="game-status">{winner ? `Winner: ${winner}` : 'Turn: ' + currentPlayer}</p>

        <div className="board" role="grid" aria-label="Tic-Tac-Toe board">
          {board.map((cell, index) => (
            <button
              className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${winningCells.includes(index) ? 'winning-cell' : ''}`}
              key={index}
              type="button"
              role="gridcell"
              aria-label={cell ? `${cell} at position ${index + 1}` : `Empty position ${index + 1}`}
              onClick={() => handleCellClick(index)}
            >
              {cell.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="actions">
          <button className="primary-button" type="button" onClick={restartRound}>
            {winner ? 'Play Again' : 'Restart Round'}
          </button>
          <button className="secondary-button" type="button" onClick={resetAll}>
            Reset All
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
