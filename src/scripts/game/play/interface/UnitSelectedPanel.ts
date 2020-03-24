import * as _ from 'lodash';
import * as PIXI from 'pixi.js';

import { GameController } from "../../GameController";
import { IAbilityInfo } from "../Ability";
import { Unit } from '../../board/Unit';
import { EventManager } from '../../../engine/listener/event';

type SELECTION_PANEL_EVENT = "ABILITY_SELECTED";

export class UnitSelectedPanel {

  private m_container : PIXI.Container = new PIXI.Container();
  private m_event_manager : EventManager<SELECTION_PANEL_EVENT> = new EventManager();

  constructor (private m_controller : GameController) {
    this.m_container.position.set(10, 500);
    m_controller.addInterfaceElement(this.m_container);
  }

  public showUnitPanel = (unit : Unit) => {
    this.m_container.removeChildren();
    this.m_container.visible = true;

    if (!unit) {
      return;
    }
    this.showAbilities(unit.getAbilities());
  }
  public hide = () => {
    this.m_container.visible = false;
  }

  public onAbilitySelected = (cb : (def : IAbilityInfo )=>void ) => {
    this.m_event_manager.add("ABILITY_SELECTED", cb);
  }
  public showAbilities = (abiliy_list : IAbilityInfo[]) => {

    _.forEach(abiliy_list, (def, index) => {
      let btn =  new PIXI.Sprite();
      
      let bg = new PIXI.Graphics();

      btn.addChild(new PIXI.Graphics().beginFill(0x333333).drawRoundedRect(0,0, 200, 60, 5).endFill());
      btn.interactive = btn.buttonMode = true;
      btn.on('pointerdown', (evt : PIXI.interaction.InteractionEvent) => {
        evt.stopPropagation();

        this.m_event_manager.emit("ABILITY_SELECTED", def);

      });

      btn.position.set(0, index * 80);

      let label = new PIXI.Text(def.name, { fill : 0xFFFFFF });
      label.anchor.set(0.5);
      label.position.set(100, 30);
      btn.addChild(label);

      this.m_container.addChild(btn);
    });
  }
}