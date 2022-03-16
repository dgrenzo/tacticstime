import { IElement, IEntity } from "./Entity";

import { Map, List } from 'immutable';
import { IGameAction } from "../../game/board/GameBoard";

export type IEventDef = {
  uid: number,
  on_event : string,
  on_conditions : any,
}

export type IImmutableScene = Map<string, any>;

export type IElementMap = Map<number, IEntity>;
export type IEventMap = Map<string, List<IElement>>;
export type IActionList = List<IGameAction>;

const KEY_ENTITIES = "ENTITIES";
const KEY_LISTENERS = "LISTENERS";
const KEY_ACTIONS = "ACTIONS";

export class Scene {

  private m_immutable_scene : IImmutableScene;

  constructor() {
    this.m_immutable_scene = Map();

    this.listeners = Map();
    this.elements = Map();
    this.actions = List();
  }

  public addEventListener<T extends IElement>(event_name: string, event : T) : T {
    if (!this.listeners.get(event_name)) {
      this.listeners = this.listeners.set(event_name, List());
    }

    const list = this.listeners.get(event_name);
    
    this.listeners = this.listeners.setIn(event_name, list.push(event));

    return event;
  }

  public removeEventListener<T extends IElement>(event_name: string, event : T) {

  }

  public static GetElements(scene : IImmutableScene) : IElementMap {
    return scene.get(KEY_ENTITIES);
  }

  public static SetElements(scene : IImmutableScene, elements : IElementMap) : IImmutableScene {
    return scene.set(KEY_ENTITIES, elements)
  }

  public static GetListeners(scene : IImmutableScene) : IEventMap {
    return scene.get(KEY_LISTENERS);
  }

  public static SetListeners(scene : IImmutableScene, listeners : IEventMap) : IImmutableScene {
    return scene.set(KEY_LISTENERS, listeners)
  }

  public static GetActions(scene : IImmutableScene) : IActionList {
    return scene.get(KEY_ACTIONS);
  }

  public static SetActions(scene : IImmutableScene, actions : IActionList) : IImmutableScene {
    return scene.set(KEY_ACTIONS, actions)
  }

  public static AddElement<T extends IEntity>(scene : IImmutableScene, element : T) {
    const elements = Scene.GetElements(scene);
    return Scene.SetElements(scene, elements.set(element.id, element));
  }

  public static RemoveElement(scene : IImmutableScene, element : IEntity) {
    const elements = Scene.GetElements(scene);
    return Scene.SetElements(scene, elements.remove(element.id));
  }

  public static RemoveElementById(scene : IImmutableScene, element_id : number) {
    const elements = Scene.GetElements(scene);
    return Scene.SetElements(scene, elements.remove(element_id));
  }

  public get scene() : IImmutableScene {
    return this.m_immutable_scene;
  }

  public get actions() : IActionList {
    return this.m_immutable_scene.get(KEY_ACTIONS);
  }

  public get listeners() : IEventMap {
    return this.m_immutable_scene.get(KEY_LISTENERS);
  }

  public get elements() : IElementMap {
    return this.m_immutable_scene.get(KEY_ENTITIES);
  }

  public set scene(val : IImmutableScene) {
    this.m_immutable_scene = val;
  }

  public set actions(val : IActionList) {
    this.m_immutable_scene = this.m_immutable_scene.set(KEY_ACTIONS, val)
  }

  public set listeners(val : IEventMap) {
    this.m_immutable_scene = this.m_immutable_scene.set(KEY_LISTENERS, val);
  }

  public set elements(val:IElementMap) {
    this.m_immutable_scene = this.m_immutable_scene.set(KEY_ENTITIES, val);
  }

  public getElement = (id : number) : IEntity => {
    return this.elements.get(id);
  }
}