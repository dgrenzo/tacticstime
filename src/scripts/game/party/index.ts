import { List, Map } from 'immutable'
import { RecruitableUnit } from '../tavern';

export class PlayerParty {
  private m_units : List<RecruitableUnit> = List();
  private m_gold : number = 10;
  constructor() {

  }

  public addUnit = (unit : RecruitableUnit) => {
    this.m_units = this.m_units.push(unit);
  }

  public get units () : List<RecruitableUnit> {
    return this.m_units;
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