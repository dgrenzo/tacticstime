import { BaseMenu } from "./BaseMenu";

export class MainMenu extends BaseMenu {  
  constructor() {
    super();

    this.MakeButton('Start', this.OnStartPressed);
  }

  private OnStartPressed = () => {

  }
  
}