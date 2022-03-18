import * as _ from 'lodash';
import { Map } from 'immutable';
import { LoadJSON } from '../board/Loader';
import { IAuraDef } from '../play/action/auras/GameAura';
import { DATA_ASSET_MAP, UNITS, UNIT_TYPE } from './AssetList';



export interface IUnitDef {
  display : {
    sprite : string,
  },
  auras : IAuraDef[],
  abilities : string[],
  stats : {
    speed : number,
    move : number,
    hp : number,
    magic : number,
  },
}

export class UnitLoader {

  private static s_unit_defs : Map<UNIT_TYPE, IUnitDef>;

  public static GetUnitDefinition = (unit_type : string) : IUnitDef => {
    if (!isUnitType(unit_type)) {
      return null;
    }
    return UnitLoader.s_unit_defs.get(unit_type);
  }

  public static LoadUnitDefinitions = () : Promise<void[]> => {
    UnitLoader.s_unit_defs = Map<UNIT_TYPE, IUnitDef>();
    const promises : Promise<void>[] = [];

    Object.keys(DATA_ASSET_MAP.units).forEach((unit_type : UNIT_TYPE) => {
      const asset_path = DATA_ASSET_MAP.units[unit_type];

      promises.push( LoadJSON<IUnitDef>(asset_path)
        .then ( unit_data => { 
          UnitLoader.s_unit_defs = UnitLoader.s_unit_defs.set(unit_type, unit_data) 
        })
      );
    });

    return Promise.all(promises);
  }
}


function isUnitType(unit_name : string) : unit_name is UNIT_TYPE {
  return UNITS.includes(unit_name as UNIT_TYPE);
}