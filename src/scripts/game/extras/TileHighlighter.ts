import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { ChessBoard } from "../board/GameBoard";
import { Entity } from "../../engine/scene/Entity";


export default class TileHighlighter {

  private m_last_pos : {x : number, y : number};
  private m_current_pos : {x : number, y : number};

  constructor (private m_renderer : SceneRenderer, private m_board : ChessBoard) {
    this.m_renderer.on('POINTER_MOVE', this.onPointerMove);
  }

  public onPointerMove = (data : { x : number, y : number} ) => {
    this.m_current_pos = {
      x : data.x,
      y : data.y,
    }
  }

  public update = () => {
    let targets = this.m_board.getElementsAt(this.m_last_pos)
    if (targets.length > 0) {
      targets.forEach((entity:Entity) => {
        this.m_renderer.getRenderable(entity.id).offsetY = 0;
      })
    }        
    targets = this.m_board.getElementsAt(this.m_current_pos)
    if (targets.length > 0) {
      targets.forEach((entity:Entity) => {
        this.m_renderer.getRenderable(entity.id).offsetY = -2;
      })
    }
    this.m_last_pos = this.m_current_pos;
  }
}