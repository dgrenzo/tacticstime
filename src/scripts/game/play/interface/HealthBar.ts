import * as PIXI from 'pixi.js';

import { RenderEntity } from "../../../engine/render/scene/RenderEntity";
import { BoardController } from "../../board/BoardController";
import { IMoveActionData } from "../action/executors/action/Movement";
import { IUnit } from "../../board/Unit";
import { SceneRenderer } from "../../../engine/render/scene/SceneRenderer";
import { IDamageActionData } from '../action/executors/action/Damage';

export class HealthBar {
  private m_container : PIXI.Container;

  constructor (unit_id : number, controller : BoardController, renderer : SceneRenderer) {

    this.m_container = new PIXI.Container();

    this.m_container.addChild(new PIXI.Graphics().beginFill(0x333333).drawRect(4, 4, 12, 4).endFill());
    this.m_container.addChild(new PIXI.Graphics().beginFill(0x000000).drawRect(5, 5, 10, 2).endFill());

    let hp = new PIXI.Graphics().beginFill(0x00CC00).drawRect(5, 5, 10, 2).endFill();
    this.m_container.addChild(hp);


    let unit = controller.getUnit(unit_id);
    let screen_pos = renderer.getScreenPosition(unit.pos.x, unit.pos.y);
    this.m_container.position.set(screen_pos.x - 1, screen_pos.y - 10);

    controller.on("MOVE", (data : IMoveActionData) => {
      if (data.entity_id === unit_id) {
        let screen_pos = renderer.getScreenPosition(data.move.to.x, data.move.to.y);
        this.m_container.position.set(screen_pos.x - 1, screen_pos.y - 10);
      }
    });

    controller.on("DAMAGE_DEALT", (data : IDamageActionData) => {
      if (data.entity_id === unit_id) {
        let unit = controller.getUnit(unit_id);
        let bar_width = Math.floor( unit.status.hp / unit.stats.hp * 10 );

        let color = 0x00CC00;
        if (bar_width <= 3) {
          color = 0xCC0000;
        } else if (bar_width <= 6) {
          color = 0xCCCC00;
        }

        hp.clear().beginFill(color).drawRect(5, 5, bar_width, 2).endFill();
      }
    })
    controller.on("UNIT_KILLED", (data : IDamageActionData) => {
      if (data.entity_id === unit_id) {
        this.m_container.visible = false;
      }
    })
  }

  public get sprite() : PIXI.Container {
    return this.m_container;
  }
}