import * as PIXI from 'pixi.js';
import { RenderEntity, RenderEntityID } from "./RenderEntity";
import { Scene } from '../../scene/Scene';
import { isTile, GetTileName } from '../../../game/board/Tile';
import { isUnit } from '../../../game/board/Unit';
import { IEntity, IAssetInfo, isEntity } from '../../scene/Entity';
import { RENDER_PLUGIN } from '../../../game/extras/plugins';
import { LinkedList } from '../../list/linkedlist';
import { Vector2 } from '../../types';
import { TypedEventEmitter } from '../../listener/TypedEventEmitter';

export interface ISceneRendererEvent {
  POINTER_UP : Vector2
  POINTER_DOWN : Vector2
  POINTER_MOVE : Vector2
}

export abstract class SceneRenderer {
  
  protected m_container : PIXI.Container;
  protected m_renderables : LinkedList<RenderEntity>;

  protected m_screen_effects_container : PIXI.Container;
  
  
  public abstract readonly TILE_WIDTH : number;
  public abstract readonly TILE_HEIGHT : number;
  public abstract readonly HALF_TILE_WIDTH : number;
  public abstract readonly HALF_TILE_HEIGHT : number;

  protected m_events = new TypedEventEmitter<ISceneRendererEvent>();

  constructor(protected m_pixi : PIXI.Application) {
    this.m_container = new PIXI.Container();
    this.m_screen_effects_container = new PIXI.Container();
  }

  public get pixi() {
    return this.m_pixi;
  }

  public get stage() {
    return this.m_container;
  }

  public get effects_container() {
    return this.m_screen_effects_container;
  }
  
  public initializeScene = (scene : Scene) => {
    this.reset();
    scene.elements.forEach(element => {
      if (!isEntity(element)) {
        return;
      }
      let renderable = this.addEntity(element);
      renderable.renderAsset(getAsset(element));
    })
    this.m_pixi.ticker.add(this.renderScene)
  }

  public on = <Key extends keyof ISceneRendererEvent>(event_name : Key, cb : (data:ISceneRendererEvent[Key]) => void, context ?: any) => {
    this.m_events.on(event_name, cb, context);
  }
  
  public off = <Key extends keyof ISceneRendererEvent>(event_name : Key, cb : (data:ISceneRendererEvent[Key]) => void, context ?: any) => {
    this.m_events.off(event_name, cb, context);
  }

  private renderScene = () => {
    this.m_container.render(this.m_pixi.renderer);
  }
  
  public removeEntity = (id : RenderEntityID) : RenderEntity => {
    let renderable = this.getRenderable(id);
    if (renderable) {
      this.m_container.removeChild(renderable.root);
      this.m_renderables.remove(renderable);
    }
    return renderable;
  }

  public addEntity = (entity : IEntity) : RenderEntity => {
    let renderable = CreateRenderable(entity);
    this.positionElement(renderable, entity.pos);
    return renderable;
  };

  public setPlugin = (id : number, plugin : RENDER_PLUGIN) => {
    this.getRenderable(id).setPlugin(plugin)
  }

  public getSprite = (id : number) => {
    return this.getRenderable(id).sprite;
  }
  
  protected getRenderable = (id : RenderEntityID) : RenderEntity => {
    return this.m_renderables.getFirst((element) => {
      return element.id === id
    });
  }

  public reset = () => {
    this.m_renderables = new LinkedList();
    this.m_container.removeChildren();
    this.m_screen_effects_container.removeChildren();
    this.m_events.removeAllListeners();
    this.m_pixi.ticker.remove(this.renderScene)
  }
  public abstract getProjection(pos : Vector2) : Vector2;
  public abstract getScreenPosition(pos : Vector2) : Vector2;
  public abstract positionElement(element : RenderEntity, pos : Vector2):void;
}

export function getAsset(entity : IEntity) : IAssetInfo {
  if (isTile(entity)) {
    return {
      type : "SPRITE",
      depth_offset : -8,
      scale : 1,
      name : GetTileName(entity.data.tile_type),
    }
  } else if (isUnit(entity)) {
    return {
      type : "ANIMATED_SPRITE",
      scale : (entity.data.unit_level - 1) * 0.25 + 1,
      depth_offset : 2,
      name : entity.data.unit_type + '_idle',
    }
  }
  return null;
}

function CreateRenderable(entity : IEntity) : RenderEntity {
  return new RenderEntity();
}
  