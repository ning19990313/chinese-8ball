/** 中式八球标准球色（全色/花色对应色一致） */
export const CHINESE_BALL_COLORS: Record<number, string> = {
  1: "#FCD600", // 黄
  2: "#003DA5", // 蓝
  3: "#E31837", // 红
  4: "#E4007C", // 粉
  5: "#FF6600", // 橙
  6: "#00A651", // 绿
  7: "#6B3A2A", // 棕
  8: "#000000", // 黑
  9: "#FCD600",
  10: "#003DA5",
  11: "#E31837",
  12: "#E4007C",
  13: "#FF6600",
  14: "#00A651",
  15: "#6B3A2A",
}

export function chineseBallColor(label: number): string {
  return CHINESE_BALL_COLORS[label] ?? "#CCCCCC"
}
