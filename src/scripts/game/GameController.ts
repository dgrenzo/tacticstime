import * as _ from 'lodash';

import * as PIXI from 'pixi.js';
import { CreateUnit } from "./board/GameBoard";
import { RenderMode } from '../engine/render/render';
import { UnitLoader } from './assets/UnitLoader';
import { EncounterController } from './encounter/EncounterController';
import { Tavern } from './tavern/Tavern';
import { PlayerParty } from './party';
import { GoldDisplay } from './play/interface/GoldDisplay';
import { ReplayMenu } from './interface/menus/ReplayMenu';
import { IUnit } from './board/Unit';
import { AuraLoader } from './assets/AuraLoader';
import { TypedEventEmitter } from '../engine/listener/TypedEventEmitter';
import { UNITS, UNIT_TYPE } from './assets/AssetList';

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
// export type GameSignal = GameEvent | PlaySignal | RenderSignal | "TILE_CLICKED";

export interface IGameControllerEvents {
  LEAVE_TAVERN : null,
  UNIT_HIRED : { unit : IUnit },
  UPDATE : number,
  RESIZE : { width : number, height : number }
}

export class GameController {

  public static DEBUG = false;

  private m_events = new TypedEventEmitter<IGameControllerEvents>();
  private m_player_party : PlayerParty;
  private m_encounter : EncounterController;

  constructor(private m_config : GameConfig) {

    m_config.pixi_app.ticker.add(this.update);

    this.m_config.pixi_app.renderer.on('resize', this.onResize);
    
    this.init();
  }

  private async init() {

    await AuraLoader.LoadAuraDefinitions();
    await UnitLoader.LoadUnitDefinitions();

    new GoldDisplay(this.m_config.pixi_app.stage, this.m_events);

    this.m_events.on('LEAVE_TAVERN', () => {
      this.startNextEncounter();
    });
    
    this.m_events.on('UNIT_HIRED', (data) => {
      const unit : IUnit = data.unit;
      this.m_encounter.addUnit(unit);
      this.m_encounter.executeTurn();
    });

    
    this.m_player_party = new PlayerParty(this.m_events);
    this.startNextTavern();
  }

  private update = (deltaTime : number) => {
    this.m_events.emit("UPDATE", deltaTime);
  }

  private onResize = () => {
    this.m_events.emit("RESIZE", {
      width : this.m_config.pixi_app.renderer.width,
      height : this.m_config.pixi_app.renderer.height,
    });
  }

  private startNextTavern = () => {
    this.m_encounter = new EncounterController(this.m_config);

    this.m_encounter.loadMap('assets/data/boards/coast.json').then (() => {
      let tavern = new Tavern(this.m_config.pixi_app.stage, this.m_events);

      // this.m_encounter.on("TILE_DOWN", (tile:ITile) => {
      //   tavern.onTileDown(tile);
      // });
      
      tavern.setPlayer(this.m_player_party);
  
      tavern.positionContainer({
        width : this.m_config.pixi_app.renderer.width,
        height : this.m_config.pixi_app.renderer.height,
      });

      this.m_encounter.addUnits(this.m_player_party.units);
      this.m_encounter.executeTurn();

    });

  }

  private startNextEncounter = () => {
    let types : UNIT_TYPE[] = ["rhino"];//["lizard", "mooseman", "rhino"]
    let amount = 3;//Math.round(Math.random()*5) + 3;
    for (let i = 0; i < amount; i ++) {
      let enemy = CreateUnit(UnitLoader.GetUnitDefinition(types[Math.floor(Math.random() * types.length)]), "ENEMY");
      enemy.pos.x = 7 + i;
      enemy.pos.y = 7;
      
      this.m_encounter.addUnit(enemy);
    }

    this.m_encounter.startGame();
    this.m_encounter.events.on('END', (encounter) => {
       this.m_player_party.addGold(6);

      let replay : ReplayMenu;
      const onEnd = () => {
        this.m_config.pixi_app.stage.removeChild(replay.container);
        encounter.destroy();
        this.startNextTavern();
      }
      replay = new ReplayMenu(onEnd);
      this.m_config.pixi_app.stage.addChild(replay.container);
    });
  }
}