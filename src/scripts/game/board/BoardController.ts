import { List } from 'immutable';
import * as _ from 'lodash';

import { GameBoard, IBoardPos, CreateUnit } from "./GameBoard";
import { ActionStack, IGameAction, GameEvent, IActionData } from "../play/action/ActionStack";
import { GetMoveOptions } from "../pathfinding";
import { IRangeDef } from "../play/action/abilities";
import { IAbilityAction } from "../play/action/executors/action/Ability";
import { EventManager } from "../../engine/listener/event";
import { IEntity } from "../../engine/scene/Entity";
import { ITile } from "./Tile";
import { IUnit } from "./Unit";
import { IElementMap } from '../../engine/scene/Scene';
import { ILoadedMission, ILoadedTeam } from './Loader';
import { SceneRenderer } from '../../engine/render/scene/SceneRenderer';
import EffectsManager from '../effects';
import { GameEffect } from '../effects/damage';
import { ICreateUnitAction } from '../play/action/executors/action/CreateUnit';


export class BoardController {

  protected m_board : GameBoard;
  private m_action_stack : ActionStack;
  private m_event_manager = new EventManager<GameEvent>();

  private m_renderer : SceneRenderer;

  constructor() {
    this.m_action_stack = new ActionStack(this);
  }

  public createClone = () : AIBoardController => {
    let ctrl = new AIBoardController(this.m_board.elements);
    return ctrl;
  }

  public initBoard = (data : ILoadedMission) => {
    this.m_board = new GameBoard();
    this.m_board.init(data.board);

    this.initUnits(data.teams);
    //this.m_board.initTeams(data.teams);
  }

  private initUnits = (teams : ILoadedTeam[]) : IUnit[] => {
    let units : IUnit[] = [];
    _.forEach(teams, team => {
      _.forEach(team.units, unit_def => {
        let create_action : ICreateUnitAction = {
          type : "CREATE_UNIT",
          data : {
            unit : CreateUnit(unit_def, team.name),
          }
        }
        this.sendAction(create_action);
      })
    });
    return units;
  }

  public sendToRenderer = (renderer : SceneRenderer) => {
    this.m_renderer = renderer;
    renderer.initializeScene(this.m_board);
  }
  
  public sendAction = (action : IGameAction | IGameAction[]) => {
    this.m_action_stack.push(action);
  }

  public executeActionStack = () : Promise<void> => {
    return this.m_action_stack.execute(this.m_board.elements).then(updated_board => {
      if (!updated_board) {
        return null;
      } else {
        this.m_board.elements = updated_board;
        return this.executeActionStack();
      }
    })
  }

  public getActionCallback(action : IGameAction) : Promise<void> {
    if (!this.m_renderer) {
      return new Promise(resolve => {
        setTimeout(resolve, 100)
      })
    }
    
    return new Promise(resolve => {
      let effect = this.createEffect(action, resolve);

      if (effect) {
        let action_target = this.m_board.getElement(action.data.entity_id);
        let screen_pos = this.m_renderer.getScreenPosition(action_target.pos.x, action_target.pos.y);
        effect.m_container.position.set(screen_pos.x, screen_pos.y);
      } else {
        setTimeout(resolve, 100);
      }
    })
  }

  public addUnit = (unit : IUnit) => {
    if (this.m_renderer) {

    }
  }
  
  public createEffect = (ability : IGameAction, cb : ()=>void) : GameEffect => {
    return EffectsManager.RenderEffect(ability, cb);
  }  

  public on = (event_name : GameEvent, cb : (data:any) => void) => {
    this.m_event_manager.add(event_name, cb);
  }

  public off = (event_name : GameEvent, cb : (data:any) => void) => {
    this.m_event_manager.remove(event_name, cb);
  }

  public emit = (event_name : GameEvent, data ?: any) => {
    this.m_event_manager.emit(event_name, data);
  }

  public getMoveOptions = (unit : IUnit) => {
    return GetMoveOptions(unit, this.m_board);
  }

  public removeEntity = (id : number) => {
    this.m_board.removeElement(id);
    if (this.m_renderer) {
      this.m_renderer.removeEntity(id);
    }
  }
  
  public getTile = (pos : IBoardPos) : ITile => {
    return this.m_board.getTileAtPos(pos);
  }

  public getUnit = (id : number) : IUnit => {
    return this.m_board.getUnit(id);
  }

  public getUnits = () : List<IUnit> => {
    return this.m_board.getUnits();
  }

  public getUnitAtPosition = (pos : IBoardPos) : IUnit => {
    return this.m_board.getUnitAtPosition(pos);
  }

  public getTilesInRange = (pos : IBoardPos, range : IRangeDef) : List<ITile>  => {
    return this.m_board.getTilesInRange(pos, range);
  }

  public getElementsAt = (pos : IBoardPos) : List<IEntity> => {
    return this.m_board.getElementsAt(pos);
  }
}


export class AIBoardController extends BoardController {
  constructor(elements : IElementMap) {
    super();
    this.m_board = new GameBoard();
    this.m_board.elements = elements;
  }

  public getActionCallback(action : any) : Promise<void> {
    return Promise.resolve();
  }

  public get board() {
    return this.m_board;
  }
}