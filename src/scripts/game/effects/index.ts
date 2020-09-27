import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js'
import { IAbilityAction } from '../play/action/executors/action/Ability';
import { RenderEntity } from '../../engine/render/scene/RenderEntity';
import { IGameAction } from '../play/action/ActionStack';
import { DamageNumberEffect, GameEffect } from './damage';
import { IDamageActionData } from '../play/action/executors/action/Damage';
import { SceneRenderer } from '../../engine/render/scene/SceneRenderer';

export default class EffectsManager {
  static s_renderer : SceneRenderer;
  public static init (renderer : SceneRenderer) {

    EffectsManager.s_renderer = renderer;

    renderer.pixi.ticker.add(() => {
      TWEEN.update()
    });
  }

  public static RenderEffect(action : IGameAction, onComplete : ()=>void) : GameEffect {
    let effect : GameEffect = null;
    switch (action.type) {
      case "DAMAGE_DEALT" :
        effect = new DamageNumberEffect(EffectsManager.s_renderer, action.data as IDamageActionData, onComplete);
    }

    if (effect) {
      //EffectsManager.s_renderer.effects_container.addChild(effect.m_container);
    }
    return effect;
  }
}