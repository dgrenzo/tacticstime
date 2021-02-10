import * as _ from 'lodash'


export interface IState {
  enter? : () => void,
  exit? : () => void,
  update?: (deltaTime: number) => void
}

interface IFSMState extends IState {
  fsm : FSM,
}

export class FSM {
  private m_state : number;
  private m_state_objects = new Map<number, IFSMState>();

  public registerState = (key : number, state_object : IState) => {
    this.m_state_objects.set(key, _.defaults({
      fsm : this,
    }, state_object));
  }

  public update = (deltaTime: number) => {
    if (this.m_state_objects.get(this.m_state) && this.m_state_objects.get(this.m_state).update)
    {
      this.m_state_objects.get(this.m_state).update(deltaTime);
    }
  }

  public setState = (val : number) => {
    if (this.active_state && this.active_state.exit) {
      this.active_state.exit();
    }
    this.m_state = val;
    if (this.active_state.enter)
    {
      this.active_state.enter();
    }
  }

  private get active_state(): IFSMState {
    return this.m_state_objects.get(this.m_state);
  }

  get state(): number {
    return this.m_state;
  }
}