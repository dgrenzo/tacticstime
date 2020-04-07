import * as _ from 'lodash';

import * as PIXI from 'pixi.js';
import { GameBoard } from "./board/GameBoard";
import { RenderMode, CreateRenderer } from '../engine/render/render';
import { FSM } from '../engine/FSM';
import { SceneRenderer, getAsset } from '../engine/render/scene/SceneRenderer';
import { EventManager } from '../engine/listener/event';
import { LoadMission } from './board/Loader';
import { PlayerTurn } from './play/PlayerTurn';
import { GameEvent } from './play/action/ActionStack';
import { RENDER_PLUGIN } from './extras/plugins';
import { UnitQueue } from './play/UnitQueue';
import { BoardController } from './board/BoardController';
import { EnemyTurn } from './play/EnemyTurn';
import EffectsManager from './effects';
import { ICreateUnitActionData } from './play/action/executors/action/CreateUnit';
import { HealthBar } from './play/interface/HealthBar';

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
  private m_board_controller : BoardController;
  private m_renderer : SceneRenderer;
  private m_unit_queue : UnitQueue;
  private m_event_manager = new EventManager<GameSignal>();

  private m_interface_container : PIXI.Container = new PIXI.Container();

  private m_states : GameBoard[];

  constructor(private m_config : GameConfig) {
    this.m_fsm = new FSM();
    m_config.pixi_app.ticker.add(this.m_fsm.update);
    
    this.m_board_controller = new BoardController();
    this.m_unit_queue = new UnitQueue();
    this.m_renderer = CreateRenderer(this.m_config);

    LoadMission('assets/data/missions/001.json').then(mission_data => {
      
      this.m_board_controller.initBoard(mission_data);

      this.m_board_controller.on("CREATE_UNIT", (data : ICreateUnitActionData) => {
        this.m_unit_queue.addUnit(data.unit);
        let renderable = this.m_renderer.addEntity(data.unit);
        renderable.render(getAsset(data.unit));
      });

      this.m_board_controller.on("UNIT_CREATED", (data : ICreateUnitActionData) => {
        let health_bar = new HealthBar(data.unit.id, this.m_board_controller, this.m_renderer);
        this.m_renderer.effects_container.addChild(health_bar.sprite);
      });

      this.m_board_controller.sendToRenderer(this.m_renderer);

      this.onSetupComplete();
    }); 
  }

  private onSetupComplete = () => {
    this.m_config.pixi_app.stage.addChild(this.m_renderer.stage);
    this.m_config.pixi_app.stage.addChild(this.m_renderer.effects_container);

    this.m_config.pixi_app.stage.addChild(this.m_interface_container);

    //let highlighter = new TileHighlighter(this.m_renderer, this.m_board);
    //this.m_config.pixi_app.ticker.add(highlighter.update);

    EffectsManager.init(this.m_renderer);

    this.on("SET_PLUGIN", (data : { id : number, plugin : RENDER_PLUGIN}) => {
      this.m_renderer.getRenderable(data.id).setPlugin(data.plugin);
    });

    this.m_renderer.on("POINTER_DOWN", this.tileClicked);

    this.m_board_controller.executeActionStack().then(this.startGame);
  }

  private startGame = () => {
    new PlayerTurn(this.m_unit_queue.getNextQueued(), this, this.m_board_controller, this.onTurnComplete);
  }

  public addInterfaceElement(element : PIXI.Container) {
    this.m_interface_container.addChild(element);
  }

  private onTurnComplete = () => {
    let next_unit = this.m_unit_queue.getNextQueued();
    if (!next_unit) {
      console.log('done');
      return;
    }
    if (!this.m_board_controller.getUnit(next_unit)){
      this.onTurnComplete();
      return;
    }
    let player = new EnemyTurn(next_unit, this, this.m_board_controller, this.onTurnComplete);   
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
    this.m_event_manager.emit("TILE_CLICKED", this.m_board_controller.getTile(data));
  }
}