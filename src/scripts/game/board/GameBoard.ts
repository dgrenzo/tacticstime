import * as _ from 'lodash';
import { List, updateIn} from 'immutable';
import { ITile, TILE_DEF, isTile } from './Tile';
import { Scene } from '../../engine/scene/Scene';
import { IEntity } from '../../engine/scene/Entity';
import { IUnit, isUnit } from './Unit';
import { ILoadedTeam, IMissionUnit } from './Loader';
import { IRangeDef } from '../play/action/abilities';
import { ActionStack } from '../play/action/ActionStack';
import { IUnitDef } from '../assets/UnitLoader';

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

  constructor() {
    super();
  }

  public init (board_config : IBoardConfig) {
    _.forEach(board_config.layout.tiles, (tile, index) => {
      let pos : IBoardPos = {
        x : index % board_config.layout.width,
        y : Math.floor(index / board_config.layout.width)
      }
      this.addTile(pos, tile);
    });
  }

  private addTile = (pos : IBoardPos, def : TILE_DEF) => {
    this.addElement(CreateTile(pos, def));
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

export function CreateEntity() : IEntity {
  return {
    id : _ID ++,
    entity_type : "ENTITY",
    pos : {
      x : 0,
      y : 0,
    }
  }
}
export function CreateEffect() : IEntity {
  return {
    id : _ID ++,
    entity_type : "EFFECT",
    pos : {
      x : 0,
      y : 0,
    }
  }
}

export function CreateUnit(def : IUnitDef, faction ?: string) : IUnit {
  return {
    id : _ID ++,
    entity_type : "UNIT",
    pos : {
      x : -1,
      y : -1,
    },
    data : {
      unit_type : def.display.sprite,
      faction,
    },
    stats : _.cloneDeep(def.stats),
    status : {
      mana : 0,
      hp : def.stats.hp,
    },
    abilities : _.cloneDeep(def.abilities),
  }
}

function CreateTile(pos : IBoardPos, type : TILE_DEF) : ITile {
  return {
    id : _ID ++,
    entity_type : "TILE",
    pos : pos,
    data : {
      tile_type : type,
    }
  }
}