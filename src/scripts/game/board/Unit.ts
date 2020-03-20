import { Entity, IAssetInfo } from "../../engine/scene/Entity";
import { UNIT_TYPE } from "../assets/units";

export interface IUnitDef {
  asset : UNIT_TYPE,
}

export class Unit extends Entity {

  private m_unit_type : string;
  
  constructor(x : number, y : number, data : IUnitDef) {
    super(x, y);
    this.m_unit_type = data.asset;
  }

  public getMoveLeft = () : number => {
    return 3;
  }

  public get depthOffset () : number {
    return 2;
  }
  
  public getCurrentAsset = () : IAssetInfo => {
    return {
      type : "ANIMATED_SPRITE",
      name : this.m_unit_type + '_idle',
    }
  }
}