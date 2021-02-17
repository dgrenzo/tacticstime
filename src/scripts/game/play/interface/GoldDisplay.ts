import * as PIXI from 'pixi.js'

export class GoldDisplay {

  constructor (container : PIXI.Container, game_events : PIXI.utils.EventEmitter) {
    let text_style = {
      fontSize : 24,
      fill : 0xFFFF00,
      stroke : 0x333333,
      strokeThickness : 4,
    }
    let text = new PIXI.Text('0', text_style);

    container.addChild(text);

    game_events.on('SET_GOLD', (data) => {
      text.text = data.amount + '';
    })

  }
}