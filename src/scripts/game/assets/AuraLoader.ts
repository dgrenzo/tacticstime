import * as _ from 'lodash'
import { Map } from 'immutable';
import { AURAS, AURA_TYPE, DATA_ASSET_MAP } from './AssetList';
import { LoadJSON } from '../board/Loader';
import { IAuraConfig } from '../play/action/auras/GameAura';

export class AuraLoader {
    
  private static s_aura_defs : Map<AURA_TYPE, IAuraConfig>;

  public static GetAuraDefinition = (aura_name : string) : IAuraConfig => {
    if (!isAura(aura_name)) {
      return null;
    }

    return AuraLoader.s_aura_defs.get(aura_name);
  }

  public static LoadAuraDefinitions = () : Promise<void[]> => {

    AuraLoader.s_aura_defs = Map<AURA_TYPE, IAuraConfig>();
    let promises : Promise<void>[] = [];

    Object.keys(DATA_ASSET_MAP.auras).forEach((aura_type : AURA_TYPE) => {
      const asset_path = DATA_ASSET_MAP.auras[aura_type];

      promises.push( LoadJSON<IAuraConfig>(asset_path)
        .then ( aura_data => { 
          AuraLoader.s_aura_defs = AuraLoader.s_aura_defs.set(aura_type, aura_data) 
        })
      );
    });

    return Promise.all(promises);
  }
}

function isAura(aura : string) : aura is AURA_TYPE {
  return AURAS.includes(aura as AURA_TYPE);
}
