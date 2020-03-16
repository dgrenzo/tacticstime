import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { EventManager } from '../../engine/listener/event';
import { TILE_DEF, GetTileName } from '../board/Tile';
import AssetManager from '../assets';

type PALETTE_EVENT = "TILE_SELECTED" | "BASE_SELECTED" | "TYPE_SELECTED"

export class TilePalette {
  
  private m_container : PIXI.Container;

  private m_btns : PIXI.Sprite[];
  private m_eventManager : EventManager<PALETTE_EVENT>;

  constructor() {
    this.m_eventManager = new EventManager();
    this.m_container = new PIXI.Container();
    this.m_container.interactive = this.m_container.interactiveChildren = true;
    this.init();
  }


  public get container() : PIXI.Container {
    return this.m_container;
  }

  public on = (event : "TILE_SELECTED", cb : (data : { def:TILE_DEF } )=>void ) : void => {
    this.m_eventManager.add(event, cb);
  }

  private init = () => {

    let brush_icon = new PIXI.Sprite();
    brush_icon.texture = AssetManager.getTile(GetTileName(TILE_DEF.GRASS_EMPTY));
    brush_icon.position.set(5, 30);
    brush_icon.scale.set(2);
    this.m_container.addChild(brush_icon);
    

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
        this.m_eventManager.emit("TILE_SELECTED", { def : tile_type });
        brush_icon.texture = AssetManager.getTile(GetTileName(tile_type));
      });
    });
  }
}