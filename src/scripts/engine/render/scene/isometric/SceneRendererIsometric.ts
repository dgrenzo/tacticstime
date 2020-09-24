import * as PIXI from 'pixi.js'
import * as _ from 'lodash';
import { RenderEntity, RenderEntityID } from '../RenderEntity';
import { SceneRenderer } from '../SceneRenderer';
import { IEntity } from '../../../scene/Entity';
import { IElementMap } from '../../../scene/Scene';

const TILE_WIDTH : number = 16;
const TILE_HEIGHT : number = 8;

export class SceneRendererIsometric extends SceneRenderer {
  public readonly TILE_WIDTH = TILE_WIDTH;
  public readonly TILE_HEIGHT = TILE_HEIGHT;
  public readonly HALF_TILE_WIDTH = TILE_WIDTH / 2;
  public readonly HALF_TILE_HEIGHT = TILE_HEIGHT / 2;


  constructor (pixi : PIXI.Application) {
    super(pixi);
    this.m_container.position.set(500, 50);
    this.m_container.scale.set(4);
    this.m_screen_effects_container.position.set(500,50);
    this.m_screen_effects_container.scale.set(4);

    pixi.renderer.plugins.interaction.on('pointermove', (evt : PIXI.interaction.InteractionEvent) => {
      this.m_event_manager.emit("POINTER_MOVE", this.screenToTilePos(evt.data.global));
    })

    pixi.renderer.plugins.interaction.on('pointerdown', (evt : PIXI.interaction.InteractionEvent) => {
      if (evt.stopped) {
        return;
      }
      this.m_event_manager.emit("POINTER_DOWN", this.screenToTilePos(evt.data.global));
    })
    pixi.renderer.plugins.interaction.on('pointerup', (evt : PIXI.interaction.InteractionEvent) => {
      this.m_event_manager.emit("POINTER_UP", this.screenToTilePos(evt.data.global));
    })
  }

  public screenToTilePos = (global : PIXI.Point) : {x : number, y : number} => {
    let point = this.m_container.toLocal(global);
    point.y -= 2;
    let game_x = Math.round(point.y / this.TILE_HEIGHT + point.x / this.TILE_WIDTH) - 1;
    let game_y = Math.round(point.y / this.TILE_HEIGHT - point.x / this.TILE_WIDTH);
    return {
      x : game_x,
      y : game_y
    }
  }
  public getScreenPosition = (x : number, y : number) => {
    let point = new PIXI.Point((x - y) * this.HALF_TILE_WIDTH, (x + y) * this.HALF_TILE_HEIGHT);
    return point;
  }

  public positionElement = (element : RenderEntity, pos : { x : number, y : number }) => {
    
    element.setPosition(
      (pos.x - pos.y) * this.HALF_TILE_WIDTH,
      (pos.x + pos.y) * this.HALF_TILE_HEIGHT,
      this.getElementDepth(pos) + element.depth_offset,
    );
    
    this.m_renderables.remove(element);
    let index = this.m_renderables.getFirstIndex((e):boolean => {
      return e.depth > element.depth;
    });
    
    this.m_renderables.insertAt(element, index);
    this.m_container.addChildAt(element.root, index);
  }

  public getProjection = (pos : {x : number, y : number}) : {x: number, y : number} => {
    return {
    x : (pos.x - pos.y),// * this.HALF_TILE_WIDTH,
    y : (pos.x + pos.y),// * this.HALF_TILE_HEIGHT
    }
  }

  public getElementDepth = (pos : {x : number, y : number}) : number => {
    return (pos.x + pos.y);
  }
}