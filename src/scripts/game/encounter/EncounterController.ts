import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { List } from 'immutable';

import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";
import { UnitQueue } from "../play/UnitQueue";
import { GameConfig } from "../GameController";
import { LoadBoard } from "../board/Loader";
import { CreateRenderer } from "../../engine/render/render";
import { ICreateUnitAction } from "../play/action/executors/action/CreateUnit";
import EffectsManager from "../effects/EffectsManager";
import { EnemyTurn } from "../play/EnemyTurn";
import { IUnit } from '../board/Unit';
import { BoardAnimator } from '../animation/BoardAnimator';
import { HealthBar } from '../play/interface/HealthBar';
import TilePointerEvents, { ITilePointerEvents } from '../extras/TilePointerEvents';
import { GameBoard, IActionResult } from '../board/GameBoard';
import { IImmutableScene } from '../../engine/scene/Scene';
import { TypedEventEmitter } from '../../engine/listener/TypedEventEmitter';

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

  private m_container : PIXI.Container;

  private m_board : GameBoard;

  private m_renderer : SceneRenderer;
  private m_animator : BoardAnimator;

  private m_unit_queue : UnitQueue;

  private m_events = new TypedEventEmitter<EncounterEvents>();

  private m_interface_container : PIXI.Container = new PIXI.Container();

  constructor (private m_config : GameConfig) {

    this.m_board = new GameBoard();

    this.m_renderer = CreateRenderer(this.m_config);
    this.m_animator = new BoardAnimator(this.m_renderer, this.m_board);

    this.m_unit_queue = new UnitQueue();
  }

  public loadMap = (path : string) : Promise<void> => {

    return LoadBoard(path).then(board_data => {
      this.m_board.init(board_data);
      
      this.setupListeners();

      this.m_renderer.initializeScene(this.m_board);

      this.onSetupComplete();

      return;
    });
  }

  public loadGameRules = (path : string) : Promise<void> => {
    return Promise.resolve();
  }

  public addUnit = (unit : IUnit) => {
    let create_action : ICreateUnitAction = {
      type : "CREATE_UNIT",
      data : {
        unit
      }
    }
    this.m_board.scene = GameBoard.AddActions(this.m_board.scene, create_action);
  }
  
  public addUnits = (units : List<IUnit>) => {
    units.forEach(this.addUnit);
  }


  private setupListeners = () => {
    const events = this.m_board.events;

    events.on("CREATE_UNIT", (result : IActionResult<ICreateUnitAction>) => {
      const data = result.action.data;
      this.m_unit_queue.addUnit(data.unit);
    });

    events.on("UNIT_KILLED", (result : IActionResult) => {
      const data = result.action.data;
      this.m_unit_queue.removeUnit(data.entity_id);
    })

    events.on("UNIT_CREATED", (result : IActionResult) => {
      const data = result.action.data;
      let health_bar = new HealthBar(data.unit.id, this.m_animator, this.m_renderer);
      this.m_renderer.effects_container.addChild(health_bar.sprite);
    });
  }


  private onSetupComplete = () => {
    this.m_container = new PIXI.Container();    
    this.m_container.position.set(-100, -100);

    this.m_container.addChild(this.m_renderer.stage);
    this.m_container.addChild(this.m_renderer.effects_container);
    this.m_container.addChild(this.m_interface_container);

    this.m_config.pixi_app.stage.addChild(this.m_container);

    EffectsManager.init(this.m_renderer);
  }

  public async executeTurn(scene : IImmutableScene = this.m_board.scene) {
    let events = this.m_board.events;

    scene = GameBoard.ExecuteActionStack(scene, events);

    this.m_board.scene = scene;

    if (!this.m_animator.hasQueuedAnimations()) {
      console.log('no animations');
      return;
    }

    await this.m_animator.start();
  }
  
  public startGame = async () => {
    this.events.emit("START", this);
    await this.executeTurn();
    await this.startTurn();
  }

  private startTurn = async () => {

    if (this.checkVictory()) {
      this.events.emit("END", this);
      return;
    }

    let id : number = this.m_unit_queue.getNextQueued();
    let scene = this.m_board.scene;

    const unit = GameBoard.GetUnit(scene, id);
    if (!unit) {
      console.log('no units');
      return;
    }

    scene = await EnemyTurn.FindBestMove(scene, unit.id).then(scene => { return scene });

    await this.executeTurn(scene);

    this.onTurnComplete();   
  }

  private checkVictory = () : boolean => {
    let units = GameBoard.GetUnits(this.m_board.scene);
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
  
  public get events () {
    return this.m_events;
  }

  public destroy = () => {
    this.m_config.pixi_app.stage.removeChild(this.m_container);
    this.m_renderer.reset();
  }

  private onTurnComplete = () => {
    this.startTurn();
  }

}