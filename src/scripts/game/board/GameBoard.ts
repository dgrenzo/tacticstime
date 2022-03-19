import * as _ from 'lodash';
import { List } from 'immutable';
import { ITile, TILE_DEF, isTile } from './Tile';
import { IImmutableScene, Scene } from '../../engine/scene/Scene';
import { IEntity, isEntity } from '../../engine/scene/Entity';
import { IUnit, isUnit } from './Unit';
import { IUnitDef } from '../assets/UnitLoader';
import { ExecuteMove, IMoveAction } from '../play/action/executors/action/Movement';
import { ExecuteAbility, IAbilityAction } from '../play/action/executors/action/Ability';
import { ExecuteDamage, IDamageAction, IDamageDealtAction } from '../play/action/executors/action/Damage';
import { ExecuteKilled } from '../play/action/executors/action/Killed';
import { ExecuteCreateUnit, ICreateUnitAction, IUnitCreatedAction } from '../play/action/executors/action/CreateUnit';
import { ExecuteSummonUnit, ISummonUnitAction } from '../play/action/executors/action/SummonUnit';
import { TypedEventEmitter } from '../../engine/listener/TypedEventEmitter';
import { GameAura, IAuraConfig, IAuraElement } from '../play/action/auras/GameAura';
import { IRangeDef } from '../play/action/ActionEffect';


export interface IActionData {
  [index : string] : any,
  entity_id ?: number,
}

export interface IGameAction {
  type : keyof IGameEvent,
  data : IActionData
}

export interface IActionResult<T extends IGameAction = IGameAction> {
  action : T,
  scene : IImmutableScene,
}

export interface IGameEvent {
  MOVE : IActionResult<IMoveAction>,
  ABILITY : IActionResult<IAbilityAction>,
  DAMAGE : IActionResult<IDamageAction>,
  HEAL : IActionResult<IGameAction>,
  DAMAGE_DEALT : IActionResult<IDamageDealtAction>,
  SUMMON_UNIT : IActionResult<ISummonUnitAction>,
  CREATE_UNIT : IActionResult<ICreateUnitAction>,
  UNIT_CREATED : IActionResult<IUnitCreatedAction>,
  UNIT_KILLED : IActionResult<IGameAction>
}


export interface IBoardConfig {
  layout : {
    width : number,
    height : number,
    tiles : TILE_DEF[],
  }
}

export interface IBoardPos {
  x : number,
  y : number,
}

export class GameBoard extends Scene {

  private m_events = new TypedEventEmitter<IGameEvent>();

  constructor() {
    super();
  }

  public get events () {
    return this.m_events;
  }


  public init (board_config : IBoardConfig) {
    _.forEach(board_config.layout.tiles, (tile, index) => {
      let pos : IBoardPos = {
        x : index % board_config.layout.width,
        y : Math.floor(index / board_config.layout.width)
      }
      this.scene = GameBoard.AddElement(this.scene, CreateTile(pos, tile));
    });
  }

  public static ExecuteActionStack (scene : IImmutableScene, event_watcher ?: TypedEventEmitter<IGameEvent>) {
    do {
      const action = GameBoard.GetNextAction(scene);
      
      if (!action) {
        return scene;
      }
      scene = GameBoard.ExecuteNextAction(scene);

      if (event_watcher) {
        console.log(action.type, action.data);
        event_watcher.emit(action.type, { action, scene });
      }

    } while (true);
  }

  public static ExecuteActionListeners(scene: IImmutableScene) : IImmutableScene {

    const sent_ids : number[] = [];
    let finished = false;
    do {
      const action = GameBoard.GetNextAction(scene);
      const action_listeners = GameBoard.GetListeners(scene).get(action.type);

      if (!action_listeners) {
        break;
      }

      let index = 0;
      let next : IAuraElement;
      let sent = false;
      do {
        next = action_listeners.get(index, null);
        const listener_id : number = next.id;
        if (sent_ids.indexOf(listener_id) > -1) {
          index ++;
        } else {

          scene = GameAura.ExecuteAuraListener(scene, next.config);
          sent = true;

          sent_ids.push(listener_id);
        }
        if (index >= action_listeners.count() -1) {
          finished = true;
        }

      } while(!finished && !sent);



    } while (!finished);





    return scene;
  }

  public static ExecuteNextAction(scene : IImmutableScene) : IImmutableScene {
    if (!GameBoard.GetNextAction(scene)) {
      return scene; 
    }

    scene = GameBoard.ExecuteActionListeners(scene);

    const action = GameBoard.GetNextAction(scene);
    
    switch (action.type) {
      case "MOVE" :
        scene = ExecuteMove(action as IMoveAction, scene);
        break;
      case "ABILITY" : 
        scene = ExecuteAbility(action as IAbilityAction, scene);
        break;
      case "DAMAGE" : 
        scene = ExecuteDamage(action as IDamageAction, scene);
        break;
      case "UNIT_KILLED" :
        scene = ExecuteKilled(action as IGameAction, scene);
        break;
      case "CREATE_UNIT" :
        scene = ExecuteCreateUnit(action as ICreateUnitAction, scene);
        break;
      case "SUMMON_UNIT" :
        scene = ExecuteSummonUnit(action as ISummonUnitAction, scene);
        break;
    }

    scene = GameBoard.ShiftFirstAction(scene);
    return scene;
  }

