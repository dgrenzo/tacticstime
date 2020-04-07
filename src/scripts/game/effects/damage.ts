import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js'
import { IDamageActionData } from '../play/action/executors/action/Damage';
import { SceneRenderer } from '../../engine/render/scene/SceneRenderer';


export class GameEffect {
  public m_container : PIXI.Container = new PIXI.Container();
  constructor() {
  }

  public update = (deltaTime:number) => {

  }
}
export class DamageNumberEffect extends GameEffect { 
  constructor (data : IDamageActionData, onComplete ?: ()=>void) {
    super();

    let effect = new PIXI.Container();
    effect.position.set(9, 2);

    let text = new PIXI.Text(data.amount + '', 
    { 
      fill : 0xFFFFCC, 
      size : 24,
      stroke : 0x000000,
      strokeThickness : 4,
      fontWeight : 'bolder',
    });
    text.scale.set (0.05);
    text.anchor.set(0.5);

    this.m_container.addChild(effect);
    effect.addChild(text);
    TWEEN.add(new TWEEN.Tween(text.scale).to({x : 0.55, y : 0.55}, 145).easing(TWEEN.Easing.Back.Out).onComplete(onComplete).start());
    TWEEN.add(new TWEEN.Tween(text).to({alpha : 0, y : - 6}, 400).delay(100).start());
  }
}