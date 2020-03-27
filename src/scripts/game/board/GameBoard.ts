import * as _ from 'lodash';
import { Tile, TILE_DEF } from './Tile';
import { Scene } from '../../engine/scene/Scene';
import { Entity } from '../../engine/scene/Entity';
import { Unit } from './Unit';
import { ILoadedTeam } from './Loader';
import { UNIT_TYPE } from '../assets/units';
import { IRangeDef } from '../play/action/abilities';

export interface IBoardConfig {
  layout : {
    width : number,
    height : number,
    tiles : TILE_DEF[],
  }
}

export interface ITilePos {
  x : number,
  y : number,
}

export class GameBoard extends Scene {

  private width : number;
  private height : number;

  private m_tiles : Tile[][];

  constructor() {
    super();
  }

  public init (board_config : IBoardConfig) {
    this.m_elements = [];

    this.width = board_config.layout.width;
    this.height = board_config.layout.height;

    this.m_tiles = [];
    for(let i = 0; i < this.height; i ++) {
      this.m_tiles.push([]);
    }

    _.forEach(board_config.layout.tiles, (tile, index) => {
      let x : number = index % board_config.layout.width;
      let y : number = Math.floor(index / board_config.layout.width);
      this.addTile(x, y, tile);
    });
  }

  public initTeams = (teams : ILoadedTeam[]) => {
    _.forEach(teams, team => {
      _.forEach(team.units, data => {
        let x = data.pos.x;
        let y = data.pos.y;
        this.addUnit(new Unit(x, y, data.unit));
      })
    });
  }

  private addUnit = (unit : Unit) => {
    this.addElement(unit);
  }

  private addTile = (x : number, y : number, def : TILE_DEF) => {
    this.m_tiles[x][y] = this.addElement(new Tile(x, y, def));
  }

  public getElementsAt(pos : ITilePos) : Entity[] {
    if (!pos) {
      return []
    }
    let elements : Entity[] = [];
    this.m_elements.forEach( (ent) => {
      if (ent.x === pos.x && ent.y === pos.y) {
        elements.push(ent);
      }
    });
    return elements;
  }

  public getUnit = (pos : ITilePos) : Unit => {
    let unit = null;
    _.forEach(this.getElementsAt(pos), element => {
      if (element instanceof Unit) {
        unit = element;
        return false;
      }
      return true;
    })
    return unit;
  }

  public getTilesInRange = (pos : ITilePos, range : IRangeDef) : Tile[] => {
    let tiles : Tile[] = [];
      //TODO filter options with target_def.target_type

    for (let offset_x = -range.max; offset_x <= range.max; offset_x ++) {
      let max_y = range.max - Math.abs(offset_x);
      for (let offset_y = -max_y; offset_y <= max_y; offset_y ++) {
        if (Math.abs(offset_x) + Math.abs(offset_y) < range.min) {
          continue;
        }
        let tile = this.getTile({x : pos.x + offset_x, y : pos.y + offset_y});
        if (tile) {
          tiles.push(tile)
        }
      }
    }
    return tiles;
  }

  
  public getTile = (pos : ITilePos) : Tile => {
    if (!this.m_tiles[pos.x] || !this.m_tiles[pos.x][pos.y]) {
      return null;
    }
    return this.m_tiles[pos.x][pos.y];
  }

  private tileExists = (pos) : boolean => {
    return this.getTile(pos) !== null;
  }

  public getConfig = () => {
    let cfg = [];
    cfg.push(String.fromCharCode(this.width));
    cfg.push(String.fromCharCode(this.height));

    for (let y = 0; y < this.height; y ++) {
      for (let x = 0; x < this.width; x ++) {
        let type : number = this.getTile({x : x, y : y}).type;
        cfg.push(String.fromCharCode(type))
      }
    }
    return cfg.join('');
  }
}