import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { BoardController } from "../board/BoardController";
import { Vector2 } from "../../engine/types";
import { EventManager } from "../../engine/listener/event";
import { ITile } from "../board/Tile";

interface ITileEventData {
  pos : Vector2,
  tile : ITile,
}

export interface ITilePointerEvents {
  TILE_HOVER : ITileEventData,
  TILE_DOWN : ITileEventData,
  TILE_UP : ITileEventData,
}

export default class TilePointerEvents {

  constructor (private m_renderer : SceneRenderer, private m_board : BoardController, private m_events:EventManager<ITilePointerEvents>) {
    this.m_renderer.on('POINTER_MOVE', this.onPointerMove);
    this.m_renderer.on('POINTER_DOWN', this.onPointerDown);
    this.m_renderer.on('POINTER_UP', this.onPointerUp);
  }

  private onPointerMove = (pos : Vector2) => {
    const tile = this.m_board.getTile(pos);
    this.m_events.emit("TILE_HOVER", { pos, tile }); 
  }

  private onPointerDown = (pos : Vector2) => {
    const tile = this.m_board.getTile(pos);
    this.m_events.emit("TILE_DOWN", { pos, tile }); 
  }

  private onPointerUp = (pos : Vector2) => {
    const tile = this.m_board.getTile(pos);
    this.m_events.emit("TILE_UP", { pos, tile }); 
  }

  public destroy() {
    this.m_renderer.off('POINTER_MOVE', this.onPointerMove);
    this.m_renderer.off('POINTER_DOWN', this.onPointerDown);
    this.m_renderer.off('POINTER_UP', this.onPointerUp);
  }
}