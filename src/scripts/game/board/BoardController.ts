import { List } from 'immutable';
import * as _ from 'lodash';

import { GameBoard, IBoardPos, IBoardConfig } from "./GameBoard";
import { ActionStack, IGameAction, GameEvent, IActionData } from "../play/action/ActionStack";
import { GetMoveOptions } from "../pathfinding";
import { IRangeDef } from "../play/action/abilities";
import { IAbilityActionData } from "../play/action/executors/action/Ability";
import { EventManager } from "../../engine/listener/event";
import { IEntity } from "../../engine/scene/Entity";
import { ITile } from "./Tile";
import { IUnit } from "./Unit";
import { IElementMap } from '../../engine/scene/Scene';
import { SceneRenderer } from '../../engine/render/scene/SceneRenderer';
import { ICreateUnitAction } from '../play/action/executors/action/CreateUnit';
import { IMoveActionData } from '../play/action/executors/action/Movement';


export class BoardController {

  protected m_board : GameBoard;
  private m_action_stack : ActionStack;
  private m_event_manager = new EventManager<GameEvent>();

  private m_renderer : SceneRenderer;

  private m_effect_entities : IEntity[] = [];

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

  //There should be a service that handles these animations (.sprite references shouldnt be here)
  private animateAbility(data : IAbilityActionData) : Promise<void> {
    return new Promise (resolve => {
      if (!this.m_board.getUnitAtPosition(data.target.pos)) {
        return resolve();
      }

      return resolve();
      /*
      let sprite = this.m_renderer.getSprite(data.source.id);

      let dir = {
        x : data.target.pos.x - data.source.pos.x,
        y : data.target.pos.y - data.source.pos.y,
      };

      let anim_dir = this.m_renderer.getProjection(dir);
      anim_dir.x = Math.min(Math.max(-1, anim_dir.x), 1);
      anim_dir.y = Math.min(Math.max(-1, anim_dir.y), 1);

      sprite.position.x = -anim_dir.x;
      sprite.position.y = -anim_dir.y
      setTimeout(() => {
        sprite.position.x = anim_dir.x * 3;
        sprite.position.y = anim_dir.y * 3;
        setTimeout(() => {
          sprite.position.set(0,0);
        }, 150)
        resolve()
      }, 250);
      */
    })

  }


  private animateEffect(data : IActionData) : Promise<void> {
    return new Promise(resolve => {

      resolve();
    });
  }

  public animateGameAction(action : IGameAction) : Promise<void> {

    if (!this.m_renderer) {
      return Promise.resolve();
    }
    
    if (action.type === 'ABILITY') {
      return this.animateAbility(action.data as IAbilityActionData);
    }

    return new Promise(resolve => {
      // let effect = this.createEffect(action, resolve);

      // if (effect) {
      //   let action_target = this.m_board.getElement(action.data.entity_id);
      //   let screen_pos = this.m_renderer.getScreenPosition(action_target.pos.x, action_target.pos.y);
      //   //effect.m_container.position.set(screen_pos.x, screen_pos.y);
      // } else {
      //   setTimeout(resolve, 100);
      // }
      
      setTimeout(resolve, 100);
    
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
  
  // public createEffect = (ability : IGameAction, cb : ()=>void) : GameEffect => {
  //   //return EffectsManager.RenderEffect(ability, cb);
  // }  

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