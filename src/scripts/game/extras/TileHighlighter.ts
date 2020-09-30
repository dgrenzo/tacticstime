import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { GameBoard } from "../board/GameBoard";
import { IEntity } from "../../engine/scene/Entity";
import { BoardController } from "../board/BoardController";
import { Vector2 } from "../../engine/types";


export default class TileHighlighter {

  private m_last_pos : Vector2;
  private m_current_pos : Vector2;

  constructor (private m_renderer : SceneRenderer, private m_board : BoardController) {
    this.m_renderer.on('POINTER_MOVE', this.onPointerMove);
  }

  public onPointerMove = (data : Vector2) => {
    this.m_current_pos = {
      x : data.x,
      y : data.y,
    }
  }

  public update = () => {
    let targets = this.m_board.getElementsAt(this.m_last_pos)
      targets.forEach((entity:IEntity) => {
        // this.m_renderer.getRenderable(entity.id).offsetY = 0;
      })
        
    targets = this.m_board.getElementsAt(this.m_current_pos)
      targets.forEach((entity:IEntity) => {
        // this.m_renderer.getRenderable(entity.id).offsetY = -2;
      })
    this.m_last_pos = this.m_current_pos;
  }
}