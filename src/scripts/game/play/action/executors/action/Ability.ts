import * as _ from 'lodash';

import { IAbilityDef } from "../../abilities";
import { IImmutableScene, Scene } from '../../../../../engine/scene/Scene';
import { IUnit } from '../../../../board/Unit';
import { ITile } from '../../../../board/Tile';
import { GameBoard, IActionData, IGameAction } from '../../../../board/GameBoard';
import { ActionEffect } from '../../ActionEffect';

export interface IAbilityAction extends IGameAction {
  type : "ABILITY",
  data : IAbilityActionData,
}

export interface IAbilityActionData extends IActionData {
  source : IUnit,
  target : ITile,
  ability : IAbilityDef,
}

export function ExecuteAbility(action : IAbilityAction, scene : IImmutableScene):IImmutableScene {

  const effects = action.data.ability.effects;

  const context = {
    action
  }

  for (let i = 0; i < effects.length; i ++) {
    const effect = effects[i];
    scene = ActionEffect.ExecuteEffect(scene, effect, context);
  }

  const unit_id = action.data.source.id;
  let mana = action.data.source.status.mana;

  if (action.data.ability.cost > 0) {
    mana -= action.data.ability.cost;
  } else {
    mana += 2;
  }

  scene = GameBoard.SetMP(scene, unit_id, mana);

  return scene;
}