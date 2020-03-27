import { IGameAction } from "../ActionStack";
import { ExecuteMove } from "./action/Movement";
import { ExecuteStrike, IStrikeAction } from "./action/Strike";
import { GameController } from "../../../GameController";
import { ExecuteDamage, IDamageAction } from "./action/Damage";
import { ExecuteKilled } from "./action/Killed";
import { ExecuteAbility, IAbilityAction } from "./action/Ability";

export function ExecuteGameEvent(action : IGameAction, controller : GameController) : Promise<void> {
  console.log(action);
  switch (action.type) {
    case "MOVE" :
      return ExecuteMove(action.data, controller);
    case "ABILITY" : 
      return ExecuteAbility(action.data as IAbilityAction, controller);
    case "STRIKE" :
      return ExecuteStrike(action.data as IStrikeAction, controller);
    case "DAMAGE" : 
      return ExecuteDamage(action.data as IDamageAction, controller);
    case "UNIT_KILLED" :
      return ExecuteKilled(action.data, controller);


    default :
      return Promise.resolve();
  }

}