import * as _ from 'lodash';

import * as PIXI from 'pixi.js';
import { CreateUnit } from "./board/GameBoard";
import { RenderMode } from '../engine/render/render';
import { FSM } from '../engine/FSM';
import { GameEvent } from './play/action/ActionStack';
import { UnitLoader } from './assets/UnitLoader';
import { EncounterController } from './encounter/EncounterController';
import { Tavern } from './tavern';
import { PlayerParty } from './party';
import { UNIT_TYPE } from './types/units';
import { GoldDisplay } from './play/interface/GoldDisplay';
import { ReplayMenu } from './interface/menus/ReplayMenu';

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

  private m_events = new PIXI.utils.EventEmitter();
  private m_player_party : PlayerParty;

  constructor(private m_config : GameConfig) {

    m_config.pixi_app.ticker.add(this.update);

    this.m_config.pixi_app.renderer.on('resize', this.onResize);

    new GoldDisplay(this.m_config.pixi_app.stage, this.m_events);

    UnitLoader.LoadUnitDefinitions().then(() => {
      this.m_player_party = new PlayerParty(this.m_events);

      this.startNextTavern();
    });

    
    this.m_events.on("LEAVE_TAVERN", () => {
      this.startNextEncounter();
    });

  }

  private update = (deltaTime : number) => {
    this.m_events.emit("UPDATE", { deltaTime });
  }

  private onResize = () => {
    this.m_events.emit("RESIZE", {
      width : this.m_config.pixi_app.renderer.width,
      height : this.m_config.pixi_app.renderer.height,
    });
  }

  private startNextTavern = () => {

    let tavern = new Tavern(this.m_config.pixi_app.stage, this.m_events);

    tavern.setPlayer(this.m_player_party);

    tavern.positionContainer({
      width : this.m_config.pixi_app.renderer.width,
      height : this.m_config.pixi_app.renderer.height,
    });

  }

  private startNextEncounter = () => {
    let encounter = new EncounterController(this.m_config);

    encounter.loadMap('assets/data/boards/coast.json').then (() => {
      let units = this.m_player_party.units;

      units.forEach((unit, index) => {
        unit.pos.x = 5 + index;
        unit.pos.y = 12;
      })


    
      let types : UNIT_TYPE[] = ["lizard", "mooseman", "rhino"]
      let amount = Math.round(Math.random()*5) + 3;
      for (let i = 0; i < amount; i ++) {
        let enemy = CreateUnit(UnitLoader.GetUnitDefinition(types[Math.floor(Math.random() * 3)]), "ENEMY");
        enemy.pos.x = 7 + i;
        enemy.pos.y = 7;
        units = units.push(enemy);
      }


      encounter.addUnits(units);
      encounter.startGame();
    });

    encounter.on('END', (encounter) => {
       this.m_player_party.addGold(6);

      let replay : ReplayMenu;
      const onEnd = () => {
        this.m_config.pixi_app.stage.removeChild(replay.container);
        encounter.destroy();
        this.startNextTavern();
      }
      replay = new ReplayMenu(onEnd);
      this.m_config.pixi_app.stage.addChild(replay.container);


    })
  }
}