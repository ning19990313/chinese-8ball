import { Ball, State } from "../model/ball"
import { SnookerConfig } from "./snookerconfig"
import { TableGeometry } from "../view/tablegeometry"
import { PocketGeometry } from "../view/pocketgeometry"
import { Vector3, Color } from "three"
import { roundVec, vec } from "./three-utils"
import { R } from "../model/physics/constants"
import { Session } from "../network/client/session"
import { BallAppearance } from "../view/ballappearance"
import {
  CHINESE_FOOT_SPOT,
  CHINESE_HEAD_STRING,
} from "./chinese-table"
import { chineseBallColor } from "./ballcolors"

export class Rack {
  static readonly noise = Math.fround(R * 0.023 + 0.0015 * Math.random())
  static readonly gap = 2 * R + 2 * Rack.noise
  static readonly up = new Vector3(0, 0, -1)
  static readonly spot = new Vector3(-TableGeometry.X / 2, 0, 0)
  static readonly across = new Vector3(0, Rack.gap, 0)
  static readonly down = new Vector3(Rack.gap, 0, 0)
  static readonly diagonal = Rack.across
    .clone()
    .applyAxisAngle(Rack.up, (Math.PI * 1) / 3)

  static readonly BALL_COLORS = [
    "#FFFFFF", // 0: 主球
    "#F4C400", // 1: 全色 黄
    "#0044FF", // 2: 全色 蓝
    "#E60000", // 3: 全色 红
    "#9400A8", // 4: 全色 紫
    "#FF5500", // 5: 全色 橙
    "#009944", // 6: 全色 绿
    "#6B3410", // 7: 全色 棕
    "#000000", // 8: 黑
    "#F4C400", // 9: 花色 黄
    "#0044FF", // 10: 花色 蓝
    "#E60000", // 11: 花色 红
    "#9400A8", // 12: 花色 紫
    "#FF5500", // 13: 花色 橙
    "#009944", // 14: 花色 绿
    "#6B3410", // 15: 花色 棕
  ]
  private static jitter(pos) {
    return roundVec(
      pos
        .clone()
        .add(
          new Vector3(
            Rack.noise * (Math.random() - 0.5),
            Rack.noise * (Math.random() - 0.5),
            0
          )
        )
    )
  }

  private static unlabeledAppearance(): BallAppearance | undefined {
    return Session.getLod() > 1 ? "texturedDots" : undefined
  }

  static cueBall(pos, label?: number) {
    return new Ball(
      Rack.jitter(pos),
      0xffffff,
      label,
      Rack.unlabeledAppearance()
    )
  }

  /** 中式八球主球（白球） */
  static chineseCueBall(pos) {
    return new Ball(Rack.jitter(pos), 0xffffff, undefined, "cue")
  }

  /** 中式八球目标球 1–15（带号码） */
  static chineseObjectBall(pos, label: number) {
    const hex = new Color(chineseBallColor(label)).getHex()
    return new Ball(Rack.jitter(pos), hex, label, "projected")
  }

  static swapBallPositions(b1: Ball, b2: Ball) {
    const temp = b1.pos.clone()
    b1.pos.copy(b2.pos)
    b2.pos.copy(temp)
  }

  static diamond() {
    const pos = new Vector3(TableGeometry.tableX / 2, 0, 0)
    const diamond: Ball[] = []
    const newball = (pos: Vector3, color: string, label: number) => {
      return new Ball(Rack.jitter(pos), color, label)
    }
    diamond.push(Rack.cueBall(Rack.spot), newball(pos, Rack.BALL_COLORS[1], 1)) // 1: Yellow
    pos.add(Rack.diagonal)
    diamond.push(newball(pos, Rack.BALL_COLORS[2], 2)) // 2: Blue
    pos.sub(Rack.across)
    diamond.push(newball(pos, Rack.BALL_COLORS[3], 3)) // 3: Red
    pos.add(Rack.diagonal)
    diamond.push(newball(pos, Rack.BALL_COLORS[4], 4)) // 4: Purple
    pos.sub(Rack.across)
    diamond.push(newball(pos, Rack.BALL_COLORS[5], 5)) // 5: Orange
    pos.addScaledVector(Rack.across, 2)
    diamond.push(newball(pos, Rack.BALL_COLORS[6], 6)) // 6: Green
    pos.add(Rack.diagonal).sub(Rack.across)
    diamond.push(newball(pos, Rack.BALL_COLORS[7], 7)) // 7: Maroon
    pos.sub(Rack.across)
    diamond.push(newball(pos, Rack.BALL_COLORS[8], 8)) // 8: Black
    pos.add(Rack.diagonal)
    diamond.push(newball(pos, Rack.BALL_COLORS[9], 9)) // 9: Yellow (Striped)

    // swap 9 ball to center
    Rack.swapBallPositions(diamond[4], diamond[9])
    return diamond
  }

  static triangle() {
    const tp = Rack.trianglePositions()
    const triangle: Ball[] = []
    triangle.push(Rack.cueBall(Rack.spot))

    tp.forEach((p, i) => {
      const label = i + 1
      triangle.push(new Ball(Rack.jitter(p), Rack.BALL_COLORS[label], label))
    })
    Rack.swapBallPositions(triangle[4], triangle[9])
    return triangle
  }

