import { RenderEntity } from '../../engine/render/scene/RenderEntity';
import { SceneRenderer } from '../../engine/render/scene/SceneRenderer';
import { IEntity } from '../../engine/scene/Entity';
import { Vector2 } from '../../engine/types';


export class GameEffect implements IEntity {
  protected m_renderable : RenderEntity;
  protected m_pos : Vector2 = {
    x : 0,
    y : 0,
  };
  constructor(protected m_renderer : SceneRenderer) {
    this.m_renderable = m_renderer.addEntity(this);
  }
  
  public setPosition = (pos : Vector2) => {
    this.m_pos.x = pos.x + 0.55;
    this.m_pos.y = pos.y - 0.55;
    this.m_renderer.positionElement(this.m_renderable, this.m_pos);
  }

  public get pos() : Vector2 {
    return {
      x : this.m_pos.x,
      y : this.m_pos.y,
    }
  }

  public get entity_type() : string {
    return "EFFECT";
  }

  public update = (deltaTime:number) => {

  }

  public destroy() {

  }
}
