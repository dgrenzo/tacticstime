import { RenderEntity } from "../../engine/render/scene/RenderEntity";
import { getAsset, SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { BoardController } from "../board/BoardController";
import { GameBoard } from "../board/GameBoard";
import EffectsManager from "../effects";
import { GameEffect } from "../effects/damage";
import { IActionData, IGameAction } from "../play/action/ActionStack";
import { IAbilityActionData } from "../play/action/executors/action/Ability";
import { ICreateUnitActionData } from "../play/action/executors/action/CreateUnit";
import { IMoveActionData } from "../play/action/executors/action/Movement";

export class BoardAnimator {

  private m_render_elements : Map<number, RenderEntity> = new Map();
  
  constructor(protected m_renderer : SceneRenderer, protected m_board_controller : BoardController) {
    this.m_board_controller.on("CREATE_UNIT", (data : ICreateUnitActionData) => {
      let renderable = this.m_renderer.addEntity(data.unit);
      renderable.renderAsset(getAsset(data.unit));
      this.setRenderElement(data.unit.id, renderable);
    });

    this.m_board_controller.on("UNIT_KILLED", (data : IActionData) => {
      let renderable = this.m_render_elements.get(data.entity_id);
      this.m_renderer.removeEntity(renderable.id);
    });
    
    this.m_board_controller.on("MOVE", (data : IMoveActionData) => {
      this.m_renderer.positionElement(this.getRenderElement(data.entity_id), data.move.to);
    });

  }

  private setRenderElement = (id : number, renderable : RenderEntity) => {
    this.m_render_elements.set(id, renderable);
  }
  private getRenderElement = (entity_id : number) : RenderEntity => {
    return this.m_render_elements.get(entity_id);
  }

  public animateGameAction(action : IGameAction, board : GameBoard) : Promise<void> {

    if (action.type === 'ABILITY') {
      return this.animateAbility(action.data as IAbilityActionData, board);
    }

    return new Promise(resolve => {
      let effect = this.createEffect(action, resolve);

      if (effect) {
        let action_target = board.getElement(action.data.entity_id);
        effect.setPosition(action_target.pos);
      } else {
        setTimeout(resolve, 100);
      }
      setTimeout(resolve, 100);
    })
  }

    
  //There should be a service that handles these animations (.sprite references shouldnt be here)
  private animateAbility(data : IAbilityActionData, board : GameBoard) : Promise<void> {
    
      if (!board.getUnitAtPosition(data.target.pos)) {
        return Promise.resolve();
      }
      if (data.ability.name === "SHOOT") {
        return this.unitBumpAnimation(data).then();
      }

      return this.unitBumpAnimation(data);
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