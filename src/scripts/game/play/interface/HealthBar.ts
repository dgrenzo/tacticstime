import * as PIXI from 'pixi.js';
import { SceneRenderer } from '../../../engine/render/scene/SceneRenderer';
import { BoardAnimator } from '../../animation/BoardAnimator';
import { GameBoard, IActionResult, IBoardPos, IGameAction } from '../../board/GameBoard';
import { IDamageDealtAction } from '../action/executors/action/Damage';
import { IMoveAction } from '../action/executors/action/Movement';


export class HealthBar {
  private m_container : PIXI.Container;
  private m_hp_graphic : PIXI.Graphics;

  constructor (private m_unit_id : number, animator : BoardAnimator, private m_renderer : SceneRenderer) {

    this.m_container = new PIXI.Container();

    this.m_container.addChild(new PIXI.Graphics().beginFill(0x333333).drawRect(4, 4, 12, 4).endFill());
    this.m_container.addChild(new PIXI.Graphics().beginFill(0x291f2e).drawRect(5, 5, 10, 2).endFill());

    this.m_hp_graphic = new PIXI.Graphics();
    this.m_hp_graphic.beginFill(0x00CC00).drawRect(5, 5, 10, 2).endFill();
    this.m_container.addChild(this.m_hp_graphic);

    this.m_container.visible = false;

    const events = animator.events;

    events.on("MOVE", this.onMoveAction, this);
    events.on("DAMAGE_DEALT", this.onDamageDealtAction, this);
    events.on("UNIT_KILLED", this.onUnitKilledAction, this);
  }

  updatePosition(pos : IBoardPos, renderer : SceneRenderer) {
    let screen_pos = renderer.getScreenPosition(pos);
    this.m_container.position.set(screen_pos.x - 1, screen_pos.y - 10);
  }

  onDamageDealtAction(result : IActionResult<IDamageDealtAction>) {
    const unit_id = this.m_unit_id;
    const container = this.m_container;
    const hp_graphic = this.m_hp_graphic;
    const data = result.action.data;

    if (data.entity_id === unit_id) {
      container.visible = true;
      const unit = GameBoard.GetUnit(result.scene, unit_id);
      const bar_width = Math.floor( unit.status.hp / unit.stats.hp * 10 );

      let color = 0x00CC00;
      if (bar_width <= 3) {
        color = 0xCC0000;
      } else if (bar_width <= 6) {
        color = 0xCCCC00;
      }

      hp_graphic.clear().beginFill(color).drawRect(5, 5, bar_width, 2).endFill();

      this.updatePosition(unit.pos, this.m_renderer);
    }
  }

  onMoveAction(result : IActionResult<IMoveAction>) {
    const unit_id = this.m_unit_id;

    if (result.action.data.entity_id === unit_id) {

      const renderer = this.m_renderer;
      const unit = GameBoard.GetUnit(result.scene, unit_id);

      this.updatePosition(unit.pos, renderer)
    }
  }

  onUnitKilledAction(result : IActionResult<IGameAction>) {
    const unit_id = this.m_unit_id;
    const container = this.m_container;

    const data = result.action.data;
    if (data.entity_id === unit_id) {
      container.visible = false;
    }
  }

  public get sprite() : PIXI.Container {
    return this.m_container;
  }
}