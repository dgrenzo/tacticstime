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
  private _state : number;
  private stateObjects = new Map<number, IFSMState>();

  public registerState = (key : number, stateObject : IState) => {
    this.stateObjects.set(key, _.defaults({
      fsm : this,
    }, stateObject));
  }

  public update = (deltaTime: number) => {
    if (this.stateObjects.get(this._state) && this.stateObjects.get(this._state).update)
    {
      this.stateObjects.get(this._state).update(deltaTime);
    }
  }

  public setState = (val : number) => {
    if (this.stateObjects.get(this._state) && this.stateObjects.get(this._state).exit) {
      this.stateObjects.get(this._state).exit();
    }
    this._state = val;
    if (this.stateObjects.get(this._state).enter)
    {
      this.stateObjects.get(this._state).enter();
    }
  }

  get state(): number {
    return this._state;
  }
}