import * as _ from 'lodash';

import { IActionData } from "../../ActionStack";
import { GameController } from "../../../../GameController";
import { Unit } from "../../../../board/Unit";
import { Tile } from "../../../../board/Tile";
import { IAbilityDef } from "../../abilities";

export interface IAbilityAction extends IActionData {
  source : Unit,
  target : Tile,
  ability : IAbilityDef,
}

export function ExecuteAbility(data : IAbilityAction, controller : GameController):Promise<void> {
  return new Promise((resolve) => {
    _.forEach(data.ability.effects, effect => {
     let tiles = controller.getTilesInRange(data.target, effect.range);
     _.forEach(tiles, tile => {
       let unit = controller.getUnit(tile);
       if (unit) {
        controller.sendAction({
          type : effect.type,
          data : {
            unit,
            amount : effect.amount,
          }
        });
       }
     });
    });
    controller.createEffect(data, resolve);

  });
}