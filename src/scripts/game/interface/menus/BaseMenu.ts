import * as PIXI from 'pixi.js';
import { Button } from "../Button";

export class BaseMenu {
  protected m_container : PIXI.Container;
  protected m_offset_y : number = 0;
  
  constructor() {
    this.m_container = new PIXI.Container();

  }

  protected MakeButton = (label : string, callback : () => void) => {
    const btn = new Button(label, callback, 200, 40);
    btn.container.position.y = this.m_offset_y;
    this.m_offset_y += 60;
    this.m_container.addChild(btn.container); 
  }

  public get container () {
    return this.m_container;
  }
  
}