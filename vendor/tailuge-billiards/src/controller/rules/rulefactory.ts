import { NineBall } from "./nineball"
import { EightBall } from "./eightball"
import { ChineseEightBall } from "./chineseeightball"
import { Rules } from "./rules"
import { Snooker } from "./snooker"
import { ThreeCushion } from "./threecushion"

export class RuleFactory {
  static create(ruletype, container): Rules {
    switch (ruletype) {
      case "threecushion":
        return new ThreeCushion(container)
      case "eightball":
        return new EightBall(container)
      case "chinese8ball":
        return new ChineseEightBall(container)
      case "snooker":
        return new Snooker(container)
      default:
        return new NineBall(container)
    }
  }
}
