export enum FACTION {
  WHITE = 0,
  BLACK,
}

export enum PIECE {
  PAWN = 0,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
}

export function factionToString(faction : FACTION) : string {
  switch (faction) {
    case FACTION.BLACK : return 'black';
    case FACTION.WHITE : return 'white';
  }
}