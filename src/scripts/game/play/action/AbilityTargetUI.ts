import * as _ from 'lodash';
import { GameController } from '../../GameController';
import { ITilePos } from '../../board/GameBoard';
import { Tile } from '../../board/Tile';
import { Unit } from '../../board/Unit';
import { IPathTile } from '../../pathfinding';
import { BoardActionUI } from "./BoardActionUI";
import { IAbilityDef, ITargetDef, IRangeDef } from './abilities';

export interface IBoardOption {
  [index : string] : any,
  tile : Tile,
}

export class AbilityTargetUI extends BoardActionUI {
  private m_active_unit : Unit;
  protected m_options : IBoardOption[];

  constructor(protected m_ability_def : IAbilityDef, m_tile : Tile, protected m_controller : GameController) {
    super(m_tile, m_controller);

    this.m_active_unit = this.m_controller.getUnit(this.m_active_tile);

    this.m_options = this.getTileOptionsInRange(this.m_active_unit, this.m_ability_def.target);

    this.showOptions();
  }

  private getTileOptionsInRange = (start : ITilePos, target_def : ITargetDef) => {

    let max_range = target_def.range.max;
    let min_range = target_def.range.min;
    
    //TODO filter options with target_def.target_type

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
    return this.toAction(option);
  }
  
  private toAction(option : IBoardOption) {
    return [
      {
        type : "ABILITY",
        data : {
          source : this.m_active_unit,
          target : option.tile,
          ability : this.m_ability_def,
        }
      }
    ];
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
