import { R } from "../model/physics/constants"
import { PocketGeometry } from "../view/pocketgeometry"
import { TableGeometry } from "../view/tablegeometry"

/** 中式八球标准内径 2540mm × 1270mm（台面中心到库边，单位：米） */
export const CHINESE_HALF_LENGTH = 1.27
export const CHINESE_HALF_WIDTH = 0.635

/** 开球线：距底库 450mm */
export const CHINESE_HEAD_STRING = -CHINESE_HALF_LENGTH + 0.45

/** 置球点：纵向中线，距顶库 635mm */
export const CHINESE_FOOT_SPOT = CHINESE_HALF_LENGTH - 0.635

export function applyChineseTableGeometry() {
  TableGeometry.hasPockets = true
  TableGeometry.tableX = CHINESE_HALF_LENGTH
  TableGeometry.tableY = CHINESE_HALF_WIDTH
  TableGeometry.X = CHINESE_HALF_LENGTH + R
  TableGeometry.Y = CHINESE_HALF_WIDTH + R
  PocketGeometry.scaleToRadius(R)
}
