import * as _ from 'lodash';
import { GameController } from '../GameController';
import { ITilePos } from '../board/GameBoard';
import { FSM } from '../../engine/FSM';
import { Tile } from '../board/Tile';
import { Unit } from '../board/Unit';
import { IPathTile } from '../pathfinding';

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
  private m_active_unit : Unit;
  private m_active_tile : Tile;

  private m_options : IPathTile[];

  private m_fsm : FSM;


  constructor (private m_controller : GameController) {

    this.m_fsm = new FSM();

    this.m_fsm.registerState(PLAY_STATE.NO_SELECTION, {
      enter : () => {
        this.m_active_unit = this.m_active_tile = null;
        this.m_controller.on("TILE_CLICKED", this.selectTile);
      },
      exit : () => {
        this.m_controller.off("TILE_CLICKED", this.selectTile);
      }
    });

    this.m_fsm.registerState(PLAY_STATE.SELECTED, {
      enter : () => {
       this.m_controller.emit("TILE_SELECTED", this.m_active_tile);
       this.m_controller.emit("SET_PLUGIN", {id :  this.m_active_tile.id, plugin : 'highlight_green'});

       let unit = this.m_active_unit = this.m_controller.getUnit(this.m_active_tile);
       if (unit) {
         this.m_options = this.m_controller.getMoveOptions(unit);
         _.forEach(this.m_options, path => {
           if (!this.m_controller.getUnit(path.tile)) {
            this.m_controller.emit("SET_PLUGIN", {id : path.tile.id, plugin : 'highlight_blue'});
           }
         });
       }
       this.m_controller.on("TILE_CLICKED", this.moveAction);
      },
      exit : () => {
        
       this.m_controller.off("TILE_CLICKED", this.moveAction);
       this.m_controller.emit("SET_PLUGIN", {id :  this.m_active_tile.id, plugin : 'batch'});
        _.forEach(this.m_options, path => {
          if (!this.m_controller.getUnit(path.tile)) {
           this.m_controller.emit("SET_PLUGIN", {id : path.tile.id, plugin : 'batch'});
          }
        });
      }
    });
    this.m_fsm.registerState(PLAY_STATE.ACTING, {});
    this.m_fsm.setState(PLAY_STATE.NO_SELECTION);

    


  }

  private selectTile = (data : ITilePos) => {
    let tile = this.m_controller.getTile(data);
    if (!tile) {
      return;
    }
    this.m_active_tile = tile;
    this.m_fsm.setState(PLAY_STATE.SELECTED);
  }

  private moveAction = (data : ITilePos) => {
    let tile = this.m_controller.getTile(data);
    
    let move_option = this.getMoveOption(tile);
    if (move_option) {
      let move_action = this.toMoveAction(move_option);
      this.m_controller.sendAction(move_action);
      this.m_fsm.setState(PLAY_STATE.ACTING);
    } else {
      this.m_fsm.setState(PLAY_STATE.NO_SELECTION);
      if (this.m_controller.getUnit(data)) {
        this.selectTile(data);
      }
    }
  }
  
  private executeMove = (data : {unit : Unit, tile : ITilePos}) : Promise<null> => {
    return new Promise(resolve => {
      data.unit.x = data.tile.x;
      data.unit.y = data.tile.y;
      setTimeout(resolve, 100);
    })
  }

  private toMoveAction(path : IPathTile) {
    let action = [];

    while (path) {
      action.unshift({
        type : "MOVE",
        executor : this.executeMove,
        data : {
          unit : this.m_active_unit,
          tile : path.tile,
        }
      });
      path = path.last;
    }
    return action;
  }

  private getMoveOption(tile : Tile) {
    let path : IPathTile = null;
    _.forEach(this.m_options, option => {
      if (option.tile === tile) {
        path = option;
        return false;
      }
      return true;
    });
    return path;
  }
  
}