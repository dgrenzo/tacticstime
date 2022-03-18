import * as _ from 'lodash';
import { GameBoard } from '../../board/GameBoard';
import { ITile } from '../../board/Tile';
import { IUnit } from '../../board/Unit';
import { IPathTile } from '../../pathfinding/Pathfinding';
import { BoardActionUI } from "./BoardActionUI";
import { IMoveActionData, IMoveAction } from './executors/action/Movement';

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

export class MoveActionUI extends BoardActionUI {
  protected m_options : IPathTile[];

  constructor(protected m_active_unit : IUnit, protected m_board : GameBoard) {
    super(m_active_unit, m_board);
    // this.m_options = this.m_controller.getMoveOptions(this.m_active_unit);  
  }


  public getAction = (tile : ITile) : IMoveAction[] => {
    return null;
    // let option = this.getOptionFromTile(tile);
    // return option ? this.toMoveAction(option) : null;
  }
  
  // private toMoveAction(path : IPathTile) : IMoveAction[] {
  //   let action : IMoveAction[] = [];
    
  //   while (path) {
  //     action.unshift({
  //       type : "MOVE",
  //       data : {
  //         entity_id : this.m_active_unit.id,
  //         move : {
  //           to : {
  //             x : path.tile.pos.x,
  //             y : path.tile.pos.y,
  //           }
  //         }
  //       }
  //     });
  //     path = path.last;
  //   }
  //   return action;
  // }

  // private getOptionFromTile(tile : ITile) {
  //   let path : IPathTile = null;
  //   _.forEach(this.m_options, option => {
  //     if (option.tile === tile) {
  //       path = option as any;
  //       return false;
  //     }
  //     return true;
  //   });
  //   return path;
  // }
}
