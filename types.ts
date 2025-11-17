
export enum CellType {
  EMPTY = 0,
  FRY = 1,
  BURGER = 2,
  POTATO = 3,
  KETCHUP = 4,
  DONUT = 5,
  ONION = 6,
}

export type Board = CellType[][];

export type PieceShape = CellType[][];

export interface Piece {
  shape: PieceShape;
  type: Exclude<CellType, CellType.EMPTY>;
  position: { row: number; col: number };
}

export type Theme = 'dark' | 'light';