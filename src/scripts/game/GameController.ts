import * as _ from 'lodash';

import * as PIXI from 'pixi.js';
import { GameBoard, CreateUnit } from "./board/GameBoard";
import { RenderMode, CreateRenderer } from '../engine/render/render';
import { FSM } from '../engine/FSM';
import { SceneRenderer, getAsset } from '../engine/render/scene/SceneRenderer';
import { EventManager } from '../engine/listener/event';
import { LoadMission } from './board/Loader';
import { PlayerTurn } from './play/PlayerTurn';
import { GameEvent, IActionData } from './play/action/ActionStack';
import { RENDER_PLUGIN } from './extras/plugins';
import { UnitQueue } from './play/UnitQueue';
import { BoardController } from './board/BoardController';
import { EnemyTurn } from './play/EnemyTurn';
import EffectsManager from './effects';
import { ICreateUnitActionData } from './play/action/executors/action/CreateUnit';
import { HealthBar } from './play/interface/HealthBar';
import TileHighlighter from './extras/TileHighlighter';
import { UnitLoader } from './assets/UnitLoader';
import { EncounterController } from './encounter/EncounterController';
import { Tavern } from './tavern';
import { PlayerParty } from './party';
import { IUnit } from './board/Unit';
import { UNIT_TYPE } from './types/units';

export type GameConfig = {
  pixi_app : PIXI.Application,
  mode : RenderMode.ISOMETRIC,
}

export enum GameState {
  SETUP = 0,
  BATTLE,
  POST,
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

  private m_states : GameBoard[];

  private m_player_party : PlayerParty;

  constructor(private m_config : GameConfig) {
    this.m_fsm = new FSM();
    m_config.pixi_app.ticker.add(this.m_fsm.update);
    

    UnitLoader.LoadUnitDefinitions().then(() => {
      //new EncounterController(this.m_config);

      let tavern = new Tavern();
      this.m_player_party = new PlayerParty();

      tavern.setPlayer(this.m_player_party);
      
      this.m_config.pixi_app.stage.addChild(tavern.sprite);

      tavern.on("LEAVE_TAVERN", () => {
        this.m_config.pixi_app.stage.removeChild(tavern.sprite);

        this.startNextEncounter();


      })

    })
  }

  private startNextEncounter = () => {
    let encounter = new EncounterController(this.m_config);
    encounter.loadMap('assets/data/boards/coast.json').then ( () => {

      let units : IUnit[] = [];

      this.m_player_party.units.forEach((recruit, index) => {
        let unit_def = UnitLoader.GetUnitDefinition(recruit.type);
        let unit = CreateUnit({
          unit : unit_def,
          pos : {
            x : 4 + index,
            y : 12
          }
        }, "PLAYER");
        units.push(unit);
      })
      encounter.addUnits(units);

      units = [];
      let types : UNIT_TYPE[] = ["lizard", "mooseman", "rhino"]
      let amount = Math.round(Math.random()*5) + 3;
      for (let i = 0; i < amount; i ++) {
        units.push(CreateUnit({
          unit : UnitLoader.GetUnitDefinition(types[Math.floor(Math.random() * 3)]),
          pos : {
            x : 7 + i,
            y : 7,
          }
        }, "ENEMY"));
      }
      encounter.addUnits(units);

      encounter.startGame();

    });
  }

  
}