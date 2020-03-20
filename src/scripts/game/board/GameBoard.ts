import * as _ from 'lodash';
import { Tile, TILE_DEF } from './Tile';
import { Scene } from '../../engine/scene/Scene';
import { Entity } from '../../engine/scene/Entity';
import { Unit } from './Unit';

export interface IBoardConfig {
  layout : {
    width : number,
    height : number,
    tiles : TILE_DEF[],
  }
  entities : Array<any>,
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

    this.addUnit(new Unit(7,10, {asset : "dwarf"}))
    this.addUnit(new Unit(8,13, {asset : "lizard"}))
    this.addUnit(new Unit(9,11, {asset : "guard"}))
    this.addUnit(new Unit(10,9, {asset : "monk"}))
    this.addUnit(new Unit(11,8, {asset : "oldman"}))
    this.addUnit(new Unit(3,6, {asset : "rhino"}))
    this.addUnit(new Unit(10,3, {asset : "wizard"}))
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