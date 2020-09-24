import * as PIXI from 'pixi.js';

import { TilePalette } from "./interface/tile_palette";
import { TILE_DEF, GetTileName } from "../board/Tile";
import { GameBoard, IBoardPos } from "../board/GameBoard";
import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import AssetManager from '../assets/AssetManager';

export class BoardEditor {

  public m_container : PIXI.Container = new PIXI.Container;

  private m_palette : TilePalette;

  constructor (private m_board : GameBoard, private m_renderer : SceneRenderer) {
    let m_palette = new TilePalette();

    let painting : boolean = false;
    
    let paintTile = (pos : IBoardPos, type : TILE_DEF) => {
      let tile = this.m_board.getTileAtPos(pos);
      if (!tile) { return; }
      if (tile.data.tile_type !== type) {
        //TODO FIX
        //tile.setTileType(type);
        // this.m_renderer.getRenderable(tile.id).setSprite(AssetManager.getTile(GetTileName(tile.data.tile_type)));

        // let cfg = this.m_board.getConfig();
        // let url =  location.origin + location.pathname ;
        // history.replaceState({}, "board", url + "?board=" + atob(cfg));
      }
    }

    this.m_renderer.on("POINTER_DOWN", (data) => {
      painting = true;
      paintTile(data, m_palette.brush);
    })
    this.m_renderer.on("POINTER_MOVE", (data) => {
      if (painting) {
        paintTile(data, m_palette.brush);
      }
    })
    this.m_renderer.on("POINTER_UP", (data) => {
      painting = false;
    })


    this.m_container.addChild(m_palette.container);
  }
}