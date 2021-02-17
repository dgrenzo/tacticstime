import { BaseMenu } from "./BaseMenu";

export class ReplayMenu extends BaseMenu {  
  constructor(private m_callback : ()=>void) {
    super();

    this.MakeButton('Complete', this.OnCompletePressed);
  }

  private OnCompletePressed = () => {
    
    this.m_callback();
  }
  
}