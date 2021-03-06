import { List } from 'immutable';
import * as _ from 'lodash';

import { GameBoard, IBoardPos, IBoardConfig } from "./GameBoard";
import { ActionStack, IGameAction, GameEvent, IActionData } from "../play/action/ActionStack";
import { GetMoveOptions } from "../pathfinding";
import { IRangeDef } from "../play/action/abilities";
import { EventManager } from "../../engine/listener/event";
import { IEntity } from "../../engine/scene/Entity";
import { ITile } from "./Tile";
import { IUnit } from "./Unit";
import { IElementMap } from '../../engine/scene/Scene';
import { SceneRenderer } from '../../engine/render/scene/SceneRenderer';
import { ICreateUnitAction } from '../play/action/executors/action/CreateUnit';
import { BoardAnimator } from '../animation/BoardAnimator';


export class BoardController {

  protected m_board : GameBoard;
  private m_action_stack : ActionStack;
  private m_event_manager = new EventManager<GameEvent>();
  private m_animator : BoardAnimator;
  constructor() {
    this.m_action_stack = new ActionStack(this);
  }

  public createClone = () : AIBoardController => {
    let ctrl = new AIBoardController(this.m_board.elements);
    return ctrl;
  }

  public initBoard = (data : IBoardConfig) => {
    this.m_board = new GameBoard();
    this.m_board.init(data);
  }  

  public sendToRenderer = (renderer : SceneRenderer) => {
    renderer.initializeScene(this.m_board);
  }

  public setAnimator = (animator : BoardAnimator) => {
    this.m_animator = animator;
  }

  public animateGameAction(action : any) : Promise<void> {
    return this.m_animator.animateGameAction(action, this.m_board);
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

  public addUnit = (unit : IUnit) => {
    let create_action : ICreateUnitAction = {
      type : "CREATE_UNIT",
      data : {
        unit
      }
    }
    this.sendAction(create_action);
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
  }
  
  public getTile = (pos : IBoardPos) : ITile => {
    return this.m_board.getTileAtPos(pos);
  }

  public getUnit = (id : number) : IUnit => {
    if (id === undefined) {
      return null;
    }
    return this.m_board.getUnit(id);
  }

  public getUnits = () : List<IUnit> => {
    return this.m_board.getUnits();
  }

  public getUnitAtPosition = (pos : IBoardPos) : IUnit => {
    return this.m_board.getUnitAtPosition(pos);
  }

  public getTilesInRange = (pos : IBoardPos, range : IRangeDef) : List<ITile>  => {
    if (!range) {
      range = {
        max : 0,
        min : 0,
      }
    }
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

  public animateGameAction(action : any) : Promise<void> {
    return Promise.resolve();
  }

  public get board() {
    return this.m_board;
  }
}