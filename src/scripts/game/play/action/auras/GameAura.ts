import { IElement } from "../../../../engine/scene/Entity";
import { IImmutableScene } from "../../../../engine/scene/Scene";
import { CreateAura, GameBoard, IGameAction } from "../../../board/GameBoard";

export interface IAuraElement extends IElement {
  config : IAuraConfig,
}

export class GameAura {

  public static RegisterAura(scene : IImmutableScene, aura : IAuraConfig) : IImmutableScene{
    const aura_entity = CreateAura(aura);

    GameBoard.AddElement<IAuraElement>(scene, null);
    return scene;
  }

  public static UnregisterAura(scene : IImmutableScene, aura : IAuraConfig) : IImmutableScene {

    return scene;
  }

  public static ExecuteAuraListener(scene : IImmutableScene, aura : IAuraConfig) : IImmutableScene {
    let action = GameBoard.GetNextAction(scene);

    if (action.type !== aura.trigger.action)
    {
      return scene;
    }

    const conditions = aura.trigger.where;
    for (let i = 0; i < conditions.length; i ++) {
      const where = conditions[i];

      const from = where[0];
      const comparison = where[1];
      const to = where[2];

      switch (comparison) {
        case "EQUALS" :

          let from_value = GameAura.GetFromPath(scene, action, aura, from);
          let to_value = GameAura.GetFromPath(scene, action, aura, to);

          const satisfied = from_value === to_value;
          if (!satisfied) {
            return scene;
          }
          break;
      }
    }

    const effects = aura.effects;

    for (let i = 0; i < effects.length; i ++) {
      const effect = effects[i];

      switch (effect.type) {
        case "UPDATE_ACTION_VALUE" :
          const value = GameAura.GetFromPath(scene, action, aura, effect.data.value);
          action = GameAura.UpdateActionValue(scene, action, aura, effect.data.value_src, value);
          scene = GameBoard.UpdateAction(scene, 0, action)
          break;
      }
    }


    return scene;
  }
  public static UpdateActionValue(scene : IImmutableScene, action : IGameAction, aura : IAuraConfig, path : string, value : any) : IGameAction {
    const parts = path.split('.');
    let data = action.data;
    
    parts.forEach((path, index) => {
      if (index === parts.length - 1) {
        data[path] = value;
      }
      data = data[path];
    });

    return action;
  }

  public static GetFromPath(scene : IImmutableScene, action : IGameAction, aura : IAuraConfig, path : string | number) : any {
    if (typeof path === 'number') {
      return path;
    }
    
    const parts = path.split('.');
    const base = parts.shift();
    let data = null;
    switch (base) {
      case "ACTION" : data = action.data; break;
      case "AURA_CONFIG" : data = aura.config; break;
    }
    parts.forEach((path, index) => {
      data = data[path];
    });

    return data;
  }

  public static ParsePathAndSet(scene : IImmutableScene, action : IGameAction, aura : IAuraConfig, path : string, value : any) : IImmutableScene {
    const parts = path.split('.');
    const last = parts.pop();

    path = parts.join('.');

    return scene;
  }
}

export interface IAuraConfig {
  unique ?: boolean,
  config : {
    [key : string] : any
  },
  trigger : {
    action : string,
    where : string[][]
  },
  effects : {
    type : string,
    data : {
      [key : string] : any
    }
  }[]
}

interface IModifyStatEffect {
  type : "MODIFY_STAT",
  data : {
    stat : "hp" | "strength" | "speed" | "magic",
  }
}