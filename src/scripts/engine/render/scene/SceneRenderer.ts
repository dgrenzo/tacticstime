import * as PIXI from 'pixi.js';
import { RenderEntity } from "./RenderEntity";
import { Scene, IElementMap } from '../../scene/Scene';
import { EventManager } from '../../listener/event';
import { isTile, GetTileName } from '../../../game/board/Tile';
import { isUnit } from '../../../game/board/Unit';
import { IEntity } from '../../scene/Entity';


type RendererEvent = "ENTITY_CLICKED" | "POINTER_UP" | "POINTER_DOWN" | "POINTER_MOVE";

export abstract class SceneRenderer {
  protected m_container : PIXI.Container;
  protected m_renderables : Map<number, RenderEntity>;

  protected m_screen_effects_container : PIXI.Container;
  
  
  public abstract readonly TILE_WIDTH : number;
  public abstract readonly TILE_HEIGHT : number;
  public abstract readonly HALF_TILE_WIDTH : number;
  public abstract readonly HALF_TILE_HEIGHT : number;

  protected m_event_manager = new EventManager<RendererEvent>();

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
    this.m_renderables = new Map<number, RenderEntity>();
    this.m_container.removeChildren();
    scene.elements.forEach(element => {
      
      let renderable = this.addEntity(element);
      renderable.render(getAsset(element));


    })
    this.m_pixi.ticker.add(() => {
      this.renderScene(scene);
    });
  }

  public on = (event_name : RendererEvent, cb : (data:any) => void) => {
    this.m_event_manager.add(event_name, cb);
  }
  public off = (event_name : RendererEvent, cb : (data:any) => void) => {
    this.m_event_manager.remove(event_name, cb);
  }

  private renderScene = (scene : Scene) => {
    scene.elements.forEach(element => {
      this.positionElement(this.m_renderables.get(element.id), element.pos.x, element.pos.y);
    });
    this.sortElements(scene.elements);

    this.m_container.render(this.m_pixi.renderer);
  }
  
  public removeEntity = (id : number) : RenderEntity => {
    let renderable = this.m_renderables.get(id);

    if (renderable) {
      this.m_container.removeChild(renderable.sprite);
      this.m_renderables.delete(id);
    }

    return renderable;
  }

  public addEntity = (entity : IEntity) : RenderEntity => {
    let renderable = CreateRenderable(entity);
    this.m_renderables.set(entity.id, renderable);
    return renderable;
  };

  public getRenderable = (id : number) : RenderEntity => {
    return this.m_renderables.get(id);
  }

  public abstract getScreenPosition(x : number, y : number) : {x : number, y : number};
  public abstract positionElement(element : RenderEntity, x : number, y : number):void;
  public abstract sortElements(elements : IElementMap):void;
}

export function getAsset(entity : IEntity) : any {
  if (isTile(entity)) {
    return {
      type : "SPRITE",
      name : GetTileName(entity.data.tile_type),
    }
  } else if (isUnit(entity)) {
    return {
      type : "ANIMATED_SPRITE",
      name : entity.data.unit_type + '_idle',
    }
  }
}

function CreateRenderable(entity : IEntity) : RenderEntity {
  return new RenderEntity(entity.id);
}
  