
type AuraType = "ACTIVE" | "PASSIVE";


interface IAuraEffect {
  type : "string",
  data : any,
}

interface IModifyStatEffect {
  type : "MODIFY_STAT",
  data : {
    stat : "hp" | "strength" | "speed" | "magic",
  }
}

interface IAuraDef {
  type : AuraType,
  effects : any[]
}

interface IActiveAuraDef extends IAuraDef {
  type : "ACTIVE",
}

interface IPassiveAuraDef extends IAuraDef {
  type : "PASSIVE",
}

const s_aura_map : Map<string, IAuraDef> = new Map();
