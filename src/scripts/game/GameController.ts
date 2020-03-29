import * as _ from 'lodash';

import * as PIXI from 'pixi.js';
import { GameBoard, ITilePos } from "./board/GameBoard";
import { RenderMode, CreateRenderer } from '../engine/render/render';
import { FSM } from '../engine/FSM';
import { SceneRenderer } from '../engine/render/scene/SceneRenderer';
import { EventManager } from '../engine/listener/event';
import TileHighlighter from './extras/TileHighlighter';
import { LoadMission } from './board/Loader';
import { Tile } from './board/Tile';
import { Unit } from './board/Unit';
import { PlayerTurn } from './play/PlayerTurn';
import { ActionStack, IGameAction, GameEvent } from './play/action/ActionStack';
import { GetMoveOptions } from './pathfinding';
import { RENDER_PLUGIN } from './extras/plugins';
import { IRangeDef } from './play/action/abilities';
import { IAbilityAction } from './play/action/executors/action/Ability';
import EffectsManager from './effects';
import { Effect } from './board/Effect';
import { Entity } from '../engine/scene/Entity';
import { UnitQueue } from './play/UnitQueue';

export type GameConfig = {
  pixi_app : PIXI.Application,
  mode : RenderMode.ISOMETRIC,
}

export enum GameState {
  SETUP = 0,
  PLAY,
}

export type ClickedData = {
  id:number
};
export type TileData = {
  x : number,
  y : number
};





export type PlaySignal = "TILE_SELECTED";

export type RenderSignal = "SET_PLUGIN";

export type GameSignal = GameEvent | PlaySignal | RenderSignal | "TILE_CLICKED";


export class GameController {

  private m_fsm : FSM;

  private m_board : GameBoard;
  private m_renderer : SceneRenderer;
  private m_unit_queue : UnitQueue;
  private m_event_manager = new EventManager<GameSignal>();
  private m_action_stack : ActionStack;

  private m_interface_container : PIXI.Container = new PIXI.Container();

  constructor(private m_config : GameConfig) {
    this.m_fsm = new FSM();
    m_config.pixi_app.ticker.add(this.m_fsm.update);
    
    this.m_board = new GameBoard();
    this.m_unit_queue = new UnitQueue();
    this.m_renderer = CreateRenderer(this.m_config);
    this.m_action_stack = new ActionStack(this);

    LoadMission('assets/data/missions/001.json').then(mission_data => {
      this.m_board.init(mission_data.board);
      let units : Unit[] = this.m_board.initTeams(mission_data.teams);
      this.m_unit_queue.addUnits(units);
      this.m_renderer.initializeScene(this.m_board);
      this.onSetupComplete();
    }); 
  }
  private onSetupComplete = () => {
    this.m_config.pixi_app.stage.addChild(this.m_renderer.stage);
    this.m_config.pixi_app.stage.addChild(this.m_interface_container);

    let highligher = new TileHighlighter(this.m_renderer, this.m_board);
    this.m_config.pixi_app.ticker.add(highligher.update);

    this.m_config.pixi_app.ticker.add(() => {
      this.m_renderer.renderScene(this.m_board);
    });

    this.on("SET_PLUGIN", (data : { id : number, plugin : RENDER_PLUGIN}) => {
      this.m_renderer.getRenderable(data.id).setPlugin(data.plugin);
    });

    this.m_renderer.on("POINTER_DOWN", this.tileClicked);


    let player = new PlayerTurn(this.m_unit_queue.getNextQueued(), this, this.onTurnComplete);
  }

  public addInterfaceElement(element : PIXI.Container) {
    this.m_interface_container.addChild(element);
  }

  public sendAction = (action : IGameAction | IGameAction[]) => {
    this.m_action_stack.push(action);
  }

  public executeActionStack = (onComplete : () => void) : Promise<void> => {
    return this.m_action_stack.execute().then(onComplete);
  }

  private onTurnComplete = () => {
    let player = new PlayerTurn(this.m_unit_queue.getNextQueued(), this, this.onTurnComplete);   
  }

  public createEffect = (ability : IAbilityAction, cb : ()=>void) => {

   let entity = this.m_board.addElement(new Effect(ability));
   let renderer = this.m_renderer.addEntity(entity);

   let onComplete = () => {
     this.removeEntity(entity);
     cb();
   }

   EffectsManager.RenderEffect({
     entity,
     renderer
   }, onComplete);

  }


  public getMoveOptions = (unit : Unit) => {
    return GetMoveOptions(unit, this.m_board);
  }

  public getTile = (pos : { x : number, y : number }) : Tile => {
    return this.m_board.getTile(pos);
  }

  public getTilesInRange = (pos : ITilePos, range : IRangeDef) : Tile[] => {
    return this.m_board.getTilesInRange(pos, range);
  }

  public getUnit = (pos : ITilePos) : Unit => {
    return this.m_board.getUnit(pos);
  }

  public removeEntity = (ent : Entity) => {
    this.m_board.removeElement(ent.id);
    this.m_renderer.removeEntity(ent);
  }
  
  public on = (event_name : GameSignal, cb : (data:any) => void) => {
    this.m_event_manager.add(event_name, cb);
  }
  public off = (event_name : GameSignal, cb : (data:any) => void) => {
    this.m_event_manager.remove(event_name, cb);
  }

  public emit = (event_name : GameSignal, data ?: any) => {
    this.m_event_manager.emit(event_name, data);
  }

  private tileClicked = (data : TileData) => {
    this.m_event_manager.emit("TILE_CLICKED", this.m_board.getTile(data));
  }
}