import * as _ from 'lodash';
import { IBoardPos } from '../../board/GameBoard';
import { IPathTile } from '../../pathfinding';
import { BoardActionUI } from "./BoardActionUI";
import { IAbilityDef, ITargetDef } from './abilities';
import { BoardController } from '../../board/BoardController';
import { ITile } from '../../board/Tile';
import { IUnit } from '../../board/Unit';
import { IAbilityAction } from './executors/action/Ability';

export interface IBoardOption {
  [index : string] : any,
  tile : ITile,
}

export class AbilityTargetUI extends BoardActionUI {
  protected m_options : IBoardOption[];

  constructor(protected m_ability_def : IAbilityDef, protected m_active_unit : IUnit, protected m_controller : BoardController) {
    super(m_active_unit, m_controller);

    this.m_options = this.getTileOptionsInRange(this.m_active_unit.pos, this.m_ability_def.target);
  }

  private getTileOptionsInRange = (start : IBoardPos, target_def : ITargetDef) => {

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

  public getAction = (tile : ITile) : IAbilityAction[] => {
    let option = this.getOptionFromTile(tile);
    return this.toAction(option);
  }
  
  private toAction(option : IBoardOption) : IAbilityAction[] {
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

  private getOptionFromTile(tile : ITile) {
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
