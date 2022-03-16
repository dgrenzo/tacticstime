import * as PIXI from 'pixi.js';
import { SceneRenderer } from '../../../engine/render/scene/SceneRenderer';
import { GameBoard } from '../../board/GameBoard';


export class HealthBar {
  private m_container : PIXI.Container;

  constructor (unit_id : number, board : GameBoard, renderer : SceneRenderer) {

    // this.m_container = new PIXI.Container();

    // this.m_container.addChild(new PIXI.Graphics().beginFill(0x333333).drawRect(4, 4, 12, 4).endFill());
    // this.m_container.addChild(new PIXI.Graphics().beginFill(0x291f2e).drawRect(5, 5, 10, 2).endFill());

    // let hp = new PIXI.Graphics().beginFill(0x00CC00).drawRect(5, 5, 10, 2).endFill();
    // this.m_container.addChild(hp);


    // let unit = controller.getUnit(unit_id);
    // let screen_pos = renderer.getScreenPosition(unit.pos);
    // this.m_container.position.set(screen_pos.x - 1, screen_pos.y - 10);
    // this.m_container.visible = false;
    // controller.on("MOVE", (action : IMoveAction) => {
    //   const data = action.data;
    //   if (data.entity_id === unit_id) {
    //     let screen_pos = renderer.getScreenPosition(data.move.to);
    //     this.m_container.position.set(screen_pos.x - 1, screen_pos.y - 10);
    //   }
    // });

    // controller.on("DAMAGE_DEALT", (action : IDamageDealtAction) => {
    //   const data = action.data;
    //   if (data.entity_id === unit_id) {
    //     this.m_container.visible = true;
    //     let unit = controller.getUnit(unit_id);
    //     let bar_width = Math.floor( unit.status.hp / unit.stats.hp * 10 );

    //     let color = 0x00CC00;
    //     if (bar_width <= 3) {
    //       color = 0xCC0000;
    //     } else if (bar_width <= 6) {
    //       color = 0xCCCC00;
    //     }

    //     hp.clear().beginFill(color).drawRect(5, 5, bar_width, 2).endFill();
    //   }
    // })
    // controller.on("UNIT_KILLED", (action : IDamageAction) => {
    //   if (action.data.entity_id === unit_id) {
    //     this.m_container.visible = false;
    //   }
    // })
  }

  public get sprite() : PIXI.Container {
    return this.m_container;
  }
}