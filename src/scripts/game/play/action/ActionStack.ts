import * as _ from 'lodash';
import { GameController } from '../../GameController';
import { Unit } from '../../board/Unit';
import { Tile } from '../../board/Tile';
import { ExecuteGameEvent } from './executors';

export type GameEvent = "MOVE" | "ABILITY" | "STRIKE" | "DAMAGE" | "HEAL" | "DAMAGE_DEALT" | "UNIT_KILLED";

export interface IActionData {
  [index : string] : any,
  unit ?: Unit,
  tile ?: Tile,
}

export interface IGameAction {
  type : GameEvent,
  data : IActionData,
}

interface IStackedAction {
  action : IGameAction,
  next ?: IStackedAction,
}

export class ActionStack {
  constructor (private m_controller : GameController) {

  }

  private m_stack_root : IStackedAction = {
    action : null,
    next : null,
  };

  public execute = () : Promise<null> => {
    return new Promise(resolve => {
      let next_action = this.shift();
      
      if (!next_action) {
        resolve();
      } else {
        ExecuteGameEvent(next_action, this.m_controller).then(() => {
          this.m_controller.emit(next_action.type, next_action.data)
          return this.execute()
        }).then(resolve);
      }
    });
  }

  public push = (actions : IGameAction | IGameAction[]) => {
    actions = _.concat(actions);
    _.forEach(actions, action => {
      this.tail.next = {
        action : action,
        next : null,
      }
    })
  }

  private get tail () : IStackedAction { 
    let tail = this.m_stack_root;
    while (tail.next) {
      tail = tail.next;
    }
    return tail;
  }

  private shift = () : IGameAction => {
    let next = this.m_stack_root.next;

    if (next) {
      this.m_stack_root.next = next.next;
      return next.action;
    }
    return null;
  }

}