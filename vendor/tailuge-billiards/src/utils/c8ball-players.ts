/** 中式八球：专属球杆配色（其余玩家使用引擎默认球杆） */
export const C8BALL_SPECIAL_CUE: Record<string, { cueColor: string }> = {
  lpr: { cueColor: "ff69b4" },
}

export function c8ballNormalizeName(name: string): string {
  return name.trim().toLowerCase()
}

export function c8ballPlayerConfig(name: string) {
  return C8BALL_SPECIAL_CUE[c8ballNormalizeName(name)]
}

export function c8ballCueColorParam(name: string): string | undefined {
  return c8ballPlayerConfig(name)?.cueColor
}
