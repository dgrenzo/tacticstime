import { IActionData, IGameAction } from "../../ActionStack";
import { BoardController } from "../../../../board/BoardController";
import { IElementMap } from "../../../../../engine/scene/Scene";
import { UpdateElements } from "../../../UpdateElements";

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
    const unit = controller.getUnit(action.data.entity_id);
    if (!unit) {
      return resolve(elements);
    }

    let starting_hp = unit.status.hp;

    if (starting_hp === 0) {
      return resolve(elements);
    }

    const new_hp = Math.max(starting_hp - action.data.amount, 0);
    const difference = starting_hp - new_hp;
    if (difference != 0) {
      controller.sendAction({
        type : "DAMAGE_DEALT",
        data : {
          amount : difference,
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

    const result = UpdateElements.SetHP(elements, unit.id, new_hp)

    resolve(result);
  });
}