import * as _ from 'lodash';
import { IUnit } from "../board/Unit";
import { GameBoard, IBoardPos } from "../board/GameBoard";
import { ITile, TILE_DEF } from "../board/Tile";
import { IImmutableScene } from '../../engine/scene/Scene';

export interface IPathTile {
  cost : number,
  tile : ITile,
  last : IPathTile,
}

export interface ISearchTile {
  path : IPathTile,
  open : boolean,
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

  public exists(path : IPathTile) : boolean {
    let exists : boolean = false;
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
        if (path.cost < element.cost) {
          element.cost = path.cost;
          element.last = path.last;
        }
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
  public getTiles() : ITile[] {
    let tiles : ITile[] = []
    _.forEach(this.m_list, path => {
      tiles.push(path.tile);
    });
    return tiles;
  }
}

export function GetMoveOptions (unit : IUnit, scene : IImmutableScene) : IPathTile[] {
  if (!unit) {
    return [];
  }
  let max_cost = unit.stats.move;

  let closed_list = new PathList();
  let open_list = new PathList();
  
  let current_tile = GameBoard.GetTileAtPosiiton(scene, unit.pos);

  open_list.push({ tile : current_tile, cost : 0, last : null});

  while (!open_list.isEmpty())
  {
    let next : IPathTile = open_list.getLowestCost();
    closed_list.push(next);

    let adjacent = GetAdjacent(next.tile.pos, scene);
    _.forEach(adjacent, tile => {
      let path : IPathTile = ToPathTile(tile, next.cost, next);
      if (closed_list.exists(path) || path.cost > max_cost || !CanPassTile(unit, tile, scene)) {
        return;
      }

      open_list.push(path);
      return;
    });
  }
  let paths = closed_list.getPaths().filter(path => CanOccupyTile(unit, path.tile, scene));
  return paths;
}

function CanOccupyTile (unit : IUnit, tile : ITile,  scene : IImmutableScene) : boolean {
  const occupant = GameBoard.GetUnitAtPosition(scene, tile.pos);
  if (occupant && occupant !== unit) {
    return false;
  }
  return true;
}

function CanPassTile (unit : IUnit, tile : ITile, scene : IImmutableScene) : boolean {
  const occupant = GameBoard.GetUnitAtPosition(scene, tile.pos);
  if (occupant && occupant.data.faction !== unit.data.faction) {
    return false;
  }
  return true;
}

function GetAdjacent (tile : IBoardPos, scene : IImmutableScene) : ITile[] {
  return _.shuffle([
    GameBoard.GetTileAtPosiiton(scene, { x : tile.x - 1, y : tile.y    }),
    GameBoard.GetTileAtPosiiton(scene, { x : tile.x + 1, y : tile.y    }),
    GameBoard.GetTileAtPosiiton(scene, { x : tile.x    , y : tile.y - 1}),
    GameBoard.GetTileAtPosiiton(scene, { x : tile.x    , y : tile.y + 1}),
  ]);
}

function ToPathTile(tile : ITile, cost : number, last : IPathTile) : IPathTile {
  return {
    tile : tile,
    cost : cost + GetTileCost(tile),
    last : last,
  }
}

function GetTileCost (tile : ITile) {
  if (!tile) {
    return Infinity;
  }
  if (tile.data.tile_type === TILE_DEF.WATER_EMPTY) {
    return 2;
  }
  return 1;
}