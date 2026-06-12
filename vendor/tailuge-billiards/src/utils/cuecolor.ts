/** 球杆配色：杆身 + 深色杆尾 */
export type CuePalette = { shaft: number; butt: number }

export function parseCueColor(hex?: string | null): number | undefined {
  if (!hex) return undefined
  const s = hex.replace(/^#/, "").trim()
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return undefined
  return Number.parseInt(s, 16)
}

export function darken(hex: number, factor: number): number {
  const r = Math.round(((hex >> 16) & 0xff) * factor)
  const g = Math.round(((hex >> 8) & 0xff) * factor)
  const b = Math.round((hex & 0xff) * factor)
  return (r << 16) | (g << 8) | b
}

export function paletteFromColor(hex: number): CuePalette {
  return { shaft: hex, butt: darken(hex, 0.42) }
}