  static trianglePositions() {
    const triangle: Vector3[] = []
    const pos = new Vector3(TableGeometry.X / 2, 0, 0)
    triangle.push(vec(pos))
    // row 2
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    // row 3
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.addScaledVector(this.across, 2)
    triangle.push(vec(pos))
    // row 4
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    // row 5
    pos.add(this.diagonal).sub(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))

    return triangle
  }

  static three() {
    const dx = TableGeometry.X / 2
    const dy = TableGeometry.Y / 4
    const threeballs: Ball[] = [
      Rack.cueBall(Rack.jitter(new Vector3(-dx, -dy, 0))), // Ball 0: White
      new Ball(
        Rack.jitter(new Vector3(-dx, 0, 0)),
        0xffd700,
        undefined,
        Rack.unlabeledAppearance()
      ), // Ball 1: Yellow
      new Ball(
        Rack.jitter(new Vector3(dx, 0, 0)),
        0xff0000,
        undefined,
        Rack.unlabeledAppearance()
      ), // Ball 2: Red
    ]
    return threeballs
  }

  static readonly sixth = (TableGeometry.Y * 2) / 6
  static readonly baulk = (-1.5 * TableGeometry.X * 2) / 5

  static snooker() {
    const balls: Ball[] = []
    const dy = TableGeometry.Y / 4
    balls.push(Rack.cueBall(Rack.jitter(new Vector3(Rack.baulk, -dy * 0.5, 0))))

    const colours = Rack.snookerColourPositions()
    balls.push(
      new Ball(
        Rack.jitter(colours[0]),
        0xffd700,
        undefined,
        Rack.unlabeledAppearance()
      ),
      new Ball(
        Rack.jitter(colours[1]),
        0x008000,
        undefined,
        Rack.unlabeledAppearance()
      ),
      new Ball(
        Rack.jitter(colours[2]),
        0x6a2500,
        undefined,
        Rack.unlabeledAppearance()
      ),
      new Ball(
        Rack.jitter(colours[3]),
        0x005cb1,
        undefined,
        Rack.unlabeledAppearance()
      ),
      new Ball(
        Rack.jitter(colours[4]),
        0xff80b3,
        undefined,
        Rack.unlabeledAppearance()
      ),
      new Ball(
        Rack.jitter(colours[5]),
        0x010000,
        undefined,
        Rack.unlabeledAppearance()
      )
    )

    const redsToPlay = Math.min(SnookerConfig.reds, 15)
    const triangle = Rack.trianglePositions().slice(0, 15)
    const pocketPos = PocketGeometry.pockets.pocketS.pocket.pos
    triangle.forEach((p, i) => {
      const ball = new Ball(
        Rack.jitter(p.add(Rack.down)),
        0xee0000,
        undefined,
        Rack.unlabeledAppearance()
      )
      if (i >= redsToPlay) {
        ball.pos.copy(pocketPos)
        ball.pos.setZ(-8.5 * R)
        ball.state = State.InPocket
      }
      balls.push(ball)
    })
    return balls
  }

  static snookerColourPositions() {
    const dx = TableGeometry.X / 2
    const black = TableGeometry.X - (TableGeometry.X * 2) / 11
    const positions: Vector3[] = [
      new Vector3(Rack.baulk, -Rack.sixth, 0),
      new Vector3(Rack.baulk, Rack.sixth, 0),
      new Vector3(Rack.baulk, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(dx, 0, 0),
      new Vector3(black, 0, 0),
    ]
    return positions
  }

  static eightBall() {
    const triangle = this.triangle()
    Rack.swapBallPositions(triangle[4], triangle[9])
    Rack.swapBallPositions(triangle[4], triangle[8])
    Rack.swapBallPositions(triangle[3], triangle[11])
    Rack.swapBallPositions(triangle[6], triangle[14])
    return triangle
  }

  static chineseEightBall() {
    // 全色/花色间隔摆放，8 号在第三排中间，1 号在置球点
    const labels = [1, 9, 2, 10, 8, 3, 11, 4, 12, 5, 13, 6, 14, 7, 15]
    const tp = Rack.chineseTrianglePositions()
    const triangle: Ball[] = []
    triangle.push(
      Rack.chineseCueBall(
        Rack.jitter(new Vector3(CHINESE_HEAD_STRING, 0, 0))
      )
    )
    tp.forEach((p, i) => {
      triangle.push(Rack.chineseObjectBall(p, labels[i]))
    })
    return triangle
  }

  static chineseTrianglePositions() {
    const triangle: Vector3[] = []
    const pos = new Vector3(CHINESE_FOOT_SPOT, 0, 0)
    triangle.push(vec(pos))
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.addScaledVector(this.across, 2)
    triangle.push(vec(pos))
    pos.add(this.diagonal)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.sub(this.across)
    triangle.push(vec(pos))
    pos.add(this.diagonal).sub(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    pos.add(this.across)
    triangle.push(vec(pos))
    return triangle
  }

  static fromInitParam(balls: Ball[]): Ball[] {
    const params = new URLSearchParams(globalThis.location?.search)
    if (!params.has("practice") || !params.has("init")) {
      return balls
    }
    const data: number[] = JSON.parse(params.get("init")!)
    balls.forEach((b, i) => {
      b.pos.x = data[i * 2]
      b.pos.y = data[i * 2 + 1]
      b.pos.z = 0
    })
    return balls
  }
}
