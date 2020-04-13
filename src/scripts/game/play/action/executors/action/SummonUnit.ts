import { IActionData, IGameAction } from "../../ActionStack";
import { IUnit } from "../../../../board/Unit";
import { BoardController } from "../../../../board/BoardController";
import { IElementMap } from "../../../../../engine/scene/Scene";
import { CreateUnit } from "../../../../board/GameBoard";
import { LoadJSON, IMissionUnit } from "../../../../board/Loader";
import { ITile } from "../../../../board/Tile";
import { ICreateUnitAction } from "./CreateUnit";
import { UnitLoader } from "../../../../assets/UnitLoader";
import { UNIT_TYPE } from "../../../../types/units";


export interface ISummonUnitAction extends IGameAction {
  type : "SUMMON_UNIT",
  data : ISummonUnitActionData,
}

export interface ISummonUnitActionData extends IActionData {
  unit_type : UNIT_TYPE,
  tile : ITile,
}


export function ExecuteSummonUnit(action : ISummonUnitAction, elements : IElementMap, controller : BoardController):Promise<IElementMap> {

  return new Promise((resolve) => {

    let unit_data = UnitLoader.GetUnitDefinition(action.data.unit_type);

    let unit = CreateUnit({
      pos : action.data.tile.pos,
      unit : unit_data,
    });

    controller.sendAction({
      type : "CREATE_UNIT",
      data : {
        unit : unit,
      }
    } as ICreateUnitAction );
    
    resolve(elements);
  });
}