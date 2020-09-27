import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js'
import { IDamageActionData } from '../play/action/executors/action/Damage';
import { SceneRenderer } from '../../engine/render/scene/SceneRenderer';
import { RenderEntity } from '../../engine/render/scene/RenderEntity';
import { IEntity } from '../../engine/scene/Entity';


export class GameEffect implements IEntity {
  protected m_renderable : RenderEntity;
  protected m_pos : {x : number, y : number} = {
    x : 0,
    y : 0,
  };



  constructor(protected m_renderer : SceneRenderer) {
    this.m_pos  

    this.m_renderable = m_renderer.addEntity(this);
  }
  
  public setPosition = (pos : {x : number, y : number}) => {
    this.m_pos.x = pos.x + 0.5;
    this.m_pos.y = pos.y - 0.5;
    this.m_renderer.positionElement(this.m_renderable, this.m_pos);
  }

  public get pos() : {x : number , y : number} {
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

export class DamageNumberEffect extends GameEffect { 
  constructor (renderer : SceneRenderer, data : IDamageActionData, onComplete ?: ()=>void) {
    super(renderer);

    this.m_renderable.renderAsset({
      type : "EFFECT",
      name : "DAMAGE_DEALT",
      data : data,
      depth_offset : 100,
    });

    


    TWEEN.add(new TWEEN.Tween(this.m_renderable.sprite.scale)
      .to({x : 0.65, y : 0.55}, 150)
      .easing(TWEEN.Easing.Back.Out)
      .onComplete(() => {
        this.m_renderable.sprite.scale.set(0.4)
        onComplete();
      })
      .start()
    );
    TWEEN.add(new TWEEN.Tween(this.m_renderable.sprite)
      .to({alpha : 0, y : - 6}, 400)
      .delay(100)
      .onComplete( () => {
        this.m_renderer.removeEntity(this.m_renderable.id);
      })
      .start());
  }
}