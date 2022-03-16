import * as _ from 'lodash';
import { List } from 'immutable';
import { ITile, TILE_DEF, isTile } from './Tile';
import { IImmutableScene, Scene } from '../../engine/scene/Scene';
import { IEntity } from '../../engine/scene/Entity';
import { IUnit, isUnit } from './Unit';
import { IRangeDef } from '../play/action/abilities';
import { IUnitDef } from '../assets/UnitLoader';
import { ExecuteMove, IMoveAction } from '../play/action/executors/action/Movement';
import { ExecuteAbility, IAbilityAction } from '../play/action/executors/action/Ability';
import { ExecuteDamage, IDamageAction, IDamageDealtAction } from '../play/action/executors/action/Damage';
import { ExecuteKilled } from '../play/action/executors/action/Killed';
import { ExecuteCreateUnit, ICreateUnitAction, IUnitCreatedAction } from '../play/action/executors/action/CreateUnit';
import { ExecuteSummonUnit, ISummonUnitAction } from '../play/action/executors/action/SummonUnit';
import { EventManager } from '../../engine/listener/event';


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

  private m_event_manager = new EventManager<IGameEvent>();
  constructor() {
    super();
  }

  public on = <Key extends keyof IGameEvent>(event_name : Key, cb : (action_result:IGameEvent[Key]) => void) => {
    this.m_event_manager.add(event_name, cb);
  }

  public off = <Key extends keyof IGameEvent>(event_name : Key, cb : (action_result:IGameEvent[Key]) => void) => {
    this.m_event_manager.remove(event_name, cb);
  }

  public emit = <Key extends keyof IGameEvent>(event_name : Key, action_result ?: IGameEvent[Key]) => {
    return this.m_event_manager.emit(event_name, action_result);
  }

  public get events () {
    return this.m_event_manager;
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

  public static ExecuteActionStack (scene : IImmutableScene, event_watcher ?: EventManager<IGameEvent>) {
    do {
      const action = GameBoard.GetNextAction(scene);
      
      if (!action) {
        return scene;
      }
      scene = GameBoard.ShiftFirstAction(scene);
      scene = GameBoard.ExecuteAction(scene, action);

      if (event_watcher) {
        console.log(action);
        event_watcher.emit(action.type, { action, scene });
      }
    } while (true);
  }

  public static ExecuteAction(scene : IImmutableScene, action : IGameAction) : IImmutableScene {
    if (!action) {
      return scene;
    }
    
    switch (action.type) {
      case "MOVE" :
        return ExecuteMove(action as IMoveAction, scene);
      case "ABILITY" : 
        return ExecuteAbility(action as IAbilityAction, scene);
      case "DAMAGE" : 
        return ExecuteDamage(action as IDamageAction, scene);
      case "UNIT_KILLED" :
        return ExecuteKilled(action as IGameAction, scene);
      case "CREATE_UNIT" :
        return ExecuteCreateUnit(action as ICreateUnitAction, scene);
      case "SUMMON_UNIT" :
        return ExecuteSummonUnit(action as ISummonUnitAction, scene);
      default :
        return scene;
    }
  }

  public static GetTilesInRange(scene : IImmutableScene, pos : IBoardPos, range : IRangeDef) {
    const tiles = GameBoard.GetTiles(scene);
    return tiles.filter( tile => {
      let distance = Math.abs(tile.pos.x - pos.x) + Math.abs(tile.pos.y - pos .y);
      return range.max >= distance && range.min <= distance;
    });
  }

  public static GetTiles(scene : IImmutableScene) {
    return Scene.GetElements(scene).filter( element => {
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

  public static SetElementPosition(scene : IImmutableScene, entity_id : number, pos : IBoardPos) : IImmutableScene {
    const elements = Scene.GetElements(scene);
    const result = elements.setIn([entity_id, 'pos'], pos);
    return Scene.SetElements(scene, result);
  }

  public static GetElementsAt(scene : IImmutableScene, pos : IBoardPos) : List<IEntity> {
    const elements = Scene.GetElements(scene);
    return elements.filter( entity => {
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

  public static AddActions(scene : IImmutableScene, game_actions : IGameAction | IGameAction[]) : IImmutableScene {
    game_actions = _.concat(game_actions);

    let actions = Scene.GetActions(scene);
    const result = actions.concat(game_actions);

    return Scene.SetActions(scene, result);
  }


  public static GetUnitAtPosition = (scene : IImmutableScene, pos : IBoardPos) : IUnit => {
    let unit : IUnit = null;
    GameBoard.GetElementsAt(scene, pos).forEach( element => {
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
    GameBoard.GetElementsAt(scene, pos).forEach(element => {
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
    entity_type : "ENTITY",
    pos : {
      x : 0,
      y : 0,
    }
  }
}
export function CreateEffect() : IEntity {
  return {
    id : _ID ++,
    entity_type : "EFFECT",
    pos : {
      x : 0,
      y : 0,
    }
  }
}

export function CreateUnit(def : IUnitDef, faction ?: string) : IUnit {
  return {
    id : _ID ++,
    entity_type : "UNIT",
    pos : {
      x : -1,
      y : -1,
    },
    data : {
      unit_level : 1,
      unit_type : def.display.sprite,
      faction,
    },
    stats : _.cloneDeep(def.stats),
    status : {
      mana : 0,
      hp : def.stats.hp,
    },
    abilities : _.concat(_.cloneDeep(def.abilities), "wait"),
  }
}

function CreateTile(pos : IBoardPos, type : TILE_DEF) : ITile {
  return {
    id : _ID ++,
    entity_type : "TILE",
    pos : pos,
    data : {
      tile_type : type,
    }
  }
}