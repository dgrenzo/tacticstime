import { IActionData, IGameAction } from "../../ActionStack";
import { IUnit } from "../../../../board/Unit";
import { ITile } from "../../../../board/Tile";
import { BoardController } from "../../../../board/BoardController";
import { IElementMap } from "../../../../../engine/scene/Scene";


export interface ICreateUnitAction extends IGameAction {
  type : "CREATE_UNIT",
  data : ICreateUnitActionData,
}

export interface ICreateUnitActionData extends IActionData {
  unit : IUnit,
}

export interface IUnitCreatedAction extends IGameAction {
  type : "UNIT_CREATED",
  data : ICreateUnitActionData,
}

export function ExecuteCreateUnit(action : ICreateUnitAction, elements : IElementMap, controller : BoardController):Promise<IElementMap> {

  elements = elements.set(action.data.unit.id, action.data.unit);

  return new Promise((resolve) => {
    controller.sendAction({
      type : "UNIT_CREATED",
      data : {
        unit : action.data.unit,
      }
    } as IUnitCreatedAction);

    resolve(elements);
  });
}