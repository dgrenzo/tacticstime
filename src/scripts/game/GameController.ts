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
  
  private m_player_party : PlayerParty;

  constructor(private m_config : GameConfig) {
    this.m_fsm = new FSM();
    m_config.pixi_app.ticker.add(this.m_fsm.update);
    

    UnitLoader.LoadUnitDefinitions().then(() => {

      let tavern = new Tavern();
      this.m_player_party = new PlayerParty();

      tavern.setPlayer(this.m_player_party);

      this.m_config.pixi_app.stage.addChild(tavern.sprite);

      m_config.pixi_app.renderer.on("resize", tavern.positionContainer);
      tavern.positionContainer({
        width : m_config.pixi_app.renderer.width,
        height : m_config.pixi_app.renderer.height,
      });

      tavern.on("LEAVE_TAVERN", () => {
        this.m_config.pixi_app.stage.removeChild(tavern.sprite);

        m_config.pixi_app.renderer.off("resize", tavern.positionContainer);
        this.startNextEncounter();
      })
    })
  }

  private startNextEncounter = () => {
    let encounter = new EncounterController(this.m_config);

    encounter.loadMap('assets/data/boards/coast.json').then ( () => {
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
  }
}