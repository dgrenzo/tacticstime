import { Entity, IAssetInfo } from "../../engine/scene/Entity";
import { UNIT_TYPE } from "../assets/units";
import { IAbilityInfo } from "../play/Ability";

export interface IUnitDef {
  asset : UNIT_TYPE,
}

export class Unit extends Entity {

  private m_unit_type : string;
  
  public hp : number = 1;
  
  constructor(x : number, y : number, data : IUnitDef) {
    super(x, y);
    this.m_unit_type = data.asset;
  }

  public getAbilities = () : IAbilityInfo[] => {
    return [
      {
        name : "MOVE",
        data : {
          range : 4,
        }
      },
      {
        name : "STRIKE",
        data : {
          range : 1,
          strength : 3,
        }
      }
    ];
  }

  public getMoveLeft = () : number => {
    return 6;
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