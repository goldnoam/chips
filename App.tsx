
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Board, CellType, Piece, Theme } from './types';
import { BOARD_WIDTH, BOARD_HEIGHT, LEVEL_DURATION, DIFFICULTY_SETTINGS, FRY_PIECES_SHAPES, SINGLE_CELL_PIECES } from './constants';

type Difficulty = keyof typeof DIFFICULTY_SETTINGS;

const createEmptyBoard = (): Board => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(CellType.EMPTY));

// Helper Components
const Cell: React.FC<{ type: CellType }> = React.memo(({ type }) => {
  const baseClasses = 'w-full h-full border-[1px]';
  const itemClasses = 'flex items-center justify-center text-xl sm:text-2xl';
  let colorClasses = '';
  let content = null;

  switch (type) {
    case CellType.FRY:
      colorClasses = 'bg-fries border-yellow-600 dark:border-yellow-400';
      break;
    case CellType.BURGER:
      content = '🍔';
      colorClasses = `${itemClasses} bg-burger/50 border-orange-700/50 dark:border-orange-500/50`;
      break;
    case CellType.POTATO:
      content = '🥔';
      colorClasses = `${itemClasses} bg-yellow-800/40 border-yellow-900/50 dark:border-yellow-700/50`;
      break;
    case CellType.KETCHUP:
      content = '🍅';
      colorClasses = `${itemClasses} bg-red-500/50 border-red-700/50 dark:border-red-500/50`;
      break;
    case CellType.MUSTARD:
      content = 'M';
      colorClasses = `${itemClasses} bg-yellow-400/60 border-yellow-600/50 text-yellow-800 dark:text-yellow-200 font-bold`;
      break;
    case CellType.DONUT:
      content = '🍩';
      colorClasses = `${itemClasses} bg-pink-400/50 border-pink-600/50 dark:border-pink-400/50`;
      break;
    case CellType.ONION:
      content = '🧅';
      colorClasses = `${itemClasses} bg-purple-400/50 border-purple-600/50 dark:border-purple-400/50`;
      break;
    default:
      colorClasses = 'bg-light-board/50 dark:bg-dark-board/50 border-slate-300/20 dark:border-slate-600/20';
      break;
  }

  return <div className={`${baseClasses} ${colorClasses}`}>{content}</div>;
});

const GameBoard: React.FC<{ board: Board; currentPiece: Piece | null }> = ({ board, currentPiece }) => {
  const displayBoard = useMemo(() => {
    const newBoard = board.map(row => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== CellType.EMPTY) {
            const boardY = currentPiece.position.row + y;
            const boardX = currentPiece.position.col + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = cell;
            }
          }
        });
      });
    }
    return newBoard;
  }, [board, currentPiece]);

  return (
    <div className="grid grid-cols-10 grid-rows-20 gap-px p-1 bg-slate-300 dark:bg-slate-700 shadow-lg border-4 border-slate-400 dark:border-slate-800 rounded-lg aspect-[1/2]">
      {displayBoard.map((row, y) => row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell} />))}
    </div>
  );
};

const NextPiece: React.FC<{ piece: Piece | null }> = React.memo(({ piece }) => {
  const board = Array.from({ length: 4 }, () => Array(4).fill(CellType.EMPTY));
  if (piece) {
    const shape = piece.shape;
    const yOffset = Math.floor((4 - shape.length) / 2);
    const xOffset = Math.floor((4 - (shape[0]?.length || 0)) / 2);
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== CellType.EMPTY) {
          board[y + yOffset][x + xOffset] = cell;
        }
      });
    });
  }
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-px p-1 bg-slate-300 dark:bg-slate-700 rounded-md aspect-square">
      {board.map((row, y) => row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell} />))}
    </div>
  );
});

const InstructionsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 p-4" role="dialog" aria-modal="true" aria-labelledby="instructions-title">
    <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full text-left relative transform transition-all">
      <h2 id="instructions-title" className="text-3xl font-bold text-center mb-4 text-fries">How to Play</h2>
      <h3 className="font-bold text-lg mt-4 mb-2">Objective</h3>
      <p>Stack the falling pieces to clear lines and score points. The game gets faster as you level up!</p>
      <h3 className="font-bold text-lg mt-4 mb-2">Clearing Lines</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Fry Lines:</strong> Complete a horizontal line entirely with yellow fry blocks.</li>
        <li><strong>Item Combos:</strong> Line up 3 of the same food items (like 🍔🍔🍔) horizontally in a row to clear that line.</li>
      </ul>
       <h3 className="font-bold text-lg mt-4 mb-2">Instruction</h3>
       <p>Use up arrow to rotate chip item</p>
      <h3 className="font-bold text-lg mt-4 mb-2">Scoring</h3>
      <p>You get more points for clearing multiple lines at once. Keep playing to beat your high score!</p>
      <button onClick={onClose} className="absolute top-2 right-2 text-2xl font-bold hover:text-fries transition-colors" aria-label="Close instructions">&times;</button>
      <button onClick={onClose} className="mt-6 w-full px-4 py-3 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105">Got it!</button>
    </div>
  </div>
);

