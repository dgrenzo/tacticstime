import { AssetInfo } from "../../assets";

let id_ticker = 0;

export interface IEntityInfo {
  asset : AssetInfo,
  depth : number,
  id : number,
}

export abstract class Entity {
  public readonly id = id_ticker ++;
  protected readonly depth_offset : number = 0;

  constructor (public x : number, public y : number) {
  }

  public GetInfo() : IEntityInfo {
    return {
      asset : this.getAssetInfo(),
      depth : this.depth_offset,
      id : this.id
    };
  }

  protected getAssetInfo() : AssetInfo {
    return {
      name : 'grass_empty.png'
    }
  }
}