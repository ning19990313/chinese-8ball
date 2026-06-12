/** 中式八球标准球色（全色/花色对应色一致） */
export const CHINESE_BALL_COLORS: Record<number, string> = {
  1: "#FFD600", // 黄
  2: "#0047AB", // 蓝
  3: "#EE0000", // 红
  4: "#7B1FA2", // 紫
  5: "#FF6600", // 橙
  6: "#00A651", // 绿
  7: "#6B3A0D", // 棕
  8: "#000000", // 黑
  9: "#FFD600",
  10: "#0047AB",
  11: "#EE0000",
  12: "#7B1FA2",
  13: "#FF6600",
  14: "#00A651",
  15: "#6B3A0D",
}

export function chineseBallColor(label: number): string {
  return CHINESE_BALL_COLORS[label] ?? "#CCCCCC"
}
