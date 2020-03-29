import * as PIXI from 'pixi.js';
import { IAbilityAction } from '../play/action/executors/action/Ability';
import { Effect } from '../board/Effect';
import { RenderEntity } from '../../engine/render/scene/RenderEntity';

export default class EffectsManager {

  public static RenderEffect(elements : {entity : Effect, renderer : RenderEntity}, onComplete : () => void) {

    //let effect = new EffectContainer(ability, onComplete);
    let container = new PIXI.Container();
    let meteor = new PIXI.Graphics().beginFill(0x333399).drawRect(-4, -4, 8, 8).endFill();
    meteor.y = -40;
    container.addChild(meteor);
    container.position.set(8, 6);

    elements.renderer.sprite.addChild(container);

    let start_time = Date.now();
    let time = start_time;
    let end_time = start_time + 90;


    let update = (deltaTime : number) => {
      time += deltaTime;

      let k = 1.0 - (end_time - time) / 90;
      k = Math.max(0, k*k);
      meteor.y = Math.round(-10 * (1.0-k)) * 4;

      if (time >= end_time) {
        PIXI.Ticker.shared.remove(update);
        meteor.scale.set(2);
        setTimeout(onComplete, 25);
      }
    }
    PIXI.Ticker.shared.add(update);
    //return effect;
  }
}

export class EffectContainer extends PIXI.Container {
  private m_block = new PIXI.Graphics();

  constructor() {
    super();
    
    this.m_block.beginFill(0x333399).drawRect(-2, -2, 4, 4).endFill();
    this.addChild(this.m_block);

    this.m_block.position.y = -100;


  }

  public update = (deltaTime:number) => {

  }
}