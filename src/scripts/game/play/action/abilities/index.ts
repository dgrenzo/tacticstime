import * as _ from 'lodash';
import { LoadJSON } from '../../../board/Loader';
import { IEffectDef, ITargetDef } from '../ActionEffect';

enum TARGET_TYPE {
  ANY = 0,
  EMPTY,
  UNIT,
  ENEMY,
  ALLY,
}

type EffectType = "DAMAGE" | "HEAL";



export interface IAbilityDef {
  name : string,
  cost : number,
  target : ITargetDef,
  effects :  IEffectDef[]
}

const s_ability_map : Map<string, IAbilityDef> = new Map();

_.forEach( ["meteor", "strike", "shoot", "summon", "wait"], ability_name => {
  LoadJSON<IAbilityDef>('assets/data/abilities/' + ability_name + '.json').then(def => {
    s_ability_map.set(ability_name, def);
  })
});

export function GetAbilityDef(ability_name : string) : IAbilityDef {
  return s_ability_map.get(ability_name);
}