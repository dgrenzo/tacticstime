import * as PIXI from 'pixi.js'
import * as _ from 'lodash';
import { RenderEntity } from '../RenderEntity';
import { SceneRenderer } from '../SceneRenderer';
import { Vector2 } from '../../../types';

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
      this.m_events.emit("POINTER_MOVE", this.screenToTilePos(evt.data.global));
    })

    pixi.renderer.plugins.interaction.on('pointerdown', (evt : PIXI.interaction.InteractionEvent) => {
      if (evt.stopped) {
        return;
      }
      this.m_events.emit("POINTER_DOWN", this.screenToTilePos(evt.data.global));
    })
    pixi.renderer.plugins.interaction.on('pointerup', (evt : PIXI.interaction.InteractionEvent) => {
      this.m_events.emit("POINTER_UP", this.screenToTilePos(evt.data.global));
    })
  }

  public screenToTilePos = (global : PIXI.Point) : Vector2 => {
    let point = this.m_container.toLocal(global);
    point.y -= 2;
    let game_x = Math.round(point.y / this.TILE_HEIGHT + point.x / this.TILE_WIDTH) - 1;
    let game_y = Math.round(point.y / this.TILE_HEIGHT - point.x / this.TILE_WIDTH);
    return {
      x : game_x,
      y : game_y
    }
  }
  public getScreenPosition = (pos : Vector2) => {
    let point = new PIXI.Point((pos.x - pos.y) * this.HALF_TILE_WIDTH, (pos.x + pos.y) * this.HALF_TILE_HEIGHT);
    return point;
  }

  public positionElement = (element : RenderEntity, pos : Vector2) => {
    
    element.setPosition(
      { 
        x : (pos.x - pos.y) * this.HALF_TILE_WIDTH,
        y : (pos.x + pos.y) * this.HALF_TILE_HEIGHT,
      },
      this.getElementDepth(pos) + element.depth_offset,
    );
    
    this.m_renderables.remove(element);
    let index = this.m_renderables.getFirstIndex((e):boolean => {
      return e.depth > element.depth;
    });
    
    this.m_renderables.insertAt(element, index);
    this.m_container.addChildAt(element.root, index);
  }

  public getProjection = (pos : Vector2) : Vector2 => {
    return {
    x : (pos.x - pos.y),
    y : (pos.x + pos.y)
    }
  }

  public getElementDepth = (pos : Vector2) : number => {
    return (pos.x + pos.y);
  }
}