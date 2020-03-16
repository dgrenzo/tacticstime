import * as PIXI from 'pixi.js';

const iso_spritesheet : string = 'assets/images/isometric/all.json';
const iso_tiles : string = 'assets/images/isometric/iso.json';

export default class AssetManager {

  private static _instance : AssetManager;

  private loader : PIXI.Loader;
  private m_tilesheet : PIXI.Spritesheet;
  private m_spritesheet : PIXI.Spritesheet;

  private constructor() {
    let loader = this.loader = new PIXI.Loader();
    loader.add(iso_spritesheet);
    loader.add(iso_tiles);

    AssetManager._instance = this;
  }

  public static getTile(name : string) {
    return AssetManager._instance.m_tilesheet.textures[name];
  }

  public static init = (onLoaded : ()=>void) => {
    let manager = new AssetManager();
    manager.load(onLoaded);
  }

  private load = (cb : ()=>void) => {
    this.loader.load((loader : PIXI.Loader, resources : PIXI.IResourceDictionary) => {
      this.m_spritesheet = resources[iso_spritesheet].spritesheet;
      this.m_tilesheet = resources[iso_tiles].spritesheet;
      cb();
    });
  }
}
