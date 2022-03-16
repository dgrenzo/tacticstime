import { IUnit } from "../board/Unit";
import { List } from 'immutable';
import * as _ from 'lodash';

interface IQueuedUnit  {
  unit : IUnit,
  next : IQueuedUnit
}

export class UnitQueue {

  private m_root : IQueuedUnit = {
    next : null,
    unit : null,
  }

  private m_current : IQueuedUnit = this.m_root;

  public addUnit = (unit : IUnit) => {
    let parent = this.m_root;

    while (parent.next && parent.next.unit.stats.speed >= unit.stats.speed) {
      parent = parent.next;
    }
    let next = parent.next;

    parent.next = {
      unit,
      next,
    }
  }

  public removeUnit = (id : number) => {
    let target = this.m_root;
    while (target && target.next) {
      if (target.next.unit.id === id) {
        target.next = target.next.next;
      }
      target = target.next;
    }
  }

  public getNextQueued = () : number => {
    this.m_current = this.m_current.next;
    if (this.m_current) {
      return this.m_current.unit.id;
    } else if (this.m_root.next) {
      this.m_current = this.m_root;
      return this.getNextQueued();
    }
    return null;
  }
}