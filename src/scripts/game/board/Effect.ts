import { Entity, IAssetInfo } from "../../engine/scene/Entity";
import { IAbilityAction } from "../play/action/executors/action/Ability";

export class Effect extends Entity {
  constructor (private m_ability : IAbilityAction) {
    super(m_ability.target.x, m_ability.target.y);
  }

  public getCurrentAsset = () : IAssetInfo => {
    return {
      type : "EFFECT",
      name : this.m_ability.ability.name,
    }
  }
 
  public get depthOffset() : number {
    return 10;
  }
  public get ability_def () {
    return this.m_ability;
  }
}