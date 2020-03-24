import { GameBoard } from "../../board/GameBoard";

import * as _ from 'lodash';
import { GameController } from '../../GameController';
import { ITilePos } from '../../board/GameBoard';
import { FSM } from '../../../engine/FSM';
import { Tile } from '../../board/Tile';
import { Unit } from '../../board/Unit';
import { IPathTile, GetMoveOptions } from '../../pathfinding';
import { BoardActionUI } from "./BoardActionUI";

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

export class MoveActionUI extends BoardActionUI {
  private m_active_unit : Unit;
  protected m_options : IPathTile[];

  constructor(protected m_tile : Tile, protected m_controller : GameController) {
    super(m_tile, m_controller);

    this.m_active_unit = this.m_controller.getUnit(this.m_active_tile);
    this.m_options = this.m_controller.getMoveOptions(this.m_active_unit);

    this.showOptions();
  }

  public showOptions = () => {
    _.forEach(this.m_options, path => {
      if (!this.m_controller.getUnit(path.tile)) {
        this.m_controller.emit("SET_PLUGIN", {id : path.tile.id, plugin : 'highlight_blue'});
      }
    });
  }

  public hideOptions = () => {
     _.forEach(this.m_options, path => {
      if (!this.m_controller.getUnit(path.tile)) {
        this.m_controller.emit("SET_PLUGIN", {id : path.tile.id, plugin : 'batch'});
      }
    });
  }

  public getAction = (tile : Tile) => {
    let option = this.getOptionFromTile(tile);
    return this.toMoveAction(option);
  }
  
  private toMoveAction(path : IPathTile) {
    let action = [];
    
    while (path) {
      action.unshift({
        type : "MOVE",
        data : {
          unit : this.m_active_unit,
          tile : path.tile,
        }
      });
      path = path.last;
    }
    return action;
  }

  private getOptionFromTile(tile : Tile) {
    let path : IPathTile = null;
    _.forEach(this.m_options, option => {
      if (option.tile === tile) {
        path = option as any;
        return false;
      }
      return true;
    });
    return path;
  }
}
