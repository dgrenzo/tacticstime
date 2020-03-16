import * as PIXI from 'pixi.js'
import { IEntityInfo } from '../../scene/Entity'

export interface IFilterOptions {
  highlight : boolean,
}

export type EntityID = number;

export class REntity {
  public readonly id : EntityID;
  public offsetY : number = 0;
  protected m_sprite : PIXI.Sprite;

  protected m_image : PIXI.Sprite;

  constructor (info : IEntityInfo, tex : PIXI.Texture) {
    this.m_sprite = new PIXI.Sprite();
    this.m_sprite.interactive = this.m_sprite.buttonMode = true;

    this.id = info.id;
    
    this.m_image = new PIXI.Sprite();
    this.m_sprite.addChild(this.m_image);
    this.setSprite(tex);
  }

  public setSprite = (tex : PIXI.Texture) => {
    this.m_image.texture = tex;
  }

  public setFilter = (filter : IFilterOptions) => {
    if (filter.highlight) {
      this.sprite.alpha = 0.5;
    } else {
      this.sprite.alpha = 1;
    }
  }


  public get sprite() : PIXI.Sprite {
    return this.m_sprite;
  }
  
  public setPosition(x : number, y : number) {
    this.m_sprite.position.set(x,y + this.offsetY);
  }
  
}