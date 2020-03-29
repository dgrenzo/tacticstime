import * as _ from 'lodash';
import { GameController } from '../GameController';
import { FSM } from '../../engine/FSM';
import { Tile } from '../board/Tile';
import { Unit } from '../board/Unit';
import { BoardActionUI } from './action/BoardActionUI';
import { MoveActionUI } from './action/MoveActionUI';
import { UnitSelectedPanel } from './interface/UnitSelectedPanel';
import { IAbilityDef } from './action/abilities';
import { AbilityTargetUI } from './action/AbilityTargetUI';

enum TURN_STATE {
  BEFORE_MOVE = 0,
  MOVING,
  BEFORE_ACTING,
  ACTING,
  AFTER_ACTING,
}
interface ISelection {
  tile : Tile,
  unit ?: Unit,
}

export class PlayerTurn {

  private m_initial_state; // : BoardState;
  
  private m_selected_panel : UnitSelectedPanel;
  private m_action_ui : BoardActionUI;

  private m_selected_tile : Tile;

  private m_fsm : FSM;

  constructor (private m_active_unit : Unit, private m_controller : GameController, private m_onComplete : ()=>void) {
    
    this.m_selected_panel = new UnitSelectedPanel(this.m_controller);
    this.m_selected_panel.onAbilitySelected(this.onAbilitySelected);

    this.initFSM();
    this.m_fsm.setState(TURN_STATE.BEFORE_MOVE);
  }

  private initFSM = () => {
    this.m_fsm = new FSM();
    this.m_fsm.registerState(TURN_STATE.BEFORE_MOVE, {
      enter : () => {
        this.selectTile(this.m_controller.getTile(this.m_active_unit));
        this.m_action_ui = new MoveActionUI(this.m_active_unit, this.m_controller);
        this.m_controller.on("TILE_CLICKED", this.onTileClicked);
      },
      exit : () => {
        this.m_controller.off("TILE_CLICKED", this.onTileClicked);
        this.selectTile(null);
        this.m_action_ui.hideOptions();
        this.m_action_ui = null;
      }
    });
    
    this.m_fsm.registerState(TURN_STATE.MOVING, {});

    this.m_fsm.registerState(TURN_STATE.BEFORE_ACTING, {
        enter : () => {
          this.m_selected_tile = this.m_controller.getTile(this.m_active_unit);
          this.m_selected_panel.showUnitPanel(this.m_active_unit);
          this.m_controller.on("TILE_CLICKED", this.onTileClicked);
        },
        exit : () => {
          this.m_controller.off("TILE_CLICKED", this.onTileClicked);
          this.m_selected_panel.hide();
          if (this.m_action_ui) {
            this.selectTile(null);
            this.m_action_ui.hideOptions();
            this.m_action_ui = null;
          }
        }
    });
    this.m_fsm.registerState(TURN_STATE.ACTING, {});
    this.m_fsm.registerState(TURN_STATE.AFTER_ACTING, {
      enter : () => {
        this.m_onComplete();
      }
    });
  }

  private onAbilitySelected = (ability : IAbilityDef) => {
    if (this.m_action_ui)
    {
      this.m_action_ui.hideOptions();
    }
    switch (ability.name) {
      default :
        this.m_action_ui = new AbilityTargetUI(ability, this.m_active_unit, this.m_controller);
        break;
    }
  }

  private onTileClicked = (tile : Tile) => {
    let action = this.m_action_ui.getAction(tile);
    if (!action) {
      return this.selectTile(tile);
    }
    this.startAction(action);
  }

  private startAction = (action : any[]) => {
    switch (this.m_fsm.state) {
      case TURN_STATE.BEFORE_MOVE : 
        this.m_fsm.setState(TURN_STATE.MOVING);
        break;
      case TURN_STATE.BEFORE_ACTING :
        this.m_fsm.setState(TURN_STATE.ACTING);
        break;
    }    
    this.m_controller.sendAction(action);
    this.m_controller.executeActionStack(this.onActionComplete);
  }
  private onActionComplete = () => {
    switch (this.m_fsm.state) {
      case TURN_STATE.MOVING : 
        this.m_fsm.setState(TURN_STATE.BEFORE_ACTING);
        break;
      case TURN_STATE.ACTING :
        this.m_fsm.setState(TURN_STATE.AFTER_ACTING);
        break;
    }
  }

  private selectTile = (tile : Tile) => {
    if (this.m_selected_tile) {
      this.m_controller.emit("SET_PLUGIN", {id :  this.m_selected_tile.id, plugin : 'batch'});
    }
    if (!tile) {
      return;
    }
    this.m_selected_tile = tile;
    this.m_controller.emit("SET_PLUGIN", {id :  this.m_selected_tile.id, plugin : 'highlight_green'});
    this.m_controller.emit("TILE_SELECTED", this.m_selected_tile);

  }
}