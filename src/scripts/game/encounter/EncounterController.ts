import * as _ from 'lodash';
import * as PIXI from 'pixi.js';

import { BoardController } from "../board/BoardController";
import { SceneRenderer, getAsset } from "../../engine/render/scene/SceneRenderer";
import { UnitQueue } from "../play/UnitQueue";
import { EventManager } from "../../engine/listener/event";
import { GameSignal, GameConfig } from "../GameController";
import { LoadMission, LoadBoard } from "../board/Loader";
import { CreateRenderer } from "../../engine/render/render";
import { ICreateUnitActionData } from "../play/action/executors/action/CreateUnit";
import { IActionData } from "../play/action/ActionStack";
import { HealthBar } from "../play/interface/HealthBar";
import TileHighlighter from "../extras/TileHighlighter";
import EffectsManager from "../effects";
import { RENDER_PLUGIN } from "../extras/plugins";
import { EnemyTurn } from "../play/EnemyTurn";
import { FSM } from '../../engine/FSM';
import { IUnit } from '../board/Unit';

export enum EncounterState {
  INIT = 0,
  PLANNING,
  BATTLE,
  RESULT,
  CLEANUP
}


export class EncounterController {  
  private m_board_controller : BoardController;

  private m_fsm : FSM;

  private m_renderer : SceneRenderer;
  private m_unit_queue : UnitQueue;
  private m_event_manager = new EventManager<GameSignal>();

  private m_interface_container : PIXI.Container = new PIXI.Container();


  constructor (private m_config : GameConfig) {
    this.m_board_controller = new BoardController();
    this.m_unit_queue = new UnitQueue();
    this.m_renderer = CreateRenderer(this.m_config);
    //this.loadNextMisison();
  }

  public loadMap = (path : string) : Promise<any> => {
    return LoadBoard(path).then(board_data => {
      this.m_board_controller.initBoard(board_data);

      this.setupListeners();

      this.m_board_controller.sendToRenderer(this.m_renderer);

      this.onSetupComplete();

      return;
    });
  }

  public addUnits = (units : IUnit[]) => {
    _.forEach(units, this.m_board_controller.addUnit);
  }


  private setupListeners = () => {
    this.m_board_controller.on("CREATE_UNIT", (data : ICreateUnitActionData) => {
      this.m_unit_queue.addUnit(data.unit);
      let renderable = this.m_renderer.addEntity(data.unit);
      renderable.render(getAsset(data.unit));
    });

    this.m_board_controller.on("UNIT_KILLED", (data : IActionData) => {
      this.m_unit_queue.removeUnit(data.entity_id);
    })

    this.m_board_controller.on("UNIT_CREATED", (data : ICreateUnitActionData) => {
      let health_bar = new HealthBar(data.unit.id, this.m_board_controller, this.m_renderer);
      this.m_renderer.effects_container.addChild(health_bar.sprite);
    });

    this.on("SET_PLUGIN", (data : { id : number, plugin : RENDER_PLUGIN}) => {
      this.m_renderer.getRenderable(data.id).setPlugin(data.plugin);
    });


  }

  public loadNextMisison = () => {
    LoadMission('assets/data/missions/001.json').then(mission_data => {
        
      this.m_board_controller.sendToRenderer(this.m_renderer);

      this.onSetupComplete();
    }); 
  }
  
  private onSetupComplete = () => {
    this.m_config.pixi_app.stage.addChild(this.m_renderer.stage);
    this.m_config.pixi_app.stage.addChild(this.m_renderer.effects_container);

    this.m_config.pixi_app.stage.addChild(this.m_interface_container);

    let highlighter = new TileHighlighter(this.m_renderer, this.m_board_controller);
    this.m_config.pixi_app.ticker.add(highlighter.update);

    EffectsManager.init(this.m_renderer);
  }

  
  public startGame = () => {
    this.m_board_controller.executeActionStack().then(this.startTurn);
  }

  private startTurn = () => {
    let id : number = this.m_unit_queue.getNextQueued();
    let unit = this.m_board_controller.getUnit(id);

    if (!unit) {
      console.log('no units');
      return;
    }

      new EnemyTurn(id, this.m_board_controller, this.onTurnComplete);   

  }

  public addInterfaceElement(element : PIXI.Container) {
    this.m_interface_container.addChild(element);
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

  private onTurnComplete = () => {
    this.startTurn();
  }

}