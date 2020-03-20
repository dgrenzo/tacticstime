import * as PIXI from 'pixi.js';
import * as _ from 'lodash';

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
