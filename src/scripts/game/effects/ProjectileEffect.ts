import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { IAbilityActionData } from "../play/action/executors/action/Ability";
import { GameEffect } from "./GameEffect";
import * as TWEEN from '@tweenjs/tween.js'
import { fromPairs } from "lodash";

export type ProjectileEvent = "COMPLETE";

export class ProjectileEffect extends GameEffect {

  constructor (renderer : SceneRenderer, private m_data : IAbilityActionData, onComplete : ()=>void) {
    super(renderer);

    this.m_renderable.renderAsset({
      type : "EFFECT",
      name : "PROJECTILE_ARROW",
      data : m_data,
      depth_offset : 0,
    });

    let _from = {
      x : m_data.source.pos.x,
      y : m_data.source.pos.y,
    }

    let _to = {
      x : m_data.target.pos.x,
      y : m_data.target.pos.y,
    }

    let _screen_from = this.m_renderer.getScreenPosition(_from);
    let _screen_to = this.m_renderer.getScreenPosition(_to);


    this.m_renderable.sprite.rotation =  Math.atan2(_screen_to.y - _screen_from.y, _screen_to.x - _screen_from.x)

    let distance = Math.sqrt(Math.pow(_to.x - _from.x, 2) + Math.pow(_to.y - _from.y, 2));
    let time = distance * 50;

    let _tween_obj = {
      x : _from.x,
      y : _from.y,
    }

    renderer.positionElement(this.m_renderable, _from);

    TWEEN.add(new TWEEN.Tween(_tween_obj)
      .to(_to, time)
      .onUpdate(() => {
        this.setPosition(_tween_obj);
      })
      .onComplete(() => {
        this.m_renderer.removeEntity(this.m_renderable.id);
        onComplete();
      })
      .start()
    );

  }
}