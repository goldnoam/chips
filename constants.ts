import { CellType, PieceShape } from './types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const LEVEL_DURATION = 20000; // 20 seconds in ms

export const DIFFICULTY_SETTINGS = {
  easy: {
    initialInterval: 1200,
    speedup: 60,
    name: 'Easy',
  },
  normal: {
    initialInterval: 1000,
    speedup: 75,
    name: 'Normal',
  },
  hard: {
    initialInterval: 700,
    speedup: 90,
    name: 'Hard',
  },
};

const I_SHAPE: PieceShape = [
  [CellType.FRY, CellType.FRY, CellType.FRY, CellType.FRY],
];

const L_SHAPE: PieceShape = [
  [CellType.FRY, CellType.EMPTY, CellType.EMPTY],
  [CellType.FRY, CellType.FRY, CellType.FRY],
];

const J_SHAPE: PieceShape = [
  [CellType.EMPTY, CellType.EMPTY, CellType.FRY],
  [CellType.FRY, CellType.FRY, CellType.FRY],
];

const O_SHAPE: PieceShape = [
  [CellType.FRY, CellType.FRY],
  [CellType.FRY, CellType.FRY],
];

const S_SHAPE: PieceShape = [
  [CellType.EMPTY, CellType.FRY, CellType.FRY],
  [CellType.FRY, CellType.FRY, CellType.EMPTY],
];

const T_SHAPE: PieceShape = [
  [CellType.EMPTY, CellType.FRY, CellType.EMPTY],
  [CellType.FRY, CellType.FRY, CellType.FRY],
];

const Z_SHAPE: PieceShape = [
  [CellType.FRY, CellType.FRY, CellType.EMPTY],
  [CellType.EMPTY, CellType.FRY, CellType.FRY],
];

export const FRY_PIECES_SHAPES: PieceShape[] = [I_SHAPE, L_SHAPE, J_SHAPE, O_SHAPE, S_SHAPE, T_SHAPE, Z_SHAPE];

export const BURGER_PIECE_SHAPE: PieceShape = [[CellType.BURGER]];
export const POTATO_PIECE_SHAPE: PieceShape = [[CellType.POTATO]];
export const KETCHUP_PIECE_SHAPE: PieceShape = [[CellType.KETCHUP]];
export const MUSTARD_PIECE_SHAPE: PieceShape = [[CellType.MUSTARD]];
export const DONUT_PIECE_SHAPE: PieceShape = [[CellType.DONUT]];
export const ONION_PIECE_SHAPE: PieceShape = [[CellType.ONION]];

// FIX: Added `as const` to prevent type widening on the `type` property.
// This ensures that TypeScript infers a specific literal type (e.g., CellType.BURGER)
// instead of the general `CellType`, which resolves the assignment error in `App.tsx`
// where the `Piece` type requires a `type` that is not `CellType.EMPTY`.
export const SINGLE_CELL_PIECES = [
  { shape: BURGER_PIECE_SHAPE, type: CellType.BURGER },
  { shape: POTATO_PIECE_SHAPE, type: CellType.POTATO },
  { shape: KETCHUP_PIECE_SHAPE, type: CellType.KETCHUP },
  { shape: MUSTARD_PIECE_SHAPE, type: CellType.MUSTARD },
  { shape: DONUT_PIECE_SHAPE, type: CellType.DONUT },
  { shape: ONION_PIECE_SHAPE, type: CellType.ONION },
] as const;
