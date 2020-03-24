import { GameBoard } from "../../board/GameBoard";

import * as _ from 'lodash';
import { GameController } from '../../GameController';
import { ITilePos } from '../../board/GameBoard';
import { FSM } from '../../../engine/FSM';
import { Tile } from '../../board/Tile';
import { Unit } from '../../board/Unit';
import { IPathTile } from '../../pathfinding';
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

export class AttackActionUI extends BoardActionUI {
  private m_active_unit : Unit;
  protected m_options : IBoardOption[];

  constructor(protected m_tile : Tile, protected m_controller : GameController) {
    super(m_tile, m_controller);

    this.m_active_unit = this.m_controller.getUnit(this.m_active_tile);

    this.m_options = this.getTileOptionsInRange(this.m_active_unit, 2, 1);

    this.showOptions();
  }

  private getTileOptionsInRange = (start : ITilePos, max_range : number, min_range : number = 1) => {
    let options : IBoardOption[] = []
    for (let offset_x = -max_range; offset_x <= max_range; offset_x ++) {
      let max_y = max_range - Math.abs(offset_x);
      for (let offset_y = -max_y; offset_y <= max_y; offset_y ++) {
        if (Math.abs(offset_x) + Math.abs(offset_y) < min_range) {
          continue;
        }
        let tile = this.m_controller.getTile({x : start.x + offset_x, y : start.y + offset_y});
        if (tile) {
          options.push({tile});
        }
      }
    }
    
    return options;
  }


  public showOptions = () => {
    _.forEach(this.m_options, path => {
      this.m_controller.emit("SET_PLUGIN", {id : path.tile.id, plugin : 'highlight_red'});
    });
  }

  public hideOptions = () => {
     _.forEach(this.m_options, path => {
      this.m_controller.emit("SET_PLUGIN", {id : path.tile.id, plugin : 'batch'});
    });
  }

  public getAction = (tile : Tile) => {
    let option = this.getOptionFromTile(tile);
    return this.toAttackAction(option);
  }
  
  private toAttackAction(option : IBoardOption) {
    let target = this.m_controller.getUnit(option.tile);
    if (!target) {
      return [];
    }
    return [
      {
        type : "STRIKE",
        data : {
          unit : this.m_active_unit,
          target : this.m_controller.getUnit(option.tile),
          damage : 1,
          tile : option.tile,
        }
      }
    ];
  }

  private getExecuteFunction = () => {
  return (data : {unit : Unit, tile : ITilePos, target : Unit}) : Promise<null> => {
    return new Promise(resolve => {
      setTimeout(resolve, 100);
    })
  }
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
