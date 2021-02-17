
import * as PIXI from 'pixi.js';

const COLOR_FILL = 0xCCFFFF;
const COLOR_LINE = 0x333333;

export class Button {
  private m_container : PIXI.Container;

  private m_sprite : PIXI.Sprite;

  constructor(label : string, callback : ()=>any, width : number, height : number) {
    this.m_container = new PIXI.Container();
    this.m_container.interactive = this.m_container.buttonMode = true;

    this.m_container.on('click', callback);

    let bg = new PIXI.Graphics()
    .beginFill(COLOR_FILL)
    .lineStyle(2, COLOR_LINE)
    .drawRect(0, 0, width, height)
    .endFill()

    this.m_container.addChild(bg);
  }

  public destroy = () => {
    this.m_container.removeChildren();
    this.m_container.removeAllListeners();
  }

  public get container () : PIXI.Container {
    return this.m_container;
  }
}