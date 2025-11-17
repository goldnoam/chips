
export enum CellType {
  EMPTY = 0,
  FRY = 1,
  BURGER = 2,
  POTATO = 3,
  KETCHUP = 4,
  MUSTARD = 5,
  DONUT = 6,
  ONION = 7,
}

export type Board = CellType[][];

export type PieceShape = CellType[][];

export interface Piece {
  shape: PieceShape;
  type: Exclude<CellType, CellType.EMPTY>;
  position: { row: number; col: number };
}

export type Theme = 'dark' | 'light';