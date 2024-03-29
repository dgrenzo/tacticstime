import * as _ from 'lodash';
import { GameBoard, IBoardPos } from '../board/GameBoard';
import { GetMoveOptions, IPathTile } from '../pathfinding/Pathfinding';
import { IUnit } from '../board/Unit';
import { ITile } from '../board/Tile';
import { GetAbilityDef, IAbilityDef } from './action/abilities';
import { IBoardOption } from './action/AbilityTargetUI';
import { IMoveAction } from './action/executors/action/Movement';
import { IImmutableScene } from '../../engine/scene/Scene';
import { IAbilityAction } from './action/executors/action/Ability';
import { GameAura } from './action/auras/GameAura';
import { AuraLoader } from '../assets/AuraLoader';

enum TURN_STATE {
  BEFORE_MOVE = 0,
  MOVING,
  BEFORE_ACTING,
  ACTING,
  AFTER_ACTING,
}


interface ISelection {
  tile : ITile,
  unit ?: IUnit,
}

interface ITurnOption {
  score : number,
  move_action : any,
  ability_action : any,
}

export class EnemyTurn {

  public static async FindBestMove(base_scene : IImmutableScene, unit_id) : Promise<IImmutableScene> {

    const LAG_TIME = 20;
    let lag_timeout = Date.now() + LAG_TIME;

    const unit = GameBoard.GetUnit(base_scene, unit_id);

    let move_options = GetMoveOptions(unit, base_scene)
    
    let ai_options : ITurnOption[] = [];


    for (let i = 0; i < move_options.length; i ++) {
      const option = move_options[i];

      const move_action = ToMoveAction(option, unit.id);
      let move_scene = base_scene;

      move_scene = GameBoard.AddActions(move_scene, move_action);
      move_scene = GameBoard.ExecuteActionStack(move_scene);

      const active_unit = GameBoard.GetUnit(move_scene, unit_id);

      for (let n = 0; n < active_unit.abilities.length; n ++) {
        const ability_name = active_unit.abilities[n];

        let ability_def = GetAbilityDef(ability_name);
        if (active_unit.status.mana < ability_def.cost) {
          continue;
        }

        const ability_options = GetAbilityOptions(move_scene, active_unit, ability_def);

        for (let p = 0; p < ability_options.length; p ++) {
          let ability_action = ToAction(ability_options[p].tile, unit, ability_def);

          let ability_scene = move_scene;
          ability_scene = GameBoard.AddActions(ability_scene, ability_action);
          ability_scene = GameBoard.ExecuteActionStack(ability_scene);

          const opt = {
            score : ScoreBoard(ability_scene, active_unit.id),
            move_action,
            ability_action,
          };
          
          if(Date.now() > lag_timeout) {
            console.log('waiting because of lag ' + lag_timeout);
            await new Promise(resolve => { requestAnimationFrame(resolve) });
            lag_timeout = Date.now() + LAG_TIME;
          }

          ai_options.push(opt)
        }
      }
    }
    let best : ITurnOption = null;
    _.forEach(ai_options, option => {
      if (best === null || option.score > best.score) {
        best = option;
      }
    });

    // console.log('best') 
    // console.log(best.move_action);
    // console.log(best.ability_action);

    let scene = base_scene;
    scene = GameBoard.AddActions(scene, best.move_action);
    scene = GameBoard.AddActions(scene, best.ability_action);
    
    return scene;
  }
}

function GetAbilityOptions(scene : IImmutableScene, active_unit : IUnit, ability_def : IAbilityDef) {
  const target_def = ability_def.target;
  const start = active_unit.pos;

  let max_range = target_def.range.max;
  let min_range = target_def.range.min;
    
  let options : IBoardOption[] = []
  for (let offset_x = -max_range; offset_x <= max_range; offset_x ++) {
    let max_y = max_range - Math.abs(offset_x);
    for (let offset_y = -max_y; offset_y <= max_y; offset_y ++) {
      if (Math.abs(offset_x) + Math.abs(offset_y) < min_range) {
        continue;
      }
      const target_pos : IBoardPos = {
        x : start.x + offset_x, 
        y : start.y + offset_y 
      };
      const tile = GameBoard.GetTileAtPosiiton(scene, target_pos);
      if (tile) {
        let target_unit = GameBoard.GetUnitAtPosition(scene, tile.pos);
        switch (ability_def.target.target_type) {
          case "EMPTY" : 
            if (target_unit) {
              continue;
            }
            break;

          case "ALLY" : 
            if (!target_unit || active_unit.data.faction !== target_unit.data.faction){
              continue;
            }
            break;
          
          case "ENEMY" :
            if (!target_unit || active_unit.data.faction === target_unit.data.faction) {
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

function ScoreUnit(unit : IUnit) {
  let score = 0;
  score += 5;
  score += unit.status.hp;

  if (unit.auras) {
    for (let i = 0; i < unit.auras.length; i ++) {
      const aura_name = unit.auras[i];
      score += AuraLoader.GetAuraDefinition(aura_name).value;
    }
  }
  return score;
}

function ScoreBoard (scene : IImmutableScene, unit_id : number) {
  let score = Math.random() / 4;

  let active_unit = GameBoard.GetUnit(scene, unit_id);

  if (!active_unit) {
    return score;
  
  }
  const faction = active_unit.data.faction;

  GameBoard.GetUnits(scene).forEach( unit => {
    let unit_score = ScoreUnit(unit);
    score += unit_score * (unit.data.faction === active_unit.data.faction ? 1 : -5);
  });

  if (active_unit) {
    let closest = Infinity;
    GameBoard.GetUnits(scene).forEach( unit => {
      if (unit.data.faction !== faction) {
        let distance = Math.random()/4 + Math.abs(active_unit.pos.x - unit.pos.x) + Math.abs(active_unit.pos.y - unit.pos.y);
        if (distance < closest) {
          closest = distance;
        }
      }
    });
    if (closest != Infinity) {
      score -= closest;
    }
  }
  return score;
}
  
function ToMoveAction(path : IPathTile, unit_id : number) : IMoveAction[]{
  let action : IMoveAction[] = [];
  
  while (path) {
    action.unshift({
      type : "MOVE",
      data : {
        entity_id : unit_id,
        move : { 
          to : {
            x : path.tile.pos.x,
            y : path.tile.pos.y,
          }
        }
      }
    });
    path = path.last;
  }
  return action;
}

function ToAction(tile : ITile, active_unit : IUnit, ability_def : IAbilityDef) : IAbilityAction[] {
  return [
    {
      type : "ABILITY",
      data : {
        source : active_unit,
        target : tile,
        ability : ability_def,
      }
    }
  ];
}