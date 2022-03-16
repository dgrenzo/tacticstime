import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js'
import { IDamageActionData } from '../play/action/executors/action/Damage';
import { SceneRenderer } from '../../engine/render/scene/SceneRenderer';
import { GameEffect } from './GameEffect';


export class DamageNumberEffect extends GameEffect { 
  constructor (renderer : SceneRenderer, data : IDamageActionData, onComplete ?: ()=>void) {
    super(renderer);

    console.log('damage number: ' + data.amount);
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