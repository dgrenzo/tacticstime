import * as PIXI from 'pixi.js'
import { IAssetInfo } from '../../scene/Entity'
import { RENDER_PLUGIN } from '../../../game/extras/plugins';
import AssetManager from '../../../game/assets/AssetManager';
import { Vector2 } from '../../types';

export type RenderableType = "TILE" | "SPRITE" | "ANIMATED_SPRITE";

export type RenderEntityID = number;

let _RenderEntityID : RenderEntityID = 0;

export class RenderEntity {
  protected m_root : PIXI.Container; //The position of this is set by the renderer
  protected m_container : PIXI.Container; //Used for local offset in animations

  protected m_image : PIXI.Sprite | PIXI.AnimatedSprite;
  
  private m_depth : number = 0;
  private m_depth_offset : number = 0;
  
  private readonly m_id : RenderEntityID;

  constructor () {
    this.m_id = _RenderEntityID ++;
    this.m_root = new PIXI.Container();
    this.m_container = new PIXI.Container();
    this.m_root.addChild(this.m_container);

    
    this.m_image = new PIXI.Sprite();
    this.m_container.addChild(this.m_image);
  }
  public get id() : RenderEntityID{
    return this.m_id;
  }

  public get depth_offset() : number {
    return this.m_depth_offset;
  }

  public get depth() : number{
    return this.m_depth;
  }

  public renderAsset = (asset_info : IAssetInfo) => {
    switch (asset_info.type) {
      case "SPRITE" : 
        this.setSprite(asset_info);
        break;
      case "ANIMATED_SPRITE" :
        this.setAnimatedSprite(asset_info);
        break;
      case "EFFECT" :
        this.setEffect(asset_info);
    }
  }
  
  public setPlugin = (plugin_name : RENDER_PLUGIN) => {
    this.m_image.pluginName = plugin_name;
  }
  public resetPlugin = () => {
    this.m_image.pluginName = 'batch';
  }

  public setSprite = (asset_info : IAssetInfo) => {
    this.m_container.removeChildren();
    this.m_depth_offset = asset_info.depth_offset;
    this.m_container.addChild(this.m_image = new PIXI.Sprite(AssetManager.getTile(asset_info.name)));
  }

  public setAnimatedSprite = (asset_info : IAssetInfo) => {
    this.m_container.removeChildren();
    this.m_depth_offset = asset_info.depth_offset;

    let animation_data = AssetManager.getAnimatedSprite(asset_info.name);
    let animated_sprite = new PIXI.AnimatedSprite(animation_data, true);
    animated_sprite.position.set(3, -7);
    animated_sprite.gotoAndPlay(Math.random() * 200);
    this.m_image = animated_sprite;
    this.m_container.addChild(animated_sprite);
  }

  public setEffect = (asset_info : IAssetInfo) => {
    this.m_container.removeChildren();
    this.m_depth_offset = asset_info.depth_offset;
    this.m_container.addChild(AssetManager.getEffect(asset_info));
  }

  public get root() : PIXI.Container {
    return this.m_root;
  }

  public get sprite() : PIXI.Container {
    return this.m_container;
  }
  
  public setPosition(pos : Vector2, depth : number = 0) {
    this.m_root.position.set(pos.x, pos.y);
    this.m_depth = depth;
  }
}