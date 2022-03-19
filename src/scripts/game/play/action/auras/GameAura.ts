import { IElement } from "../../../../engine/scene/Entity";
import { IImmutableScene } from "../../../../engine/scene/Scene";
import { CreateAura, GameBoard, IGameAction } from "../../../board/GameBoard";
import { ActionEffect, IEffectDef } from "../ActionEffect";

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

    const context = {
      action,
      aura
    }

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

          let from_value = ActionEffect.GetFromPath(scene, context, from);
          let to_value = ActionEffect.GetFromPath(scene, context, to);

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
      scene = ActionEffect.ExecuteEffect(scene, effect, context);
    }


    return scene;
  }

  public static ParsePathAndSet(scene : IImmutableScene, action : IGameAction, aura : IAuraConfig, path : string, value : any) : IImmutableScene {
    // const parts = path.split('.');
    // const last = parts.pop();

    // path = parts.join('.');

    return scene;
  }
}

export type IConfigConst = ["CONST", string | number];
export type IConfigPath = Array<string>;

export type IConfigComparison = [IConfigPath, string, IConfigPath];

export interface IAuraConfig {
  unique ?: boolean,
  value : number,
  config : {
    [key : string] : any
  },
  trigger : {
    action : string,
    where : IConfigComparison[]
  },
  effects : IEffectDef[]
}

interface IModifyStatEffect {
  type : "MODIFY_STAT",
  data : {
    stat : "hp" | "strength" | "speed" | "magic",
  }
}