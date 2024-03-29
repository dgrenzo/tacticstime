import * as _ from 'lodash';
import * as PIXI from 'pixi.js';

import { GameController } from "../../GameController";
import { IUnit } from '../../board/Unit';
import { GetAbilityDef, IAbilityDef } from '../action/abilities';
import { TypedEventEmitter } from '../../../engine/listener/TypedEventEmitter';

export interface IUnitSelectedPanelEvent {
  MOVE_SELECTED : any,
  ABILITY_SELECTED : IAbilityDef,
}

export class UnitSelectedPanel {

  private m_container : PIXI.Container = new PIXI.Container();
  private m_events : TypedEventEmitter<IUnitSelectedPanelEvent> = new TypedEventEmitter();

  constructor (private m_controller : GameController) {
    this.m_container.position.set(10, 500);
    //m_controller.addInterfaceElement(this.m_container);
  }

  public showUnitPanel = (unit : IUnit) => {
    this.m_container.removeChildren();
    this.m_container.visible = true;

    if (!unit) {
      return;
    }
    this.showAbilities(unit.abilities);
  }
  public hide = () => {
    this.m_container.visible = false;
  }

  public onAbilitySelected = (cb : (def : IAbilityDef )=>void ) => {
    this.m_events.on("ABILITY_SELECTED", cb);
  }

  public showAbilities = (abiliy_list : string[]) => {
    _.forEach(abiliy_list, (name, index) => {
      let ability_def = GetAbilityDef(name);

      let btn =  new PIXI.Sprite();
      btn.addChild(new PIXI.Graphics().beginFill(0x333333).drawRoundedRect(0,0, 200, 60, 5).endFill());
      btn.interactive = btn.buttonMode = true;
      
      btn.on('pointerdown', (evt : PIXI.interaction.InteractionEvent) => {
        evt.stopPropagation();
        this.m_events.emit("ABILITY_SELECTED", ability_def);
      });

      btn.position.set(0, 80 + index * 80);

      let label = new PIXI.Text(ability_def.name, { fill : 0xFFFFFF });
      label.anchor.set(0.5);
      label.position.set(100, 30);
      btn.addChild(label);

      this.m_container.addChild(btn);
    });
  }
}