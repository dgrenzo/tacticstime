import * as PIXI from 'pixi.js'
import * as _ from 'lodash'

import { PlayerParty } from '../party';
import AssetManager from '../assets/AssetManager';
import { CreateUnit } from '../board/GameBoard';
import { UnitLoader } from '../assets/UnitLoader';
import { ITile } from '../board/Tile';
import { TypedEventEmitter } from '../../engine/listener/TypedEventEmitter';
import { IGameControllerEvents } from '../GameController';
import { UNIT_TYPE } from '../assets/AssetList';


let TIER_ONE : UNIT_TYPE[] = [
 "guard",
 "knight_green",
 "dwarf",
 "oldman",
 "basic_bow",
 "basic_axe",
]

function GetRandomRecruit() : UNIT_TYPE {
  let index = Math.floor(Math.random() * TIER_ONE.length) % TIER_ONE.length;
  return TIER_ONE[index];
}

export class Tavern {
  private m_container = new PIXI.Container();

  private m_player : PlayerParty;
  private m_available_slots = 5;
  private m_available_recruits : RecruitableButton[] = [];

  constructor (m_parent_container : PIXI.Container, private m_events : TypedEventEmitter<IGameControllerEvents>) {
    m_parent_container.addChild(this.m_container);
    this.m_container.scale.set(4);
    this.m_container.position.set(16, 16);

    this.render();

    this.m_events.on('RESIZE', this.positionContainer);

    this.m_events.once('LEAVE_TAVERN', () => {
      this.m_events.off('RESIZE', this.positionContainer);
      this.clearRecruits();
      m_parent_container.removeChild(this.m_container);
    });

    this.refreshRecruits();
  }

  public positionContainer = (dimensions : {width : number, height : number}) => {
    this.m_container.position.set(dimensions.width / 2 - this.m_container.width / 2, dimensions.height - 175);
  }

  public setPlayer = (player : PlayerParty) => {
    this.m_player = player;
  }

  public get sprite () {
    return this.m_container;
  }

  private onRefreshClicked = () => {
    if (this.m_player.chargeGold(1)) {
      this.clearRecruits();
      this.refreshRecruits();
    }
  }

  public refreshRecruits = () => {
    for (let i = 0; i < this.m_available_slots; i ++) {
      let type : UNIT_TYPE = GetRandomRecruit();
      let btn = new RecruitableButton(type);
      this.m_container.addChild(btn.sprite);
      btn.sprite.position.set(i * 24, 0);
      btn.on(this.onButtonClicked);

      this.m_available_recruits.push(btn);
    }
  }

  private onButtonClicked = (btn : RecruitableButton) => {
    if (this.m_player.chargeGold(3)) {
      btn.onPurchase();

      let unit_def = UnitLoader.GetUnitDefinition(btn.type)
      let unit = CreateUnit(unit_def, "PLAYER");

      let free_space;
      let attempts = 6000;
      do {
        free_space = true;
        unit.pos.x = 5 + Math.round(Math.random() * 7);
        unit.pos.y = 10 + Math.round(Math.random() * 3);

        this.m_player.units.forEach(other => {
          if (unit.pos.x === other.pos.x && unit.pos.y === other.pos.y) {
            free_space = false;
          }
          return free_space;
        });
        attempts --;
      } while (!free_space && attempts > 0);

      if (attempts === 0) {
        this.m_player.addGold(3);
        return;
      }

      this.m_player.addUnit(unit);
      this.m_events.emit("UNIT_HIRED", { unit })
    }
  }

  private render = () => {
    let finished_btn : PIXI.Container = new PIXI.Container();
    finished_btn.addChild(
      new PIXI.Graphics()
      .beginFill(0x666666)
      .lineStyle(1, 0x333333)
      .drawRect(0,0, 24, 8)
    );
    let label = new PIXI.Text("DONE",
      {
        fill : 0xFFFFFF,
        fontWeight : 'bold'
      }
    );
    label.anchor.set(0.5,0.5);
    label.scale.set(0.25);
    label.position.set(12, 4)

    finished_btn.addChild(label)
    finished_btn.position.set(46, 25);
    finished_btn.interactive = finished_btn.buttonMode = true;

    finished_btn.on('pointertap', () => {
      this.m_events.emit("LEAVE_TAVERN");
    });
    this.m_container.addChild(finished_btn);
  }

