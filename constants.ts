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

export const BURGER_PIECE_SHAPE: PieceShape = [
  [CellType.BURGER],
];
