import { IImmutableScene } from "../../../../engine/scene/Scene";



export class GameAura {
  public static RegisterAura(scene : IImmutableScene, aura : IAuraDef) : IImmutableScene{
 



    return scene;
  }

  public static UnregisterAura(scene : IImmutableScene, aura : IAuraDef) : IImmutableScene {


    return scene;
  }
}

const divine_shield_config : IAuraConfig = {
  unique : true,
  config : {
    "BEARER_ID" : 256,
  },
  trigger : {
    action : "DAMAGE",
    where : [
      ["ACTION.source.id", "EQUALS", "AURA_CONFIG.BEARER_ID"]
      // ["entity_id", "EQUALS", "BEARER_ID"]
    ]
  },
  effects : 
  [
    {
      type : "SET_VALUE",
      data : {
        value_src : "ACTION.amount",
        value : 5
      }
    }
    // ,
    // {
    //   type : "DISPELL",
    //   data : {
    //     target : "AURA_THIS"
    //   }
    // }
  ]
}

export interface IAuraConfig {
  unique ?: boolean,
  config : {

  },
  trigger : {
    action : string,
    where : string[][]
  }
  effects : {
    type : string,
    data : {
    }
  }[]
}


interface IAuraEffect {
  type : "string",
  data : IAuraConfig,
}

interface IModifyStatEffect {
  type : "MODIFY_STAT",
  data : {
    stat : "hp" | "strength" | "speed" | "magic",
  }
}

export interface IAuraDef {
  effects : IAuraEffect[]
}

interface IActiveAuraDef extends IAuraDef {
  type : "ACTIVE",
}

interface IPassiveAuraDef extends IAuraDef {
  type : "PASSIVE",
}

const s_aura_map : Map<string, IAuraDef> = new Map();
