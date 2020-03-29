import { IActionData } from "../../ActionStack";
import { GameController } from "../../../../GameController";
import { Unit } from "../../../../board/Unit";

export interface IDamageAction extends IActionData {
  unit : Unit,
  amount : number,
}

export function ExecuteDamage(data : IDamageAction, controller : GameController):Promise<void> {
  return new Promise((resolve) => {
    let starting_hp = data.unit.hp;

    if (starting_hp === 0) {
      resolve();
      return;
    }

    data.unit.hp = Math.max (starting_hp - data.amount, 0);

    if (data.unit.hp != starting_hp) {
      controller.sendAction({
        type : "DAMAGE_DEALT",
        data : {
          amount : starting_hp - data.unit.hp,
          unit : data.unit,
        }
      });
    }

    if (data.unit.hp === 0) {
      controller.sendAction({
        type : "UNIT_KILLED",
        data : {
          unit : data.unit
        }
      })
    }
    resolve();
    // setTimeout(resolve, 100);
  });
}