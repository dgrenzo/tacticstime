import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js'
import { IAbilityActionData } from '../play/action/executors/action/Ability';


export class GameEffect {
  public m_container : PIXI.Container = new PIXI.Container();
  constructor() {
  }

  public update = (deltaTime:number) => {

  }
}
export class DamageNumberEffect extends GameEffect { 
  constructor (data : IAbilityActionData, onComplete ?: ()=>void) {
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
    text.scale.set (0.00);
    text.anchor.set(0.5);

    this.m_container.addChild(effect);
    effect.addChild(text);
    TWEEN.add(new TWEEN.Tween(text.scale)
      .to({x : 0.65, y : 0.55}, 150)
      .easing(TWEEN.Easing.Back.Out)
      .onComplete(() => {
        text.scale.set(0.4)
        onComplete();
      })
      .start()
    );
    TWEEN.add(new TWEEN.Tween(text).to({alpha : 0, y : - 6}, 400).delay(100).start());
  }
}