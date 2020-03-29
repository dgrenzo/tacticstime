import { Unit } from "../board/Unit";
import * as _ from 'lodash';

interface IQueuedUnit  {
  unit : Unit,
  next : IQueuedUnit
}

export class UnitQueue {

  private m_root : IQueuedUnit = {
    next : null,
    unit : null,
  }

  private m_current : IQueuedUnit = this.m_root;

  constructor() {

  }

  public addUnits = (units : Unit[]) => {
    _.forEach(units, this.addUnit);
  }

  public addUnit = (unit : Unit) => {
    let parent = this.m_root;

    while (parent.next && parent.next.unit.getSpeed() >= unit.getSpeed()) {
      parent = parent.next;
    }
    let next = parent.next;

    parent.next = {
      unit,
      next,
    }
  }

  public getNextQueued = () : Unit => {
    this.m_current = this.m_current.next;
    if (this.m_current) {
      return this.m_current.unit;
    }
    return null;
  }
}