import { List, Map } from 'immutable'
import { IUnit } from '../board/Unit';

export class PlayerParty {
  
  private m_units : List<IUnit> = List();
  private m_gold : number = 10;

  constructor() {

  }

  public get units () : List<IUnit> {
    return this.m_units;
  }

  public addUnit = (unit : IUnit) => {
    this.m_units = this.m_units.push(unit);
  }


  public chargeGold = (amount : number) : boolean => {
    if (this.m_gold >= amount) {
      this.m_gold -= amount;
      return true;
    } else {
      return false;
    }
  }
}