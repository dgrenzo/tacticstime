import * as _ from 'lodash';

import { IActionData, IGameAction, GameEvent } from "../../ActionStack";
import { IAbilityDef } from "../../abilities";
import { BoardController } from '../../../../board/BoardController';
import { IElementMap } from '../../../../../engine/scene/Scene';
import { IUnit } from '../../../../board/Unit';
import { ITile } from '../../../../board/Tile';

export interface IAbilityAction extends IGameAction {
  type : "ABILITY",
  data : IAbilityActionData,
}

export interface IAbilityActionData extends IActionData {
  source : IUnit,
  target : ITile,
  ability : IAbilityDef,
}

export interface IEffectAction extends IGameAction {
  type : GameEvent,
  data : {
    [index : string] : any
  }
}

export function ExecuteAbility(action : IAbilityAction, elements : IElementMap, controller : BoardController):Promise<IElementMap> {
  
  return controller.getActionCallback(action).then(() => {
    _.forEach(action.data.ability.effects, effect => {
     let tiles = controller.getTilesInRange(action.data.target.pos, effect.range);
     tiles.forEach(tile => {
       let data = _.cloneDeep(effect.data);

       data = _.defaults(data, {tile});

       let unit = controller.getUnitAtPosition(tile.pos);
       if (unit) {

        controller.sendAction({
          type : effect.type,
          data : _.defaults(data, {entity_id : unit.id})
        } as IEffectAction);

      } else {

        controller.sendAction({
          type : effect.type,
          data
        } as IEffectAction);

      }
     });
    });
    return elements;
  });
}