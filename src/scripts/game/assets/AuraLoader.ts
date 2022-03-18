import * as _ from 'lodash'
import { Map } from 'immutable';
import { IAuraDef } from "../play/action/auras/GameAura";
import { AURAS, AURA_TYPE, DATA_ASSET_MAP } from './AssetList';
import { LoadJSON } from '../board/Loader';

export class AuraLoader {
    
  private static s_aura_defs : Map<AURA_TYPE, IAuraDef>;

  public static GetAuraDefinition = (aura_name : string) : IAuraDef => {
    if (!isAura(aura_name)) {
      return null;
    }

    return AuraLoader.s_aura_defs.get(aura_name);
  }

  public static LoadAuraDefinitions = () : Promise<void[]> => {

    AuraLoader.s_aura_defs = Map<AURA_TYPE, IAuraDef>();
    let promises : Promise<void>[] = [];

    Object.keys(DATA_ASSET_MAP.auras).forEach((aura_type : AURA_TYPE) => {
      const asset_path = DATA_ASSET_MAP.auras[aura_type];

      promises.push( LoadJSON<IAuraDef>(asset_path)
        .then ( unit_data => { 
          AuraLoader.s_aura_defs = AuraLoader.s_aura_defs.set(aura_type, unit_data) 
        })
      );
    });

    return Promise.all(promises);
  }
}

function isAura(aura : string) : aura is AURA_TYPE {
  return AURAS.includes(aura as AURA_TYPE);
}
