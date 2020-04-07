import * as PIXI from 'pixi.js'
import { IEntity, IAssetInfo } from '../../scene/Entity'
import AssetManager from '../../../game/assets';
import { RENDER_PLUGIN } from '../../../game/extras/plugins';

export type RenderableType = "TILE" | "SPRITE" | "ANIMATED_SPRITE";

export type EntityID = number;

export class RenderEntity {
  private readonly m_id : EntityID;

  public offsetY : number = 0;
  protected m_container : PIXI.Container;

  protected m_image : PIXI.Sprite | PIXI.AnimatedSprite;

  constructor (id : EntityID) {
    this.m_container = new PIXI.Sprite();
    this.m_container.interactive = this.m_container.buttonMode = true;

    this.m_id = id;
    
    this.m_image = new PIXI.Sprite();
    this.m_container.addChild(this.m_image);
  }
  public get id() : EntityID{
    return this.m_id;
  }

  public render = (asset_info : IAssetInfo) => {
    switch (asset_info.type) {
      case "SPRITE" : 
        this.setSprite(asset_info.name);
        break;
      case "ANIMATED_SPRITE" :
        this.setAnimatedSprite(asset_info.name);
        break;
      case "EFFECT" :
        this.setEffect(asset_info.name);
    }
  }
  
  public setPlugin = (plugin_name : RENDER_PLUGIN) => {
    this.m_image.pluginName = plugin_name;
  }
  public resetPlugin = () => {
    this.m_image.pluginName = 'batch';
  }

  public setSprite = (asset_name : string) => {
    this.m_container.removeChildren();
    this.m_container.addChild(this.m_image = new PIXI.Sprite(AssetManager.getTile(asset_name)));
  }

  public setAnimatedSprite = (animation_name : string) => {
    this.m_container.removeChildren();

    let animation_data = AssetManager.getAnimatedSprite(animation_name);
    let animated_sprite = new PIXI.AnimatedSprite(animation_data, true);
    animated_sprite.position.set(3, -7);
    animated_sprite.play();
    this.m_image = animated_sprite;
    this.m_container.addChild(animated_sprite);
  }

  public setEffect = (effect_name : string) => {

  }

  public get sprite() : PIXI.Container {
    return this.m_container;
  }
  
  public setPosition(x : number, y : number) {
    this.m_container.position.set(x,y + this.offsetY);
  }
}