  private clearRecruits = () => {
    _.forEach(this.m_available_recruits, btn => {
      btn.destroy();
    });
    this.m_available_recruits = [];
  }

  public sellUnit = (unit : RecruitableUnit) => {

  }

  public buyUnit = (unit : RecruitableUnit) => {

  }

  public onTileDown = (tile : ITile) => {
    
  }

  public destroy = () => {

  }
}

export class RecruitableButton {
  private m_container : PIXI.Container;

  private m_locked : boolean = false;

  private m_tint : PIXI.Graphics;
  private m_animated_sprite : PIXI.AnimatedSprite;

  constructor(public readonly type : UNIT_TYPE) {
    this.m_container = new PIXI.Container();
    this.m_container.interactive = true;

    let animation_data = AssetManager.getAnimatedSprite(this.type + "_idle")
    this.m_animated_sprite = new PIXI.AnimatedSprite(animation_data);
    this.m_animated_sprite.position.set(1,0);

    let bg = new PIXI.Graphics()
    .beginFill(0xCCCFFF)
    .lineStyle(2, 0x333333, 1, 1)
    .drawRect(0, 0, 19, 19)
    .beginFill(0xAAAA99)
    .lineStyle(0)
    .drawRect(0, 13, 19, 6)
    .beginFill(0x999988)
    .drawRect(2, 14, 12, 3)
    .endFill()

    this.m_container.addChild(bg);
    this.m_container.addChild(this.m_animated_sprite);

    this.m_tint = new PIXI.Graphics()
    .beginFill(0x333355, 0.3)
    .drawRect(0,0, 19, 19)
    .endFill();
    this.m_container.addChild(this.m_tint);

    this.unlock();
  }

  public destroy = () => {
    this.m_animated_sprite.destroy();
    this.m_container.removeChildren();
    this.m_container.removeAllListeners();
  }

  public locked = () : boolean => {
    return this.m_locked;
  }

  public onPurchase = () => {
    this.lock();
    this.m_container.addChild(new PIXI.Graphics()
    .beginFill(0xCCCCAA)
    .lineStyle(2, 0x333333, 1, 1)
    .drawRect(0, 0, 19, 19)
    .beginFill(0xAAAA99)
    .lineStyle(0)
    .drawRect(0, 13, 19, 6),

    new PIXI.Graphics()
    .beginFill(0x333388, 0.5)
    .drawRect(0,0, 19, 19)
    .endFill());
  }

  public lock = () => {
    this.m_locked = true;
    this.m_tint.alpha = 1;
    this.m_container.off('pointermove', this.hover);
    this.m_container.buttonMode = false;
  }

  public unlock = () => {
    this.m_locked = false;
    this.m_container.on('pointermove', this.hover);
    this.m_container.buttonMode = true;
  }

  public on = (callback : (type : RecruitableButton)=>void) => {
    this.m_container.on('pointertap' , () => {
      if (!this.m_locked) {
        callback(this);
      }
    })
  }

  private hover = (evt : PIXI.interaction.InteractionEvent) => {
    if (this.locked()) {
      return;
    }
    let local = this.m_container.toLocal(evt.data.global);

    if (local.x >= 0 && local.y >= 0 && local.x <= 19 && local.y <= 19) {
      this.m_tint.alpha = 0;
      this.m_animated_sprite.play();
    } else {
      this.m_tint.alpha = 1;
      this.m_animated_sprite.stop();
    }
  }

  public get sprite() : PIXI.Container {
    return this.m_container;
  }
}

export class RecruitableUnit {
  constructor (private m_type : UNIT_TYPE) {

  }


  public get type () : UNIT_TYPE {
    return this.m_type;
  }
}