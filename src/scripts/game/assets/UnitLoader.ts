import * as _ from 'lodash';
import { UNIT_TYPE } from "../types/units";
import { Map } from 'immutable';
import { LoadJSON } from '../board/Loader';


let unit_list : UNIT_TYPE[] = [
  "dwarf",
  "lizard",
  "monk",
  "mooseman",
  "oldman",
  "rhino",
  "troll",
  "guard",
  "knight_green",
  "basic_bow",
  "basic_axe",
]

export interface IUnitDef {
  display : {
    sprite : string,
  },
  abilities : string[],
  stats : {
    speed : number,
    move : number,
    hp : number,
    magic : number,
  },
}

export class UnitLoader {

  private static s_unit_defs : Map<string, IUnitDef>;

  public static GetUnitDefinition = (unit_type : UNIT_TYPE) : IUnitDef => {
    return UnitLoader.s_unit_defs.get(unit_type);
  }

  public static LoadUnitDefinitions = () : Promise<void[]> => {

    UnitLoader.s_unit_defs = Map<string, IUnitDef>();
    let promises : Promise<void>[] = [];

    _.forEach(unit_list, (unit_type:UNIT_TYPE) => {
      let def_url = GetDefURL(unit_type);
      promises.push( LoadJSON<IUnitDef>(def_url)
        .then ( unit_data => { 
          UnitLoader.s_unit_defs = UnitLoader.s_unit_defs.set(unit_type, unit_data) 
        })
      );
    })

    return Promise.all(promises);
  }

}

function GetDefURL(unit_type : UNIT_TYPE) {
  return "assets/data/units/" + unit_type + ".json";
}