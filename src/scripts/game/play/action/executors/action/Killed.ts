import { IGameAction } from "../../ActionStack";
import { BoardController } from "../../../../board/BoardController";
import { IElementMap } from "../../../../../engine/scene/Scene";
import { UpdateElements } from "../../../UpdateElements";

export interface IKilledAction extends IGameAction {
  type : "UNIT_KILLED",
}

export function ExecuteKilled(action : IGameAction, elements : IElementMap, controller : BoardController):Promise<IElementMap> {
  return controller.animateGameAction(action).then( () => {
    controller.removeEntity(action.data.entity_id);
    return UpdateElements.RemoveEntity(elements, action.data.entity_id);
  });
}

