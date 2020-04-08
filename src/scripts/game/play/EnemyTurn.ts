import * as _ from 'lodash';
import { GameController } from '../GameController';
import { BoardController } from '../board/BoardController';
import { GameBoard } from '../board/GameBoard';
import { GetMoveOptions, IPathTile } from '../pathfinding';
import { IUnit } from '../board/Unit';
import { ITile } from '../board/Tile';
import { GetAbilityDef } from './action/abilities';
import { AbilityTargetUI } from './action/AbilityTargetUI';
import { IMoveAction } from './action/executors/action/Movement';

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

interface ITurnOption {
  score : number,
  move_action : any,
  ability_action : any,
}

export class EnemyTurn {

  private m_faction : string = null;

  constructor ( private m_unit_id : number, 
                private m_controller : GameController, 
                private m_board_controller : BoardController, 
                private m_onComplete : ()=>void ) {

    this.m_faction = this.m_board_controller.getUnit(this.m_unit_id).data.faction;
                  
    let ai_ctrl = this.m_board_controller.createClone();

    let move_options = GetMoveOptions(ai_ctrl.getUnit(m_unit_id), ai_ctrl.board)
    
    let ai_options : ITurnOption[] = [];
    _.forEach(move_options, option => {

      let move_ctrl = ai_ctrl.createClone();
      let move_action = this.toMoveAction(option);

      move_ctrl.sendAction(move_action);
      move_ctrl.executeActionStack().then(() => {
        
        let active_unit = move_ctrl.getUnit(this.m_unit_id);
        _.forEach(active_unit.abilities, (ability_name) => {
          let ability_def = GetAbilityDef(ability_name);
          let ability_ui = new AbilityTargetUI(ability_def, active_unit, move_ctrl);

          _.forEach(ability_ui.options, ability_option => {
            let ability_action = ability_ui.getAction(ability_option.tile);
            let ability_ctrl = move_ctrl.createClone();

            ability_ctrl.sendAction(ability_action as any);
            ability_ctrl.executeActionStack().then(() => {
              let opt = {
                score : this.scoreBoard(ability_ctrl.board),
                move_action,
                ability_action,
              };
              
              ai_options.push(opt)
            });
          })
        })
      });
    });


    setTimeout(() => {
      let best : ITurnOption = null;
      _.forEach(ai_options, option => {
        if (best === null || option.score > best.score) {
          best = option;
        }
      })
      this.m_board_controller.sendAction(best.move_action);
      this.m_board_controller.executeActionStack().then(() => {
        this.m_board_controller.sendAction(best.ability_action);
        this.m_board_controller.executeActionStack().then(
          () => {
            setTimeout(this.m_onComplete, 25)
          });
      });
    }, 25)
  }
  private scoreBoard = (board : GameBoard) => {
    let score = Math.random() * .5;

    board.getUnits().forEach( unit => {
      if (unit.data.faction !== this.m_faction) {
        score -= unit.status.hp;
        score -= 5;
      } else {
        score += 5;
        score += unit.status.hp;
      }
    });

    let active_unit = board.getUnit(this.m_unit_id);
    if (active_unit) {

      let closest = Infinity;
      board.getUnits().forEach( unit => {
        if (unit.data.faction !== this.m_faction) {
          let distance = Math.random() + Math.abs(active_unit.pos.x - unit.pos.x) + Math.abs(active_unit.pos.y - unit.pos.y);
          if (distance < closest) {
            closest = distance;
          }
        }
      });
      if (closest != Infinity) {
        score -= closest;
      }
    }
    return score;
  }

    
  private toMoveAction(path : IPathTile) : IMoveAction[]{
    let action : IMoveAction[] = [];
    
    while (path) {
      action.unshift({
        type : "MOVE",
        data : {
          entity_id : this.m_unit_id,
          move : { 
            to : {
              x : path.tile.pos.x,
              y : path.tile.pos.y,
            }
          }
        }
      });
      path = path.last;
    }
    return action;
  }
}