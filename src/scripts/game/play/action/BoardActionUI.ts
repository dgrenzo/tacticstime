import { ITile } from '../../board/Tile';
import { IUnit } from '../../board/Unit';
import { BoardController } from "../../board/BoardController";
import { IGameAction } from './ActionStack';

enum UNIT_COLLISION {
  NONE = 0,
  ALL,
  ENEMY,
  ALLY,
}

export interface IBoardOption {
  [index : string] : any,
  tile : ITile,
}

export abstract class BoardActionUI {
  protected m_options : IBoardOption[];

  constructor(protected m_active_unit : IUnit, protected m_controller : BoardController) {
  }
  
  public get options() {
    return this.m_options;
  }
  
  public abstract getAction(tile : ITile) : IGameAction[];
}
