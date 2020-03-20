import * as _ from 'lodash';
import { Unit } from "../board/Unit";
import { GameBoard, ITilePos } from "../board/GameBoard";
import { Tile, TILE_DEF, GetTileName } from "../board/Tile";

export interface IPathTile {
  cost : number,
  tile : Tile,
  last : IPathTile,
}

class PathList {
  private m_list : IPathTile[] = [];
  constructor() {

  }

  public isEmpty() {
    return this.m_list.length === 0;
  }

  public getLowestCost() : IPathTile {
    let path : IPathTile = null;
    _.forEach(this.m_list, element => {
      if (!path || element.cost < path.cost) {
        path = element;
      }
    });

    _.remove(this.m_list, (element => { return element === path; }));

    return path;
  }

  public push(path : IPathTile) {
    if (path.tile === null) {
      return;
    }

    if (this.exists(path)) {
      this.updateCost(path);
    } else {
      this.m_list.push(path);
    }
  }

  public exists(path : IPathTile) {
    let exists = false;
    _.forEach(this.m_list, element => {
      if (path.tile === element.tile) {
        exists = true;
        return false;
      }
      return true;
    });
    return exists;
  }

  public updateCost(path : IPathTile) {
    _.forEach(this.m_list, element => {
      if (path.tile === element.tile) {
        element.cost = path.cost;
        element.last = path.last;
        return false;
      }
      return true;
    });
  }

  public shift() : IPathTile {
    return this.m_list.shift();
  }

  public getPaths() : IPathTile[] {
    return this.m_list;
  }
  public getTiles() : Tile[] {
    let tiles : Tile[] = []
    _.forEach(this.m_list, path => {
      tiles.push(path.tile);
    });
    return tiles;
  }
}

export function GetMoveOptions (unit : Unit, board : GameBoard) : IPathTile[] {
  let max_cost = unit.getMoveLeft();

  let closed_list = new PathList();
  let open_list = new PathList();
  
  open_list.push({ tile : board.getTile(unit), cost : 0, last : null});

  while (!open_list.isEmpty())
  {
    let next : IPathTile = open_list.getLowestCost();
    closed_list.push(next);

    let adjacent = GetAdjacent(next.tile, board);
    _.forEach(adjacent, tile => {
      let path : IPathTile = ToPathTile(tile, next.cost, next);
      if (closed_list.exists(path) || path.cost > max_cost) {
        return;
      }

      open_list.push(path);
      return;
    });
  }
  return closed_list.getPaths();
}

function CanOccupyTile (unit : Unit, tile : Tile, board : GameBoard) : boolean {

  return true;
}

function CanPassTile (unit : Unit, tile : Tile, board : GameBoard) : boolean {

  return true;
}

function GetAdjacent (tile : ITilePos, board : GameBoard) : Tile[] {
  return [
    board.getTile({ x : tile.x - 1, y : tile.y    }),
    board.getTile({ x : tile.x + 1, y : tile.y    }),
    board.getTile({ x : tile.x    , y : tile.y - 1}),
    board.getTile({ x : tile.x    , y : tile.y + 1}),
  ];
}

function ToPathTile(tile : Tile, cost : number, last : IPathTile) : IPathTile {
  return {
    tile : tile,
    cost : cost + GetTileCost(tile),
    last : last,
  }
}

function GetTileCost (tile : Tile) {
  if (!tile) {
    return Infinity;
  }
  if (tile.type === TILE_DEF.WATER_EMPTY) {
    return 2;
  }
  return 1;
}