import { IActionData, IGameAction } from "../../ActionStack";
import { BoardController } from "../../../../board/BoardController";
import { IElementMap } from "../../../../../engine/scene/Scene";

export interface IDamageAction extends IGameAction {
  type : "DAMAGE",
  data : IDamageActionData,
}

export interface IDamageActionData extends IActionData {
  amount : number,
}

export interface IDamageDealtAction extends IGameAction {
  type : "DAMAGE_DEALT",
  data : IDamageActionData,
}


export function ExecuteDamage(action : IDamageAction, elements : IElementMap, controller : BoardController):Promise<IElementMap> {
  return new Promise((resolve) => {
    let unit = controller.getUnit(action.data.entity_id);
    if (!unit) {
      return resolve(elements);
    }

    let starting_hp = unit.status.hp;

    if (starting_hp === 0) {
      return resolve(elements);
    }

    let new_hp = Math.max(starting_hp - action.data.amount, 0);
    if (new_hp != starting_hp) {
      controller.sendAction({
        type : "DAMAGE_DEALT",
        data : {
          amount : starting_hp - new_hp,
          entity_id : unit.id,
        }
      } as IDamageDealtAction);
    }

    if (new_hp === 0) {
      controller.sendAction({
        type : "UNIT_KILLED",
        data : {
          entity_id : unit.id
        }
      })
    }

    let result = elements.setIn([action.data.entity_id, 'status', 'hp' ], new_hp);
    resolve(result);
  });
}