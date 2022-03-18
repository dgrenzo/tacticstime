import { IUnit } from "../../../../board/Unit";
import { IImmutableScene } from "../../../../../engine/scene/Scene";
import { CreateUnit, GameBoard, IActionData, IGameAction } from "../../../../board/GameBoard";
import { ITile } from "../../../../board/Tile";
import { ICreateUnitAction } from "./CreateUnit";
import { UnitLoader } from "../../../../assets/UnitLoader";
import { UNIT_TYPE } from "../../../../assets/AssetList";


export interface ISummonUnitAction extends IGameAction {
  type : "SUMMON_UNIT",
  data : ISummonUnitActionData,
}

export interface ISummonUnitActionData extends IActionData {
  unit_type : UNIT_TYPE,
  source : IUnit,
  tile : ITile,
}


export function ExecuteSummonUnit(action : ISummonUnitAction, scene : IImmutableScene):IImmutableScene {
    let unit_data = UnitLoader.GetUnitDefinition(action.data.unit_type);

    let unit = CreateUnit(unit_data, action.data.source.data.faction);

    unit.pos = {
      x :  action.data.tile.pos.x,
      y :  action.data.tile.pos.y,
    };

    scene = GameBoard.AddActions(scene, {
      type : "CREATE_UNIT",
      data : {
        unit : unit,
      }
    } as ICreateUnitAction );
    
    return scene;
}