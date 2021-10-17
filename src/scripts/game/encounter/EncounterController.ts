import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { List } from 'immutable';

import { BoardController } from "../board/BoardController";
import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { UnitQueue } from "../play/UnitQueue";
import { EventManager } from "../../engine/listener/event";
import { GameConfig } from "../GameController";
import { LoadBoard } from "../board/Loader";
import { CreateRenderer } from "../../engine/render/render";
import { ICreateUnitActionData } from "../play/action/executors/action/CreateUnit";
import { IActionData } from "../play/action/ActionStack";
import EffectsManager from "../effects/EffectsManager";
import { EnemyTurn } from "../play/EnemyTurn";
import { IUnit } from '../board/Unit';
import { BoardAnimator } from '../animation/BoardAnimator';
import { HealthBar } from '../play/interface/HealthBar';
import TilePointerEvents, { ITilePointerEvents } from '../extras/TilePointerEvents';

export enum EncounterState {
  INIT = 0,
  PLANNING,
  BATTLE,
  RESULT,
  CLEANUP
}


export interface IEncounterControllerEvent {
  START : EncounterController,
  END : EncounterController,
}

interface EncounterEvents extends IEncounterControllerEvent, ITilePointerEvents {};

export class EncounterController {  
  private m_board_controller : BoardController;

  private m_renderer : SceneRenderer;
  private m_animator : BoardAnimator;

  private m_unit_queue : UnitQueue;
  private m_event_manager = new EventManager<EncounterEvents>();

  private m_interface_container : PIXI.Container = new PIXI.Container();

  constructor (private m_config : GameConfig) {
    this.m_board_controller = new BoardController();
    this.m_unit_queue = new UnitQueue();
    this.m_renderer = CreateRenderer(this.m_config);
    this.m_animator = new BoardAnimator(this.m_renderer, this.m_board_controller);

    const tile_events = new TilePointerEvents(this.m_renderer, this.m_board_controller, this.m_event_manager);
   }

  public loadMap = (path : string) : Promise<void> => {

    return LoadBoard(path).then(board_data => {
      this.m_board_controller.initBoard(board_data);

      this.setupListeners();

      this.m_board_controller.sendToRenderer(this.m_renderer);
      this.m_board_controller.setAnimator(this.m_animator);

      this.onSetupComplete();

      return;
    });
  }

  public addUnit = (unit : IUnit) => {
    this.m_board_controller.addUnit(unit)
  }
  
  public addUnits = (units : List<IUnit>) => {
    units.forEach(this.m_board_controller.addUnit);
  }


  private setupListeners = () => {
    this.m_board_controller.on("CREATE_UNIT", (data : ICreateUnitActionData) => {
      this.m_unit_queue.addUnit(data.unit);
    });

    this.m_board_controller.on("UNIT_KILLED", (data : IActionData) => {
      this.m_unit_queue.removeUnit(data.entity_id);
    })

    this.m_board_controller.on("UNIT_CREATED", (data : ICreateUnitActionData) => {
      let health_bar = new HealthBar(data.unit.id, this.m_board_controller, this.m_renderer);
      this.m_renderer.effects_container.addChild(health_bar.sprite);
    });
  }


  private onSetupComplete = () => {
    this.m_config.pixi_app.stage.addChild(this.m_renderer.stage);
    this.m_config.pixi_app.stage.addChild(this.m_renderer.effects_container);
    this.m_config.pixi_app.stage.addChild(this.m_interface_container);

    // let highlighter = new TileHighlighter(this.m_renderer, this.m_board_controller);
    // this.m_config.pixi_app.ticker.add(highlighter.update);

    EffectsManager.init(this.m_renderer);
  }

  public executeStack = () => {
    return this.m_board_controller.executeActionStack(); 
  }
  
  public startGame = () => {
    this.emit("START", this);
    this.m_board_controller.executeActionStack().then(this.startTurn);
  }

  private startTurn = () => {

    if (this.checkVictory()) {
      this.emit("END", this);
      
      return;
    }

    let id : number = this.m_unit_queue.getNextQueued();
    let unit = this.m_board_controller.getUnit(id);

    if (!unit) {
      console.log('no units');
      return;
    }
    new EnemyTurn(id, this.m_board_controller, this.onTurnComplete);   
  }

  private checkVictory = () : boolean => {
    let units = this.m_board_controller.getUnits();
    let remaining_teams = [];
    units.forEach(unit => {
      if (unit.data.faction && remaining_teams.indexOf(unit.data.faction) === -1)
      {
        remaining_teams.push(unit.data.faction);
      }
    });
    if (remaining_teams.length < 2) {
      return true;
    }

    return false;
  }

  public addInterfaceElement(element : PIXI.Container) {
    this.m_interface_container.addChild(element);
  }
  
  public on = <Key extends keyof IEncounterControllerEvent>(event_name : Key, cb : (data:IEncounterControllerEvent[Key]) => void) => {
    this.m_event_manager.add(event_name, cb);
  }
  public off = <Key extends keyof IEncounterControllerEvent>(event_name : Key, cb : (data:IEncounterControllerEvent[Key]) => void) => {
    this.m_event_manager.remove(event_name, cb);
  }
  public emit = <Key extends keyof IEncounterControllerEvent>(event_name : Key, data :IEncounterControllerEvent[Key]) => {
    this.m_event_manager.emit(event_name, data);
  }

  public destroy = () => {
    this.m_config.pixi_app.stage.removeChild(this.m_renderer.stage);
    this.m_config.pixi_app.stage.removeChild(this.m_renderer.effects_container);
    this.m_config.pixi_app.stage.removeChild(this.m_interface_container);
    this.m_renderer.reset();
  }

  private onTurnComplete = () => {
    this.startTurn();
  }

}