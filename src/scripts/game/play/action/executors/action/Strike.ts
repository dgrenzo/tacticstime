import { IActionData } from "../../ActionStack";
import { GameController } from "../../../../GameController";
import { Unit } from "../../../../board/Unit";
import { Tile } from "../../../../board/Tile";

export interface IStrikeAction extends IActionData {
  unit : Unit,
  target : Unit,
  tile : Tile,
  damage : number,
}

export function ExecuteStrike(data : IStrikeAction, controller : GameController):Promise<void> {
  return new Promise((resolve) => {
    controller.sendAction({
      type : "DAMAGE",
      data : {
        amount : 1,
        unit : data.target,
      }
    });
    setTimeout(resolve, 100);
  });
}