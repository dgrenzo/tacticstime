import * as _ from 'lodash';
import { List, updateIn} from 'immutable';
import { ITile, TILE_DEF, isTile } from './Tile';
import { Scene } from '../../engine/scene/Scene';
import { IEntity } from '../../engine/scene/Entity';
import { IUnit, isUnit } from './Unit';
import { ILoadedTeam, IMissionUnit } from './Loader';
import { IRangeDef } from '../play/action/abilities';
import { ActionStack } from '../play/action/ActionStack';

export interface IBoardConfig {
  layout : {
    width : number,
    height : number,
    tiles : TILE_DEF[],
  }
}

export interface IBoardPos {
  x : number,
  y : number,
}

export type UpdateFunction = (keyPath:Iterable<any>, updator:(value:any) => any) => void;

export class GameBoard extends Scene {

  private m_action_stack : ActionStack;

  constructor() {
    super();
  }

  public init (board_config : IBoardConfig) {
    _.forEach(board_config.layout.tiles, (tile, index) => {
      let x : number = index % board_config.layout.width;
      let y : number = Math.floor(index / board_config.layout.width);
      this.addTile(x, y, tile);
    });
  }

  private addTile = (x : number, y : number, def : TILE_DEF) => {
    this.addElement(CreateTile(x, y, def));
  }

  public getElementsAt(pos : IBoardPos) : List<IEntity> {
    return this.m_elements.filter( entity => {
      return pos && entity.pos.x === pos.x && entity.pos.y === pos.y
     }).toList();
  }

  public getUnitAtPosition = (pos : IBoardPos) : IUnit => {
    let unit : IUnit = null;
    this.getElementsAt(pos).forEach( element => {
      if (isUnit(element)) {
        unit = element;
        return false;
      }
      return true;
    })
    return unit;
  }

  public getUnit = (id : number) : IUnit => {
    return this.m_elements.get(id) as IUnit;
  }

  public getUnits = () : List<IUnit> => {
    return this.m_elements.filter( element => {
      return isUnit(element);
    }).toList() as List<IUnit>;
  }

  public getTiles = () : List<ITile> => {
    return this.m_elements.filter( element => {
      return isTile(element);
    }).toList() as List<ITile>;
  }

  public getTilesInRange = (pos : IBoardPos, range : IRangeDef) : List<ITile> => {
    return this.getTiles().filter( tile => {
      let distance = Math.abs(tile.pos.x - pos.x) + Math.abs(tile.pos.y - pos .y);
      return range.max >= distance && range.min <= distance;
    });
  }

  public getTileAtPos = (pos : IBoardPos) : ITile => {
    let tile : ITile = null;
    this.getElementsAt(pos).forEach(element => {
      if (isTile(element)) {
        tile = element;
        return false;
      }
      return true;
    });
    return tile;
  }
}

let _ID : number = 0;

export function CreateUnit(def : IMissionUnit, faction : string = null) : IUnit {
  return {
    id : _ID ++,
    entity_type : "UNIT",
    pos : {
      x : def.pos.x,
      y : def.pos.y,
    },
    data : {
      unit_type : def.unit.display.sprite,
      faction,
    },
    stats : _.cloneDeep(def.unit.stats),
    status : {
      hp : def.unit.stats.hp,
    },
    abilities : _.cloneDeep(def.unit.abilities),
    depth_offset : 2,
  }
}

function CreateTile(x : number, y : number, type : TILE_DEF) : ITile {
  return {
    id : _ID ++,
    entity_type : "TILE",
    pos : {
      x : x,
      y : y,
    },
    data : {
      tile_type : type,
    },
    depth_offset : 0,
  }
}