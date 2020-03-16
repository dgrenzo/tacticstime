import * as PIXI from 'pixi.js';
import { REntity } from "./REntity";
import { Scene } from '../../scene/Scene';
import { Entity } from '../../scene/Entity';
import { EventManager } from '../../listener/event';
import AssetManager from '../../../game/assets';


type RendererEvent = "ENTITY_CLICKED" | "POINTER_UP" | "POINTER_DOWN" | "POINTER_MOVE";

export abstract class SceneRenderer {
  protected m_container : PIXI.Container;
  protected m_renderables : Map<number, REntity>;
  
  
  public abstract readonly TILE_WIDTH : number;
  public abstract readonly TILE_HEIGHT : number;
  public abstract readonly HALF_TILE_WIDTH : number;
  public abstract readonly HALF_TILE_HEIGHT : number;

  protected m_eventManager = new EventManager<RendererEvent>();

  constructor(protected m_pixi : PIXI.Application) {
    this.m_container = new PIXI.Container();
  }

  public get stage() {
    return this.m_container;
  }
  
  public initializeScene = (scene : Scene) => {
    this.m_renderables = new Map<number, REntity>();
    this.m_container.removeChildren();
    scene.getElements().forEach(element => {
      let renderable = this.addEntity(element);

      renderable.sprite.on('pointerdown', () => {
        this.m_eventManager.emit("ENTITY_CLICKED", {id : renderable.id});
      });
    })
    this.renderScene(scene);
  }

  public on = (event_name : RendererEvent, cb : (data:any) => void) => {
    this.m_eventManager.add(event_name, cb);
  }
  public off = (event_name : RendererEvent, cb : (data:any) => void) => {
    this.m_eventManager.remove(event_name, cb);
  }

  public renderScene = (scene : Scene) => {
    scene.getElements().forEach(element => {
      this.positionElement(this.m_renderables.get(element.id), element.x, element.y);
    });
    this.sortElements(scene.getElements());
  }
  
  public removeEntity = (entity : Entity) : REntity => {
    let renderable = this.m_renderables.get(entity.id);

    if (renderable) {
      this.m_container.removeChild(renderable.sprite);
      this.m_renderables.delete(entity.id);
    }

    return renderable;
  }

  public addEntity = (entity : Entity) : REntity => {
    let info = entity.GetInfo();

    let tex = AssetManager.getTile(info.asset.name);

    this.m_renderables.set(entity.id, new REntity(info, tex));
    return this.m_renderables.get(entity.id);
  };

  public getRenderable = (id : number) : REntity => {
    return this.m_renderables.get(id);
  }

  public abstract positionElement(element : REntity, x : number, y : number):void;
  public abstract sortElements(elements : Entity[]):void;
}
  