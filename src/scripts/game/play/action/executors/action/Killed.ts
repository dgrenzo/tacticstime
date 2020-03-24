import { IActionData } from "../../ActionStack";
import { GameController } from "../../../../GameController";
import { Unit } from "../../../../board/Unit";


export function ExecuteKilled(data : IActionData, controller : GameController):Promise<void> {
  return new Promise((resolve) => {
    controller.removeUnit(data.unit);
    setTimeout(resolve, 100);
  });
}