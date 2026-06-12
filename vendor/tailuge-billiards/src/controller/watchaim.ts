import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { BreakEvent } from "../events/breakevent"
import { WatchShot } from "./watchshot"
import { ControllerBase } from "./controllerbase"

export class WatchAim extends ControllerBase {
  override get name() {
    return "WatchAim"
  }

  constructor(container) {
    super(container)
    this.container.table.cueball = this.container.rules.otherPlayersCueBall()
    this.container.table.cue.moveTo(this.container.table.cueball.pos)
    this.container.view.camera.suggestMode(this.container.view.camera.topView)
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(true)
    if (this.container.rules.rulename === "chinese8ball") {
      this.container.notify({
        type: "Info",
        title: "等待对方击球",
        subtext: "轮到你时按钮会亮起",
      })
    }
  }

  override handleAim(event: AimEvent) {
    this.container.table.cue.aim = event
    this.container.table.cueball.pos.copy(event.pos)
    if (event.cueColor !== undefined) {
      this.container.table.cue.setPaletteFromColor(event.cueColor)
    }
    this.container.table.cue.updateAimInput()
    return this
  }

  override handleBreak(event: BreakEvent) {
    if (event.init) {
      this.container.table.updateFromShortSerialised(event.init)
    }
    return this
  }

  override handleHit(event: HitEvent) {
    this.container.table.updateFromSerialised(event.tablejson)
    this.container.table.cue.updateAimInput()

    return new WatchShot(this.container, event)
  }
}
