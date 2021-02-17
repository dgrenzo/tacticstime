import { List } from 'immutable'
import { IUnit } from '../board/Unit';

export class PlayerParty {
  private m_units : List<IUnit> = List();
  private m_gold : number = 0;
  constructor(private m_events : PIXI.utils.EventEmitter) {
    this.addGold(10);
  }

  public get units () : List<IUnit> {
    return this.m_units;
  }

  public addUnit = (unit : IUnit) => {
    this.m_units = this.m_units.push(unit);
  }


  public addGold = (amount : number) : number => {
    this.changeGold(amount);
    return this.m_gold;
  }

  public chargeGold = (amount : number) : boolean => {
    if (this.m_gold >= amount) {
      this.changeGold(-amount);
      return true;
    } else {
      return false;
    }
  }

  private changeGold = (amount : number) => {
    this.m_gold += amount
    this.m_events.emit("SET_GOLD", { amount : this.m_gold });
  }
}