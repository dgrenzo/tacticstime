import * as _ from 'lodash';
import { GameController } from '../GameController';
import { FSM } from '../../engine/FSM';
import { ITile } from '../board/Tile';
import { IUnit } from '../board/Unit';
import { BoardActionUI } from './action/BoardActionUI';
import { MoveActionUI } from './action/MoveActionUI';
import { UnitSelectedPanel } from './interface/UnitSelectedPanel';
import { IAbilityDef } from './action/abilities';
import { AbilityTargetUI } from './action/AbilityTargetUI';
import { BoardController } from '../board/BoardController';
import { IMoveAction } from './action/executors/action/Movement';
import { IGameAction } from './action/ActionStack';

enum TURN_STATE {
  BEFORE_MOVE = 0,
  MOVING,
  BEFORE_ACTING,
  ACTING,
  AFTER_ACTING,
}
interface ISelection {
  tile : ITile,
  unit ?: IUnit,
}

export class PlayerTurn {

  private m_selected_panel : UnitSelectedPanel;
  private m_action_ui : BoardActionUI;

  private m_selected_tile : ITile;

  private m_fsm : FSM;

  constructor (
    private m_selected_id : number, 
    private m_controller : GameController, 
    private m_board_controller : BoardController, 
    private m_onComplete : ()=>void
  ) {
    
    this.m_selected_panel = new UnitSelectedPanel(this.m_controller);
    this.m_selected_panel.onAbilitySelected(this.onAbilitySelected);

    this.initFSM();
    this.m_fsm.setState(TURN_STATE.BEFORE_MOVE);
  }

  private initFSM = () => {
    this.m_fsm = new FSM();
    this.m_fsm.registerState(TURN_STATE.BEFORE_MOVE, {
      enter : () => {
        let active = this.m_board_controller.getUnit(this.m_selected_id);
        this.selectTile(this.m_board_controller.getTile(active.pos));
        this.m_action_ui = new MoveActionUI(active, this.m_board_controller);
        this.markTiles(this.m_action_ui.options, "highlight_blue");
        this.m_controller.on("TILE_CLICKED", this.onTileClicked);
      },
      exit : () => {
        this.m_controller.off("TILE_CLICKED", this.onTileClicked);
        this.selectTile(null);
        this.markTiles(this.m_action_ui.options, "batch");
        this.m_action_ui = null;
      }
    });
    
    this.m_fsm.registerState(TURN_STATE.MOVING, {});

    this.m_fsm.registerState(TURN_STATE.BEFORE_ACTING, {
        enter : () => {
          let active = this.m_board_controller.getUnit(this.m_selected_id);
          this.m_selected_tile = this.m_board_controller.getTile(active.pos);
          this.m_selected_panel.showUnitPanel(active);
          this.m_controller.on("TILE_CLICKED", this.onTileClicked);
        },
        exit : () => {
          this.m_controller.off("TILE_CLICKED", this.onTileClicked);
          this.m_selected_panel.hide();
          if (this.m_action_ui) {
            this.selectTile(null);
            this.markTiles(this.m_action_ui.options, "batch");
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
      this.markTiles(this.m_action_ui.options, "batch");
    }
    switch (ability.name) {
      default :
        this.m_action_ui = new AbilityTargetUI(ability, this.m_board_controller.getUnit(this.m_selected_id), this.m_board_controller);
        break;
    }
    this.markTiles(this.m_action_ui.options, "highlight_red");
  }

  private onTileClicked = (tile : ITile) => {
    let action = this.m_action_ui.getAction(tile);
    if (!action) {
      return this.selectTile(tile);
    }
    this.startAction(action);
  }

  private startAction = (action : IGameAction[])=> {
    switch (this.m_fsm.state) {
      case TURN_STATE.BEFORE_MOVE : 
        this.m_fsm.setState(TURN_STATE.MOVING);
        break;
      case TURN_STATE.BEFORE_ACTING :
        this.m_fsm.setState(TURN_STATE.ACTING);
        break;
    }    
    this.m_board_controller.sendAction(action);
    this.m_board_controller.executeActionStack().then(this.onActionComplete);
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

  private selectTile = (tile : ITile) => {
    if (this.m_selected_tile) {
      this.m_controller.emit("SET_PLUGIN", {id :  this.m_selected_tile.id, plugin : 'batch'});
    }
    if (!tile) {
      return;
    }
    this.m_selected_tile = tile;
    this.markTile(tile, "highlight_green");
  }

  private markTile = (tile : ITile , plugin : "highlight_green" | "highlight_blue" | "highlight_red" | "batch") => {
    this.m_controller.emit("SET_PLUGIN", { id : tile.id, plugin });
  }

  private markTiles = (options:{tile}[] , plugin : "highlight_green" | "highlight_blue" | "highlight_red" | "batch") => {
    _.forEach(options, option => {
      this.markTile(option.tile, plugin);
    });
  }
}