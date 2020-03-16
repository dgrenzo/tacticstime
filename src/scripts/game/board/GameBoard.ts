import * as _ from 'lodash';
import {FACTION} from '../../types'
import { Tile, TILE_DEF } from './Tile';
import { Scene } from '../../engine/scene/Scene';
import { Entity } from '../../engine/scene/Entity';

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

export class ChessBoard extends Scene {

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
    })
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

  
  public getTileAt = (pos : ITilePos) : Tile => {
    if (!this.m_tiles[pos.x] || !this.m_tiles[pos.x][pos.y]) {
      return null;
    }
    return this.m_tiles[pos.x][pos.y];
  }

  private tileExists = (pos) : boolean => {
    return this.getTileAt(pos) !== null;
  }

  public getConfig = () => {
    let cfg = [];
    cfg.push(this.width);
    cfg.push(this.height);

    for (let y = 0; y < this.height; y ++) {
      for (let x = 0; x < this.width; x ++) {
        cfg.push(this.getTileAt({x : x, y : y}).type)
      }
    }
    return cfg;
  }

}