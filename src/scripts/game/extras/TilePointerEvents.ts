import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { Vector2 } from "../../engine/types";
import { EventManager } from "../../engine/listener/event";
import { ITile } from "../board/Tile";
import { GameBoard } from "../board/GameBoard";

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

  constructor (private m_renderer : SceneRenderer, private m_board : GameBoard, private m_events:EventManager<ITilePointerEvents>) {
    this.m_renderer.on('POINTER_MOVE', this.onPointerMove);
    this.m_renderer.on('POINTER_DOWN', this.onPointerDown);
    this.m_renderer.on('POINTER_UP', this.onPointerUp);
  }
  //TODO: these events should include the scene so that they don't rely on the current view
  private onPointerMove = (pos : Vector2) => {
    const tile = GameBoard.GetTileAtPosiiton(this.m_board.scene, pos)
    this.m_events.emit("TILE_HOVER", { pos, tile }); 
  }

  private onPointerDown = (pos : Vector2) => {
    const tile = GameBoard.GetTileAtPosiiton(this.m_board.scene, pos)
    this.m_events.emit("TILE_DOWN", { pos, tile }); 
  }

  private onPointerUp = (pos : Vector2) => {
    const tile = GameBoard.GetTileAtPosiiton(this.m_board.scene, pos)
    this.m_events.emit("TILE_UP", { pos, tile }); 
  }

  public destroy() {
    this.m_renderer.off('POINTER_MOVE', this.onPointerMove);
    this.m_renderer.off('POINTER_DOWN', this.onPointerDown);
    this.m_renderer.off('POINTER_UP', this.onPointerUp);
  }
}