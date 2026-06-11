import { Vector3 } from "three"
import { Ball } from "../../model/ball"
import { Outcome, OutcomeType } from "../../model/outcome"
import { Session } from "../../network/client/session"
import { EventType } from "../../events/eventtype"
import { Table } from "../../model/table"
import { Rack } from "../../utils/rack"
import { isFirstShot } from "../../utils/utils"
import {
  applyChineseTableGeometry,
  CHINESE_HEAD_STRING,
} from "../../utils/chinese-table"
import { TableGeometry } from "../../view/tablegeometry"
import { EightBall } from "./eightball"

/**
 * 中式八球规则（物理沿用 tailuge/billiards）
 */
export class ChineseEightBall extends EightBall {
  override rulename = "chinese8ball"

  override tableGeometry(): void {
    applyChineseTableGeometry()
  }

  override table(): Table {
    applyChineseTableGeometry()
    const table = new Table(this.rack())
    this.cueball = table.cueball
    return table
  }

  override rack(): Ball[] {
    return Rack.chineseEightBall()
  }

  /** 开球时白球已在开球线上摆好，跳过手动摆球步骤 */
  override allowsPlaceBall(): boolean {
    return !isFirstShot(this.container.recorder)
  }

  override placeBall(target?: Vector3): Vector3 {
    if (target) {
      const max = new Vector3(TableGeometry.tableX, TableGeometry.tableY)
      const min = new Vector3(-TableGeometry.tableX, -TableGeometry.tableY)
      if (isFirstShot(this.container.recorder)) {
        max.setX(CHINESE_HEAD_STRING)
      }
      return target.clone().clamp(min, max)
    }
    return new Vector3(CHINESE_HEAD_STRING, 0, 0)
  }

  private isMyGroup(ball: Ball, type: number): boolean {
    if (type === 1) {
      return (ball.label || 0) >= 1 && (ball.label || 0) <= 7
    }
    if (type === 2) {
      return (ball.label || 0) >= 9 && (ball.label || 0) <= 15
    }
    return false
  }

  private isBreakShot(): boolean {
    const aims = this.container.recorder.entries.filter(
      (e) => e.event.type === EventType.AIM
    ).length
    return aims <= 1
  }

  getRequiredObjectBall(type?: number): Ball | undefined {
    const session = Session.getInstance()
    const effectiveType = type ?? session.p1type
    const table = this.container.table
    const cueball = table.cueball

    if (this.isBreakShot()) {
      return table.balls.find((b) => b.label === 1 && b.onTable())
    }

    if (effectiveType === 0) {
      return undefined
    }

    const myGroup = table.balls.filter(
      (b) =>
        b !== cueball && b.onTable() && this.isMyGroup(b, effectiveType)
    )
    if (myGroup.length > 0) {
      return myGroup.sort((a, b) => (a.label || 0) - (b.label || 0))[0]
    }

    return table.balls.find((b) => b.label === 8 && b.onTable())
  }

  override nextCandidateBall(p1type?: number): Ball | undefined {
    const required = this.getRequiredObjectBall(p1type)
    if (required) {
      return required
    }
    const balls = this.container.table.balls.filter(
      (b) => b !== this.cueball && b.onTable() && b.label !== 8
    )
    if (balls.length === 0) {
      return undefined
    }
    return balls.sort((a, b) => (a.label || 0) - (b.label || 0))[0]
  }

  override foulReason(outcome: Outcome[], type?: number): string | null {
    const table = this.container.table
    const cueball = table.cueball

    if (Outcome.isCueBallPotted(cueball, outcome)) {
      return "白球落袋"
    }

    const firstCollision = Outcome.firstCollision(
      Outcome.cueBallFirst(cueball, outcome)
    )

    if (!firstCollision) {
      return "未击中任何彩球"
    }

    const hitBall = firstCollision.ballB!
    const required = this.getRequiredObjectBall(type)
    const effectiveType = type ?? Session.getInstance().p1type

    if (this.isBreakShot()) {
      if (hitBall.label !== 1) {
        return "开球须先击打 1 号球"
      }
    } else if (required) {
      if (hitBall.label !== required.label) {
        if (required.label === 8) {
          return "未清台不能先打 8 号球"
        }
        return `须先击打 ${required.label} 号球`
      }
    } else if (effectiveType === 0 && hitBall.label === 8) {
      return "未分花色不能先打 8 号球"
    }

    if (Outcome.potCount(outcome) === 0) {
      const firstCollisionIndex = outcome.indexOf(firstCollision)
      const cushionsAfter = outcome
        .slice(firstCollisionIndex + 1)
        .some((o) => o.type === OutcomeType.Cushion)
      if (!cushionsAfter) {
        return "无球入袋且无球碰库"
      }
    }

    if (this.isBreakShot()) {
      const pocketed = Outcome.potCount(outcome) > 0
      if (!pocketed) {
        const cushionBalls = new Set<number>()
        for (const o of outcome) {
          if (
            o.type === OutcomeType.Cushion &&
            o.ballA &&
            o.ballA !== cueball &&
            o.ballA.label
          ) {
            cushionBalls.add(o.ballA.label)
          }
        }
        if (cushionBalls.size < 4) {
          return "开球犯规：至少 4 球碰库或有球入袋"
        }
      }
    }

    return null
  }
}
