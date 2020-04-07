import { IEntity } from "./Entity";
import { Map } from 'immutable';

export type IElementMap = Map<number, IEntity>;

export class Scene {
  protected m_elements : Map<number, IEntity> = Map();

  public addElement<T extends IEntity>(element : T) : T {
    this.m_elements = this.m_elements.set(element.id, element);
    return element;
  }

  public get elements() : IElementMap {
    return this.m_elements;
  }
  public set elements(val:IElementMap) {
    this.m_elements = val;
  }

  public getElement = (id : number) : IEntity => {
    return this.m_elements.get(id);
  }

  public removeElement = (id : number) : IEntity => {
    let element = this.getElement(id);
    this.m_elements = this.m_elements.remove(id);
    return element;
  }
}