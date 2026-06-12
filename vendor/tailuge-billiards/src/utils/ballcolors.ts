/** 中式八球标准球色（与实体台球一致） */
export const CHINESE_BALL_COLORS: Record<number, string> = {
  1: "#FFD900", // 黄
  2: "#0000FF", // 蓝
  3: "#FF0000", // 红
  4: "#800080", // 紫
  5: "#FF3300", // 橙
  6: "#008000", // 绿
  7: "#600000", // 棕
  8: "#000000", // 黑
  9: "#FFD900",
  10: "#0000FF",
  11: "#FF0000",
  12: "#800080",
  13: "#FF3300",
  14: "#008000",
  15: "#600000",
}

export function chineseBallColor(label: number): string {
  return CHINESE_BALL_COLORS[label] ?? "#CCCCCC"
}
