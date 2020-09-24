import { IActionData, IGameAction } from "../../ActionStack";
import { BoardController } from "../../../../board/BoardController";
import { IElementMap } from "../../../../../engine/scene/Scene";

export interface IKilledAction extends IGameAction {
  type : "UNIT_KILLED",
}

export function ExecuteKilled(action : IGameAction, elements : IElementMap, controller : BoardController):Promise<IElementMap> {
  return controller.animateGameAction(action).then( () => {
    controller.removeEntity(action.data.entity_id);
    return elements.remove(action.data.entity_id);
  });
}