  public static GetTilesInRange(scene : IImmutableScene, pos : IBoardPos, range : IRangeDef) {
    const tiles = GameBoard.GetTiles(scene);
    return tiles.filter( tile => {
      let distance = Math.abs(tile.pos.x - pos.x) + Math.abs(tile.pos.y - pos .y);
      return range.max >= distance && range.min <= distance;
    });
  }

  public static GetTiles(scene : IImmutableScene) {
    return Scene.GetElements(scene).filter(element => {
      return isTile(element);
    }).toList() as List<ITile>;
  }

  public static GetNextAction(scene : IImmutableScene) : IGameAction {
    const actions = Scene.GetActions(scene);
    return actions.first();
  }

  public static ShiftFirstAction(scene : IImmutableScene) : IImmutableScene {
    const actions = Scene.GetActions(scene);
    return Scene.SetActions(scene, actions.shift());
  }

  public static SetEntityPosition(scene : IImmutableScene, entity_id : number, pos : IBoardPos) : IImmutableScene {
    const elements = Scene.GetElements(scene);
    const result = elements.setIn([entity_id, 'pos'], pos);
    return Scene.SetElements(scene, result);
  }

  public static GetEntitiesAt(scene : IImmutableScene, pos : IBoardPos) : List<IEntity> {
    const elements = Scene.GetElements(scene);
    const entities = elements.filter(isEntity);
    return entities.filter( entity => {
      return pos && entity.pos.x === pos.x && entity.pos.y === pos.y
     }).toList();
  }

  public static SetHP(scene : IImmutableScene, entity_id : number, hp : number) {
    const elements = Scene.GetElements(scene);
    const result = elements.setIn([entity_id, 'status', 'hp' ], hp);

    return Scene.SetElements(scene, result);
  }

  public static SetMP(scene : IImmutableScene, entity_id : number, mana : number) {
    const elements = Scene.GetElements(scene);
    const result = elements.setIn([entity_id, 'status', 'mana' ], mana);

    return Scene.SetElements(scene, result);
  }

  public static UpdateAction(scene : IImmutableScene, index, action : IGameAction) : IImmutableScene {
    let actions = Scene.GetActions(scene);
    actions = actions.remove(index);
    actions = actions.insert(index, action);

    return GameBoard.SetActions(scene, actions);
  }

  public static AddActions(scene : IImmutableScene, game_actions : IGameAction | IGameAction[]) : IImmutableScene {
    game_actions = _.concat(game_actions);

    let actions = Scene.GetActions(scene);
    const result = actions.concat(game_actions);

    return Scene.SetActions(scene, result);
  }


  public static GetUnitAtPosition = (scene : IImmutableScene, pos : IBoardPos) : IUnit => {
    let unit : IUnit = null;
    GameBoard.GetEntitiesAt(scene, pos).forEach( element => {
      if (isUnit(element)) {
        unit = element;
        return false;
      }
      return true;
    })
    return unit;
  }

  public static GetTileAtPosiiton = (scene : IImmutableScene, pos : IBoardPos) : ITile => {
    let tile : ITile = null;
    GameBoard.GetEntitiesAt(scene, pos).forEach(element => {
      if (isTile(element)) {
        tile = element;
        return false;
      }
      return true;
    });
    return tile;
  }

  public static GetUnit = (scene : IImmutableScene, id : number) : IUnit => {
    const elements = Scene.GetElements(scene);
    return elements.get(id) as IUnit;
  }
  
  public static GetUnits = (scene : IImmutableScene) : List<IUnit> => {
    const elements = Scene.GetElements(scene);
    return elements.filter( element => {
      return isUnit(element);
    }).toList() as List<IUnit>;
  }
}

let _ID : number = 0;

export function CreateEntity() : IEntity {
  return {
    id : _ID ++,
    element_type : "ENTITY",
    pos : {
      x : 0,
      y : 0,
    }
  }
}
export function CreateEffect() : IEntity {
  return {
    id : _ID ++,
    element_type : "EFFECT",
    pos : {
      x : 0,
      y : 0,
    }
  }
}

export function CreateAura(config : IAuraConfig) : IAuraElement {
  const aura = {
    element_type : "AURA",
    id : _ID ++,
    config : _.cloneDeep(config) 
  };

  aura.config.config = {};

  return aura;
}

export function CreateUnit(def : IUnitDef, faction ?: string) : IUnit {
  const entity = CreateEntity() as IUnit;
  
  entity.element_type = "UNIT";

  entity.data = {
    unit_level : 1,
    unit_type : def.display.sprite,
    faction,
  };

  entity.base_stats = _.cloneDeep(def.stats);
  entity.stats = _.cloneDeep(def.stats);
  entity.status = {
    mana : 0,
    hp : def.stats.hp,
  };

  entity.auras = _.cloneDeep(def.auras);
  entity.abilities = _.concat(_.cloneDeep(def.abilities), "wait");

  return entity;
}


function CreateTile(pos : IBoardPos, type : TILE_DEF) : ITile {
  return {
    id : _ID ++,
    element_type : "TILE",
    pos : pos,
    data : {
      tile_type : type,
    }
  }
}