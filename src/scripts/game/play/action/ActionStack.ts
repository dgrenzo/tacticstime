import * as _ from 'lodash';
import { IUnit } from '../../board/Unit';
import { BoardController } from '../../board/BoardController';
import { IBoardPos, UpdateFunction } from '../../board/GameBoard';
import { ExecuteMove, IMoveActionData, IMoveAction } from "./executors/action/Movement";
import { ExecuteDamage, IDamageActionData, IDamageAction } from "./executors/action/Damage";
import { ExecuteKilled } from "./executors/action/Killed";
import { ExecuteAbility, IAbilityActionData, IAbilityAction } from "./executors/action/Ability";
import { IElementMap } from '../../../engine/scene/Scene';
import { ExecuteCreateUnit, ICreateUnitAction } from './executors/action/CreateUnit';

export type GameEvent = "MOVE" | "ABILITY" | "STRIKE" | "DAMAGE" | "HEAL" | "DAMAGE_DEALT" | "CREATE_UNIT" | "UNIT_CREATED" | "UNIT_KILLED";

export interface IActionData {
  //[index : string] : any,
  entity_id ?: number,
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
  
  constructor (private m_controller : BoardController) {

  }

  private m_stack_root : IStackedAction = {
    action : null,
    next : null,
  };

  public execute = (elements : IElementMap) : Promise<IElementMap> => {
    return new Promise(resolve => {
      let next_action = this.shift();
      
      if (!next_action) {
        return resolve(null);
      } else {
        return resolve(this.executeEvent(elements, next_action))
        // ExecuteBoardEvent(next_action, this.m_controller).then(() => {
        //   this.m_controller.emit(next_action.type, next_action.data)
        //   return this.execute()
        // }).then(resolve);
      }
    });
  }

  private executeEvent = (elements : IElementMap, action : IGameAction) : Promise<IElementMap> => {
    //console.log(action);
    let controller = this.m_controller;
    this.m_controller.emit(action.type, action.data);
    switch (action.type) {
      case "MOVE" :
        return ExecuteMove(action as IMoveAction, elements, controller);
      case "ABILITY" : 
        return ExecuteAbility(action as IAbilityAction, elements, controller);
      case "DAMAGE" : 
        return ExecuteDamage(action as IDamageAction, elements, controller);
      case "UNIT_KILLED" :
        return ExecuteKilled(action, elements, controller);
      case "CREATE_UNIT" :
        return ExecuteCreateUnit(action as ICreateUnitAction, elements, controller);
      default :
        return ExecuteDefault(action, elements, controller);
        
    }
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

function ExecuteDefault(action : IGameAction, elements : IElementMap, controller : BoardController) : Promise<IElementMap> {
  return new Promise<IElementMap>(resolve => {
    controller.getActionCallback(action).then(() => {
      resolve(elements)
    });
  });
}