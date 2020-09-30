import { EventManager } from "../../engine/listener/event";
import { SceneRenderer } from "../../engine/render/scene/SceneRenderer";

export type ProjectileEvent = "COMPLETE";

export class ProjectileEffect {

  private m_event_emitter : EventManager<ProjectileEvent>;

  constructor (private m_renderer : SceneRenderer) {
    this.m_event_emitter = new EventManager();
  }

  public onComplete = (cb : () => void) => {
    this.m_event_emitter.add("COMPLETE", cb);
  }



}