const ControlsDisplay = () => (
  <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg shadow-md">
    <h2 className="font-bold text-lg mb-3 text-center">CONTROLS</h2>
    <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
        <div className="col-start-2 bg-slate-300 dark:bg-slate-700 rounded p-1 flex flex-col justify-center items-center"><span>↑</span><span>Rotate</span></div>
        <div className="bg-slate-300 dark:bg-slate-700 rounded p-1 flex flex-col justify-center items-center"><span>←</span><span>Left</span></div>
        <div className="bg-slate-300 dark:bg-slate-700 rounded p-1 flex flex-col justify-center items-center"><span>↓</span><span>Soft Drop</span></div>
        <div className="bg-slate-300 dark:bg-slate-700 rounded p-1 flex flex-col justify-center items-center"><span>→</span><span>Right</span></div>
        <div className="col-span-3 bg-slate-300 dark:bg-slate-700 rounded p-1 flex flex-col justify-center items-center"><span>Spacebar</span><span>Hard Drop</span></div>
        <div className="col-span-3 bg-slate-300 dark:bg-slate-700 rounded p-1 flex flex-col justify-center items-center"><span>P</span><span>Pause</span></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [time, setTime] = useState(LEVEL_DURATION / 1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [isMuted, setIsMuted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const dropInterval = useMemo(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    return Math.max(settings.initialInterval - (level - 1) * settings.speedup, 100);
  }, [level, difficulty]);

  const playSound = useCallback((type: 'rotate' | 'drop' | 'clear' | 'gameOver') => {
    if (!audioContextRef.current || isMuted) return;
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0.1, now);

    const oscillator = ctx.createOscillator();
    oscillator.connect(gainNode);

    switch (type) {
        case 'rotate': oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(600, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); oscillator.start(now); oscillator.stop(now + 0.1); break;
        case 'drop': oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(200, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15); oscillator.start(now); oscillator.stop(now + 0.15); break;
        case 'clear': oscillator.type = 'square'; oscillator.frequency.setValueAtTime(800, now); oscillator.frequency.linearRampToValueAtTime(1200, now + 0.15); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15); oscillator.start(now); oscillator.stop(now + 0.15); break;
        case 'gameOver': oscillator.type = 'sawtooth'; oscillator.frequency.setValueAtTime(400, now); oscillator.frequency.linearRampToValueAtTime(100, now + 0.5); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5); oscillator.start(now); oscillator.stop(now + 0.5); break;
    }
  }, [isMuted]);

  const createRandomPiece = useCallback((): Piece => {
    const isFryPiece = Math.random() < 0.6; // 60% chance for fry piece
    if (isFryPiece) {
      const shape = FRY_PIECES_SHAPES[Math.floor(Math.random() * FRY_PIECES_SHAPES.length)];
      return {
        shape, type: CellType.FRY, position: { row: 0, col: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2) },
      };
    } else {
      const pieceData = SINGLE_CELL_PIECES[Math.floor(Math.random() * SINGLE_CELL_PIECES.length)];
      return {
        ...pieceData, position: { row: 0, col: Math.floor(BOARD_WIDTH / 2) },
      };
    }
  }, []);
  
  const checkCollision = useCallback((piece: Piece, board: Board): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== CellType.EMPTY) {
          const newRow = piece.position.row + y;
          const newCol = piece.position.col + x;
          if (newRow >= BOARD_HEIGHT || newCol < 0 || newCol >= BOARD_WIDTH || (board[newRow] && board[newRow][newCol] !== CellType.EMPTY)) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const startGame = useCallback(() => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext)();
    }
    const firstPiece = createRandomPiece();
    const secondPiece = createRandomPiece();

    setBoard(createEmptyBoard());
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setScore(0);
    setLevel(1);
    setTime(LEVEL_DURATION / 1000);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setShowInstructions(false);
  }, [createRandomPiece]);

  const clearLines = useCallback(() => {
    let newBoard = board.map(row => [...row]);
    const rowsToClear = new Set<number>();

    // Check for full fry rows & 3-in-a-row of same item
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every(cell => cell === CellType.FRY)) {
        rowsToClear.add(y);
        continue; // Move to next row
      }
      for (let x = 0; x <= BOARD_WIDTH - 3; x++) {
        const cell1 = newBoard[y][x];
        if (cell1 > CellType.FRY) { // Check if it's a special item
          const cell2 = newBoard[y][x + 1];
          const cell3 = newBoard[y][x + 2];
          if (cell1 === cell2 && cell1 === cell3) {
            rowsToClear.add(y);
            break; // Found a match, move to next row
          }
        }
      }
    }

    if (rowsToClear.size > 0) {
      const linesClearedCount = rowsToClear.size;
      newBoard = newBoard.filter((_, y) => !rowsToClear.has(y));
      const emptyRows = Array.from({ length: linesClearedCount }, () => Array(BOARD_WIDTH).fill(CellType.EMPTY));
      newBoard.unshift(...emptyRows);
      
      setBoard(newBoard);
      setScore(prev => prev + 100 * linesClearedCount * linesClearedCount);
      playSound('clear');
    }
  }, [board, playSound]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    const newBoard = board.map(r => [...r]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== CellType.EMPTY) {
          newBoard[currentPiece.position.row + y][currentPiece.position.col + x] = cell;
        }
      });
    });
    setBoard(newBoard);
    playSound('drop');
    
    setCurrentPiece(nextPiece);
    setNextPiece(createRandomPiece());

  }, [board, currentPiece, nextPiece, createRandomPiece, playSound]);
  
  const drop = useCallback(() => {
    if (!isPlaying || isGameOver || !currentPiece || isPaused) return;
    const newPiece = { ...currentPiece, position: { ...currentPiece.position, row: currentPiece.position.row + 1 } };
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else {
      lockPiece();
    }
  }, [isPlaying, isGameOver, currentPiece, board, checkCollision, lockPiece, isPaused]);

  const playerMove = useCallback((dir: number) => {
    if (!currentPiece) return;
    const newPiece = { ...currentPiece, position: { ...currentPiece.position, col: currentPiece.position.col + dir } };
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, board, checkCollision]);

  const playerRotate = useCallback(() => {
    if (!currentPiece || currentPiece.type !== CellType.FRY) return;
    const shape = currentPiece.shape;
    if (shape.every(row => row.every(cell => cell === CellType.FRY)) && shape.length === shape[0].length) return; // Don't rotate O-shape

    const rotatedShape = shape[0].map((_, colIndex) => shape.map(row => row[colIndex]).reverse());
    const newPiece = { ...currentPiece, shape: rotatedShape };

    let offset = 1;
    while(checkCollision(newPiece, board)) {
        newPiece.position.col += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (Math.abs(offset) > newPiece.shape[0].length + 1) {
            return; // Cannot rotate
        }
    }
    setCurrentPiece(newPiece);
    playSound('rotate');
  }, [currentPiece, board, checkCollision, playSound]);

  const hardDrop = useCallback(() => {
    if (!currentPiece) return;
    let newPiece = { ...currentPiece };
    while (!checkCollision({ ...newPiece, position: { ...newPiece.position, row: newPiece.position.row + 1 } }, board)) {
        newPiece.position.row++;
    }
    setCurrentPiece(newPiece);
  }, [currentPiece, board, checkCollision]);

  const gameLogicRef = useRef({ isPlaying, isGameOver, isPaused, playerMove, drop, playerRotate, hardDrop, setIsPaused });
  const moveIntervalRef = useRef<number | null>(null);
  const downIntervalRef = useRef<number | null>(null);
  const moveDirectionRef = useRef<number>(0);

  useEffect(() => {
    gameLogicRef.current = { isPlaying, isGameOver, isPaused, playerMove, drop, playerRotate, hardDrop, setIsPaused };
  }, [isPlaying, isGameOver, isPaused, playerMove, drop, playerRotate, hardDrop, setIsPaused]);
  
  useEffect(() => { if (currentPiece && checkCollision(currentPiece, board)) { setIsGameOver(true); setIsPlaying(false); playSound('gameOver'); } }, [currentPiece, board, checkCollision, playSound]);
  useEffect(() => { const storedHighScore = localStorage.getItem('friesTetrisHighScore'); if (storedHighScore) { setHighScore(parseInt(storedHighScore, 10)); } }, []);
  useEffect(() => { if (score > highScore) { setHighScore(score); localStorage.setItem('friesTetrisHighScore', score.toString()); } }, [score, highScore]);
  useEffect(() => { clearLines(); }, [board, clearLines]);

  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) return;
    const interval = setInterval(drop, dropInterval);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, isPaused, drop, dropInterval]);

  useEffect(() => {
    if (!isPlaying || isGameOver || isPaused) return;
    const timer = setInterval(() => {
      setTime(prev => { if (prev <= 1) { setLevel(l => l + 1); return LEVEL_DURATION / 1000; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { isPlaying, isGameOver, isPaused, playerMove, drop, playerRotate, hardDrop, setIsPaused } = gameLogicRef.current;
      if (!isPlaying || isGameOver || e.repeat) return;
      if (e.key === 'p' || e.key === 'P') { setIsPaused(p => !p); return; }
      if (isPaused) return;

      switch (e.key) {
        case 'ArrowLeft': moveDirectionRef.current = -1; playerMove(-1); if (moveIntervalRef.current) clearInterval(moveIntervalRef.current); moveIntervalRef.current = window.setInterval(() => gameLogicRef.current.playerMove(-1), 75); break;
        case 'ArrowRight': moveDirectionRef.current = 1; playerMove(1); if (moveIntervalRef.current) clearInterval(moveIntervalRef.current); moveIntervalRef.current = window.setInterval(() => gameLogicRef.current.playerMove(1), 75); break;
        case 'ArrowDown': drop(); if (downIntervalRef.current) clearInterval(downIntervalRef.current); downIntervalRef.current = window.setInterval(() => gameLogicRef.current.drop(), 50); break;
        case 'ArrowUp': playerRotate(); break;
        case ' ': hardDrop(); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft': if (moveDirectionRef.current === -1) { if (moveIntervalRef.current) clearInterval(moveIntervalRef.current); moveIntervalRef.current = null; moveDirectionRef.current = 0; } break;
        case 'ArrowRight': if (moveDirectionRef.current === 1) { if (moveIntervalRef.current) clearInterval(moveIntervalRef.current); moveIntervalRef.current = null; moveDirectionRef.current = 0; } break;
        case 'ArrowDown': if (downIntervalRef.current) { clearInterval(downIntervalRef.current); downIntervalRef.current = null; } break;
      }
    };

    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp);
      if (moveIntervalRef.current) clearInterval(moveIntervalRef.current); if (downIntervalRef.current) clearInterval(downIntervalRef.current);
    };
  }, []);

  useEffect(() => { const root = window.document.documentElement; root.classList.remove(theme === 'dark' ? 'light' : 'dark'); root.classList.add(theme); }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleMute = () => setIsMuted(prev => !prev);

  const renderStartScreen = () => (
    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 text-white p-4 text-center">
        <h1 className="text-5xl font-bold text-fries mb-2 drop-shadow-lg">{isGameOver ? "Game Over" : "Fries Tetris"}</h1>
        {isGameOver && <p className="text-2xl mb-4">Your Score: {score}</p>}
        <div className="my-6">
            <h2 className="text-xl font-bold mb-3">SELECT DIFFICULTY</h2>
            <div className="flex gap-2 sm:gap-4">
                {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(d => (
                    <button key={d} onClick={() => setDifficulty(d)} className={`px-4 py-2 font-bold rounded-md transition-all ${difficulty === d ? 'bg-fries text-slate-900 scale-110' : 'bg-slate-600 hover:bg-slate-500'}`}>
                        {DIFFICULTY_SETTINGS[d].name}
                    </button>
                ))}
            </div>
        </div>
        <button onClick={startGame} className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg text-2xl shadow-lg transform hover:scale-105 transition-transform">
            {isGameOver ? "Play Again" : "Start Game"}
        </button>
        <button onClick={() => setShowInstructions(true)} className="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md transform hover:scale-105 transition-transform">
            Instructions
        </button>
    </div>
  );

  return (
    <div className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen font-sans flex flex-col transition-colors duration-300">
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-4 gap-4 md:gap-8 relative">
        {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
        {(!isPlaying || isGameOver) && renderStartScreen()}
        {isPaused && (
             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 text-white p-4">
                <h2 className="text-4xl font-bold text-fries mb-6">Paused</h2>
                <button onClick={() => setIsPaused(false)} className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg text-2xl shadow-lg transform hover:scale-105 transition-transform">Resume</button>
            </div>
        )}
        <div className="w-full max-w-sm md:w-96"><GameBoard board={board} currentPiece={currentPiece} /></div>
        <div className="flex flex-col gap-4 text-center w-full max-w-sm md:w-80">
          <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg mb-1">SCORE</h2><p className="text-2xl text-fries">{score}</p>
          </div>
          <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg mb-1">HIGH SCORE</h2><p className="text-xl text-fries/80">{highScore}</p>
          </div>
          <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg mb-1">NEXT</h2>
            <div className="w-24 h-24 mx-auto mt-2"><NextPiece piece={nextPiece} /></div>
          </div>
          <div className="flex justify-between bg-slate-200 dark:bg-slate-800 p-4 rounded-lg shadow-md">
            <div><h2 className="font-bold text-lg">LEVEL</h2><p className="text-xl">{level}</p></div>
            <div><h2 className="font-bold text-lg">TIMER</h2><p className="text-xl">{time}</p></div>
          </div>
          <ControlsDisplay />
           <div className="flex gap-2">
                <button onClick={toggleTheme} className="w-full p-2 bg-slate-300 dark:bg-slate-700 rounded-lg shadow-md hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors"> {theme === 'dark' ? 'Light' : 'Dark'} </button>
                <button onClick={toggleMute} className="w-full p-2 bg-slate-300 dark:bg-slate-700 rounded-lg shadow-md hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors"> {isMuted ? 'Unmute' : 'Mute'} </button>
                <button onClick={() => setShowInstructions(true)} className="w-full p-2 bg-slate-300 dark:bg-slate-700 rounded-lg shadow-md hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors"> Info </button>
           </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
        <p>(C) Noam Gold AI 2025</p>
        <a href="mailto:gold.noam@gmail.com" className="hover:text-fries transition-colors">Send Feedback</a>
      </footer>
    </div>
  );
};

export default App;
