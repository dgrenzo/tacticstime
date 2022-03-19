import * as _ from 'lodash';
import { IImmutableScene } from "../../../engine/scene/Scene";
import { GameBoard, IGameAction } from "../../board/GameBoard";
import { IUnit } from "../../board/Unit";
import { IAuraConfig, IConfigPath } from "./auras/GameAura";

export interface IEffectContext {
  action ?: IGameAction,
  aura ?: IAuraConfig,
  unit ?: IUnit,
}

type TargetType = "ANY" | "EMPTY" | "UNIT" | "ENEMY" | "ALLY";

export interface IRangeDef {
  min : number,
  max : number,
}

export interface ITargetDef {
  range : IRangeDef,
  target_type : TargetType,
}

export interface IEffectDef {
  type : string,
  data : any,
  range ?: IRangeDef,
  target_type ?: TargetType,
}

/**
 * {
      "type" : "SUMMON_UNIT",
      "data" : {
        "unit_type" : ["CONST", "lizard"],
        "tile" : ["ACTION", "tile"]
      },
      "range" : {
        "min" : 0,
        "max" : 0
      }
    }
    {
      "type" : "DAMAGE",
      "data" : {
        "amount" : 2
      },
      "range" : {
        "min" : 0,
        "max" : 0
      }
    }

    {
      "type" : "UPDATE_ACTION_VALUE",
      "data" : {
        "value_src" : "amount",
        "value" : 10
      }
    }
 */

export class ActionEffect {

  public static GetFromPath(scene : IImmutableScene, context : IEffectContext, path : IConfigPath) : any {
    const {unit, action, aura} = context;
    
    let data = null;
    switch (path[0]) {
      case "CONST" : return path[1];
      case "ACTION" : data = action.data; break;
      case "AURA_CONFIG" : data = aura.config; break;
    }

    for (let i = 1 ; i < path.length; i ++) {
      data = data[path[i]];
    }
    return data;
  }

  public static UpdateActionValue(scene : IImmutableScene, action : IGameAction, path : IConfigPath, value : any) : IGameAction {

    let data = action.data;

    for (let i = 0 ; i < path.length - 1; i ++) {
      data = data[path[i]];
    }
    
    data[path[path.length - 1]] = value;

    return action;
  }


  public static ExecuteEffect (scene : IImmutableScene, effect : IEffectDef, context ?: IEffectContext) : IImmutableScene {

    let {unit, action, aura} = context;
    const range = effect.range ?? { max : 0, min : 0 };

    if (effect.type === "UPDATE_ACTION_VALUE") {
        const value = ActionEffect.GetFromPath(scene, context, effect.data.value);
        action = ActionEffect.UpdateActionValue(scene, action, effect.data.value_src, value);
        return GameBoard.UpdateAction(scene, 0, action);;
    }

    let target_tile = (action.data.target ? action.data.target : action.data.source).pos;

    const tiles = GameBoard.GetTilesInRange(scene, target_tile, effect.range);

    const count = tiles.count();
    for (let i = 0; i < count ; i ++) {
      const tile = tiles.get(i);

      let data = _.cloneDeep(effect.data);

      const keys = Object.keys(data);
      for (let n = 0; n < keys.length; n ++) {
        const key = keys[n];
        data[key] = ActionEffect.GetFromPath(scene, context, data[key]);
      }


      data = _.defaults(data, {tile, source : action.data.source});

      let unit = GameBoard.GetUnitAtPosition(scene, tile.pos);
      if (unit) {
        scene = GameBoard.AddActions(scene, {
          type : effect.type,
          data : _.defaults(data, {entity_id : unit.id})
        } as IGameAction);
      } else {
        scene = GameBoard.AddActions(scene, {
          type : effect.type,
          data
        } as IGameAction);
      }
    }

    return scene;
  }
}