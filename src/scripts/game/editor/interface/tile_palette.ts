import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { TILE_DEF, GetTileName } from '../../board/Tile';
import AssetManager from '../../assets';

export class TilePalette {
  
  private m_container : PIXI.Container;

  private m_brushIcon : PIXI.Sprite;
  private m_activeBrush : TILE_DEF = TILE_DEF.GRASS_EMPTY;

  constructor() {
    this.m_container = new PIXI.Container();
    this.m_container.interactive = this.m_container.interactiveChildren = true;
    this.init();
    this.setBrush(TILE_DEF.GRASS_EMPTY);
  }

  public get brush() : TILE_DEF {
    return this.m_activeBrush;
  }

  public get container() : PIXI.Container {
    return this.m_container;
  }

  private init = () => {

    let brush = this.m_brushIcon = new PIXI.Sprite();
    brush.position.set(5, 30);
    brush.scale.set(2);
    this.m_container.addChild(brush);
    

    _.forEach(_.values(TILE_DEF), tile_type => {
      if (typeof tile_type === "string") {
        return;
      }
      
      let x = tile_type % 10;
      let y = Math.floor(tile_type / 10);

      let btn = new PIXI.Sprite(AssetManager.getTile(GetTileName(tile_type)));

      this.m_container.addChild(btn);

      btn.position.set(50 + x * 24, y * 24);
      btn.buttonMode = btn.interactive = true;

      btn.on('pointerdown', () => {
        this.setBrush(tile_type);
      });
    });
  }

  private setBrush = (def : TILE_DEF) => {
    this.m_activeBrush = def;
    this.m_brushIcon = AssetManager.getTile(GetTileName(def));
  }
}