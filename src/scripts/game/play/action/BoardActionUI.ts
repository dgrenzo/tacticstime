import { GameBoard } from "../../board/GameBoard";

import * as _ from 'lodash';
import { GameController } from '../../GameController';
import { ITilePos } from '../../board/GameBoard';
import { FSM } from '../../../engine/FSM';
import { Tile } from '../../board/Tile';
import { Unit } from '../../board/Unit';
import { IPathTile, GetMoveOptions } from '../../pathfinding';

enum UNIT_COLLISION {
  NONE = 0,
  ALL,
  ENEMY,
  ALLY,
}

export interface IBoardOption {
  [index : string] : any,
  tile : Tile,
}

export class BoardActionUI {
  protected m_options : IBoardOption[];

  constructor(protected m_active_tile : Tile, protected m_controller : GameController) {
  }

  public showOptions() {
  }

  public hideOptions() {
  }

  public getAction(tile : Tile) {
    return [];
  }
}
