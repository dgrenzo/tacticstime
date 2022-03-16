import * as _ from 'lodash';

import { IAbilityDef } from "../../abilities";
import { IImmutableScene, Scene } from '../../../../../engine/scene/Scene';
import { IUnit } from '../../../../board/Unit';
import { ITile } from '../../../../board/Tile';
import { GameBoard, IActionData, IGameAction } from '../../../../board/GameBoard';

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
  _.forEach(effects, effect => {

    const tiles = GameBoard.GetTilesInRange(scene, action.data.target.pos, effect.range);
    tiles.forEach(tile => {

      let data = _.cloneDeep(effect.data);
      data = _.defaults(data, {tile, source : action.data.source});

      let unit = GameBoard.GetUnitAtPosition(scene, tile.pos);
      if (unit) {
        scene = GameBoard.AddActions(scene, {
          type : effect.type,
          data : _.defaults(data, {entity_id : unit.id})
        } as IGameAction);
      } else {
        scene = GameBoard.AddActions(scene, {
          type : effect.type,
          data
        } as IGameAction);
      }
    });
  });

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