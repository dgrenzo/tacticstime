import { Entity, IAssetInfo } from "../../engine/scene/Entity";
import { ILoadedUnit } from "./Loader";

export class Unit extends Entity {

  private m_unit_type : string;
  
  public hp : number = 1;
  
  constructor(x : number, y : number, private m_data : ILoadedUnit) {
    super(x, y);
    this.m_unit_type = m_data.display.sprite;
  }

  public getAbilities = () : string[] => {
    return this.m_data.abilities;
  }

  public getSpeed = () : number => {
    return this.m_data.stats.speed;
  }
  public getMove = () : number => {
    return this.m_data.stats.move;
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