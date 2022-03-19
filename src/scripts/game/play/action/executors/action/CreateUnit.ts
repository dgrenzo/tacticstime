import * as _ from 'lodash';
import { IUnit } from "../../../../board/Unit";
import { IImmutableScene } from "../../../../../engine/scene/Scene";
import { CreateAura, GameBoard, IActionData, IGameAction } from "../../../../board/GameBoard";
import { AuraLoader } from "../../../../assets/AuraLoader";


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

  if (unit.auras) {
    for (let i = 0; i < unit.auras.length; i ++) {
      const aura_id = unit.auras[i];
  
      const aura = CreateAura(AuraLoader.GetAuraDefinition(aura_id));
      aura.config.config.target_id = unit.id;
  
      scene = GameBoard.AddListener(scene, aura.config.trigger.action, aura);
      scene = GameBoard.AddElement(scene, aura);
    }
  }

  scene = GameBoard.AddElement(scene, unit);

  scene = GameBoard.AddActions(scene, {
    type : "UNIT_CREATED",
    data : {
      unit
    }
  } as IUnitCreatedAction);

  return scene;
}