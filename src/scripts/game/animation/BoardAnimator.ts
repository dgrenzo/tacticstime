import { LinkedList } from "../../engine/list/linkedlist";
import { RenderEntity } from "../../engine/render/scene/RenderEntity";
import { getAsset, SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { IImmutableScene } from "../../engine/scene/Scene";
import { GameBoard, IActionResult, IGameAction, IGameEvent } from "../board/GameBoard";
import EffectsManager from "../effects/EffectsManager";
import { GameEffect } from "../effects/GameEffect";
import { IAbilityAction, IAbilityActionData } from "../play/action/executors/action/Ability";

const ANIMATABLE_ACTIONS : (keyof IGameEvent)[] = [
  "ABILITY",
  "DAMAGE_DEALT",
  "CREATE_UNIT",
  "MOVE",
  "UNIT_KILLED"
];

export class BoardAnimator {

  private m_render_elements : Map<number, RenderEntity> = new Map();
  private m_action_list : LinkedList<IActionResult> = new LinkedList();

  private m_busy_promise : Promise<void> = null;
  private m_busy_promise_resolver : Function = null;
  
  constructor(protected m_renderer : SceneRenderer, private m_board : GameBoard) {
    ANIMATABLE_ACTIONS.forEach(event => {
      this.m_board.on(event, this.onAnimatableAction);
    });
  }

  private setRenderElement = (id : number, renderable : RenderEntity) => {
    this.m_render_elements.set(id, renderable);
  }

  private getRenderElement = (entity_id : number) : RenderEntity => {
    return this.m_render_elements.get(entity_id);
  }

  private onAnimatableAction = (action_result : IActionResult) => {
    this.m_action_list.push(action_result);
  }

  public hasQueuedAnimations() {
    return !this.m_action_list.isEmpty();
  }

  public start = () => {
    if (!this.m_busy_promise) {
      this.m_busy_promise = new Promise(resolve => {
        this.m_busy_promise_resolver = resolve;
      });
      this.execute();
    }
    return this.m_busy_promise;
  }

  private execute = async () : Promise<void> => {
    let next_action = this.m_action_list.shift();

    while (next_action) {
      console.log('animating');
      console.log(next_action);
      await this.animateGameAction(next_action.action, next_action.scene);
      next_action = this.m_action_list.shift();
    }

    this.m_busy_promise_resolver();
    this.m_busy_promise = null;
  }

  public async animateGameAction(action : IGameAction, scene : IImmutableScene) : Promise<void> {
    const elements = GameBoard.GetElements(scene);
    const data = action.data;
    let renderable : RenderEntity;
    switch (action.type) {
      case "CREATE_UNIT" : 
        
        renderable = this.m_renderer.addEntity(data.unit);
        renderable.renderAsset(getAsset(data.unit));
        this.setRenderElement(data.unit.id, renderable);
        break;
      
      case "UNIT_KILLED" : 

        renderable = this.m_render_elements.get(data.entity_id);
        this.m_renderer.removeEntity(renderable.id);
        break;
      
      case "MOVE" :

        await new Promise(resolve => setTimeout(resolve, 100));
        renderable = this.getRenderElement(data.entity_id);
        this.m_renderer.positionElement(renderable, data.move.to);
        break;
      
      case "ABILITY" :
        
        return this.animateAbility(action as IAbilityAction, scene);

      default :

        return new Promise(resolve => {
          let effect = this.createEffect(action, resolve);
    
          if (effect) {
            let action_target = elements.get(action.data.entity_id);
            effect.setPosition(action_target.pos);
          }
          setTimeout(resolve, 100);
        })
        
        break;
    }
    
  }

    
  //There should be a service that handles these animations (.sprite references shouldnt be here)
  private animateAbility(action : IAbilityAction, scene : IImmutableScene) : Promise<void> {
    
      if (action.data.ability.name === 'Wait' || !GameBoard.GetUnitAtPosition(scene, action.data.target.pos)) {
        return Promise.resolve();
      }
      if (action.data.ability.name === "Shoot") {
        return this.unitBumpAnimation(action.data as IAbilityActionData)
        .then(() => {
          return new Promise(resolve => {
            this.createEffect(action, resolve);
          });
        });
      }

      return this.unitBumpAnimation(action.data as IAbilityActionData);
    }

  private unitBumpAnimation(data : IAbilityActionData) : Promise<void> {
    return new Promise(resolve => {
      let renderable = this.getRenderElement(data.source.id);
      let sprite = renderable.sprite;

      let dir = {
        x : data.target.pos.x - data.source.pos.x,
        y : data.target.pos.y - data.source.pos.y,
      };

      let anim_dir = this.m_renderer.getProjection(dir);
      anim_dir.x = Math.min(Math.max(-1, anim_dir.x), 1);
      anim_dir.y = Math.min(Math.max(-1, anim_dir.y), 1);

      sprite.position.x = -anim_dir.x;
      sprite.position.y = -anim_dir.y
      setTimeout(() => {
        sprite.position.x = anim_dir.x * 3;
        sprite.position.y = anim_dir.y * 3;
        setTimeout(() => {
          sprite.position.set(0,0);
        }, 150)
        resolve()
      }, 250);
    });
  }
  
  public createEffect = (ability : IGameAction, cb : ()=>void) : GameEffect => {
    return EffectsManager.RenderEffect(ability, cb);
  }  
}