import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { IAssetInfo } from '../../engine/scene/Entity';

const iso_spritesheet : string = 'assets/images/isometric/all.json';
const iso_tiles : string = 'assets/images/isometric/iso.json';

export default class AssetManager {

  private static _instance : AssetManager;

  private loader : PIXI.Loader;
  private m_tilesheet : PIXI.Spritesheet;
  private m_spritesheet : PIXI.Spritesheet;
  private m_animationMap : Map<string, PIXI.AnimatedSprite.FrameObject[]> = new Map();

  private constructor() {
    let loader = this.loader = new PIXI.Loader();
    loader.add(iso_spritesheet);
    loader.add(iso_tiles);

    AssetManager._instance = this;
  }

  public static getTile(name : string) {
    return AssetManager._instance.m_tilesheet.textures[name];
  }

  public static getAnimatedSprite(name : string) {
    return AssetManager._instance.m_animationMap.get(name);
  }


  public static getEffect(asset_info : IAssetInfo) {
    let effect = new PIXI.Container();
    effect.position.set(9, 2);

    //let text = new PIXI.Text(asset_info.data.amount + '', 
    let text = new PIXI.Text("99", 
    { 
      fill : 0xFFFFCC, 
      size : 24,
      stroke : 0x000000,
      strokeThickness : 4,
      fontWeight : 'bolder',
    });
    text.scale.set (0.00);
    text.anchor.set(0.5);

    effect.addChild(text);

    return effect;
  }

  public static init = (onLoaded : ()=>void) => {
    let manager = new AssetManager();
    manager.load(onLoaded);
  }

  private load = (cb : ()=>void) => {
    this.loader.load((loader : PIXI.Loader, resources : PIXI.IResourceDictionary) => {
      this.m_tilesheet = resources[iso_tiles].spritesheet;
      this.m_spritesheet = resources[iso_spritesheet].spritesheet;


      //build timed animations
      _.forEach( _.keys(this.m_spritesheet.animations), animation_name => {
        let sheet = this.m_spritesheet;
        let animation : PIXI.AnimatedSprite.FrameObject[] = [];
        let textures : PIXI.Texture[] = sheet.animations[animation_name];
        let data = resources[iso_spritesheet].data;
        _.forEach(textures, tex => {
          animation.push({
            texture : tex,
            time : data.frames[tex.textureCacheIds[0]].frame.time,
          })
        })
        AssetManager._instance.m_animationMap.set(animation_name, animation);

      })

      cb();
    });
  }
}
