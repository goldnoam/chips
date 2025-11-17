
export enum CellType {
  EMPTY = 0,
  FRY = 1,
  BURGER = 2,
}

export type Board = CellType[][];

export type PieceShape = CellType[][];

export interface Piece {
  shape: PieceShape;
  type: CellType.FRY | CellType.BURGER;
  position: { row: number; col: number };
}

export type Theme = 'dark' | 'light';
