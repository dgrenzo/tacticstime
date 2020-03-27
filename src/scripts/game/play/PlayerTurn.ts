import * as _ from 'lodash';
import { GameController } from '../GameController';
import { FSM } from '../../engine/FSM';
import { Tile } from '../board/Tile';
import { Unit } from '../board/Unit';
import { BoardActionUI } from './action/BoardActionUI';
import { MoveActionUI } from './action/MoveActionUI';
import { UnitSelectedPanel } from './interface/UnitSelectedPanel';
import { AttackActionUI } from './action/AttackActionUI';
import { IAbilityDef } from './action/abilities';
import { AbilityTargetUI } from './action/AbilityTargetUI';

enum PLAY_STATE {
  NO_SELECTION = 0,
  SELECTED,
  ACTING,
}
interface ISelection {
  tile : Tile,
  unit ?: Unit,
}

export class PlayerTurn {

  private m_selected_panel : UnitSelectedPanel;
  private m_action_ui : BoardActionUI;


  private m_active_tile : Tile;
  private m_active_unit : Unit;
  private m_fsm : FSM;

  constructor (private m_controller : GameController) {
    this.m_selected_panel = new UnitSelectedPanel(this.m_controller);
    this.m_selected_panel.onAbilitySelected(this.onAbilitySelected);
    this.m_selected_panel.onMoveSelected(this.onMoveSelected);

    this.m_controller.on("TILE_CLICKED", this.onTileClicked);
    this.setupFSM();
    this.m_fsm.setState(PLAY_STATE.NO_SELECTION);
  }

  private setupFSM = () => {
    if (this.m_fsm) {
      return;
    }
    this.m_fsm = new FSM();
    this.m_fsm.registerState(PLAY_STATE.NO_SELECTION, {
      enter : () => {
        this.m_active_tile = null;
      },
    });

    this.m_fsm.registerState(PLAY_STATE.SELECTED, {
      enter : () => {
        this.m_controller.emit("TILE_SELECTED", this.m_active_tile);
        this.m_controller.emit("SET_PLUGIN", {id :  this.m_active_tile.id, plugin : 'highlight_green'});

        this.m_active_unit = this.m_controller.getUnit(this.m_active_tile);
        this.m_selected_panel.showUnitPanel(this.m_active_unit);

      },
      exit : () => {
        this.m_controller.emit("SET_PLUGIN", {id :  this.m_active_tile.id, plugin : 'batch'});
        this.m_selected_panel.hide();
        if (this.m_action_ui) {
          this.m_action_ui.hideOptions();
          this.m_action_ui = null;
        }
      }
    });
    this.m_fsm.registerState(PLAY_STATE.ACTING, {});
  }

  private onMoveSelected = () => {
    this.m_action_ui = new MoveActionUI(this.m_active_tile, this.m_controller);
  }
  private onAbilitySelected = (ability : IAbilityDef) => {
    switch (ability.name) {
      default :
        this.m_action_ui = new AbilityTargetUI(ability, this.m_active_tile, this.m_controller);
        break;
    }
  }

  private onTileClicked = (tile : Tile) => {
    switch (this.m_fsm.state) {
      case PLAY_STATE.NO_SELECTION :
        this.selectTile(tile);
        break;
      case PLAY_STATE.SELECTED :
        let action = [];
        if (this.m_action_ui) {
          action = this.m_action_ui.getAction(tile);
        }
        if (action.length > 0) {
          this.m_controller.sendAction(action);
          this.m_controller.executeActionStack();
          this.m_fsm.setState(PLAY_STATE.ACTING);
        } else {
          this.m_fsm.setState(PLAY_STATE.NO_SELECTION);
          this.selectTile(tile);
        }
        break;
      default :
        return;
    }
  }

  private selectTile = (tile : Tile) => {
    if (!tile) {
      return;
    }
    this.m_active_tile = tile;
    this.m_fsm.setState(PLAY_STATE.SELECTED);
  }

}