import { IActionData, IGameAction } from "../../ActionStack";
import { IUnit } from "../../../../board/Unit";
import { BoardController } from "../../../../board/BoardController";
import { IElementMap } from "../../../../../engine/scene/Scene";
import { UpdateElements } from "../../../UpdateElements";


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
  const unit : IUnit = action.data.unit;
  const id : number = unit.id;

  elements = UpdateElements.AddEntity(elements, id, unit);

  return new Promise((resolve) => {
    controller.sendAction({
      type : "UNIT_CREATED",
      data : {
        unit
      }
    } as IUnitCreatedAction);

    resolve(elements);
  });
}