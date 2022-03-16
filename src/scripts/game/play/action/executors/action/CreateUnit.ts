import { IUnit } from "../../../../board/Unit";
import { IImmutableScene } from "../../../../../engine/scene/Scene";
import { GameBoard, IActionData, IGameAction } from "../../../../board/GameBoard";


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

export function ExecuteCreateUnit(action : ICreateUnitAction, scene : IImmutableScene):IImmutableScene {
  const unit : IUnit = action.data.unit;

  scene = GameBoard.AddElement(scene, unit);

  scene = GameBoard.AddActions(scene, {
    type : "UNIT_CREATED",
    data : {
      unit
    }
  } as IUnitCreatedAction);

  return scene;
}