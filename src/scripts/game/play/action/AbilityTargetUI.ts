import * as _ from 'lodash';
import { IBoardPos } from '../../board/GameBoard';
import { IPathTile } from '../../pathfinding/Pathfinding';
import { ITargetDef } from './abilities';
import { ITile } from '../../board/Tile';
import { IAbilityAction } from './executors/action/Ability';
import { IImmutableScene } from '../../../engine/scene/Scene';

export interface IBoardOption {
  [index : string] : any,
  tile : ITile,
}

// export class AbilityTargetUI extends BoardActionUI {
//   protected m_options : IBoardOption[];

//   constructor(protected m_ability_def : IAbilityDef, protected m_active_unit : IUnit, scene : IImmutableScene) {
//     super(m_active_unit, m_controller);

//     this.m_options = GetTileOptionsInRange(this.m_active_unit.pos, this.m_ability_def.target);
//   }
// }
function GetTileOptionsInRange(scene : IImmutableScene, start : IBoardPos, target_def : ITargetDef) {

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
          let unit = this.m_controller.GetUnitAtPosition(tile.pos);
          switch (this.m_ability_def.target.target_type) {
            case "EMPTY" : 
              if (unit) {
                continue;
              }
              break;

            case "ALLY" : 
              if (!unit || this.m_active_unit.data.faction !== unit.data.faction){
                continue;
              }
              break;
            
            case "ENEMY" :
              if (!unit || this.m_active_unit.data.faction === unit.data.faction) {
                continue;
              }
              break;

            case "ANY" :
              
              break;
          }

          options.push({tile});
        }
      }
    }
    return options;
  }
function GetAction (tile : ITile, options : IAbilityAction[]) : IAbilityAction[] {
    let option = GetOptionFromTile(tile, options);
    return ToAction(option);
}

function ToAction(option : IBoardOption) : IAbilityAction[] {
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

function GetOptionFromTile(tile : ITile, options : IAbilityAction[]) {
  let path : IPathTile = null;
  // _.forEach(options, option => {
  //   if (option.tile === tile) {
  //     path = option as any;
  //     return false;
  //   }
  //   return true;
  // });
  return path;
}