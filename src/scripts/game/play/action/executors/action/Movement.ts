import { IActionData } from "../../ActionStack";
import { GameController } from "../../../../GameController";

export function ExecuteMove(data : IActionData, controller : GameController):Promise<void> {
  return new Promise((resolve) => {
      data.unit.x = data.tile.x;
      data.unit.y = data.tile.y;
      setTimeout(resolve, 100);
  });
}