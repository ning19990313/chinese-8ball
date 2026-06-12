import { CanvasTexture, Color } from "three"

export class BallTextureFactory {
  private static readonly textureCache: Map<string, CanvasTexture> = new Map()

  static getOrCreateTexture(
    label: number,
    color: Color,
    size = 256
  ): CanvasTexture {
    const key = `${label}_${color.getHex()}_${size}`
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!
    }

    const texture = this.createNumberTexture(label, color, size)
    this.textureCache.set(key, texture)
    return texture
  }

  private static createNumberTexture(
    label: number,
    color: Color,
    size: number
  ): CanvasTexture {
    const scale = size / 256
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return new CanvasTexture(canvas)
    }

    if (label === 8) {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, size, size)
    } else {
      ctx.fillStyle = `#${color.getHexString()}`
      ctx.fillRect(0, 0, size, size)
    }

    // 9–15 花色球：彩色底 + 上下白色条纹（与全色球区分，侧面看仍是大块彩色）
    if (label >= 9) {
      const cap = size * 0.21
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, size, cap)
      ctx.fillRect(0, size - cap, size, cap)
    }

    if (label > 0) {
      const centerX = size / 2
      const centerY = size / 2
      const radius = Math.round(52 * scale)
      const border = Math.round(15 * scale)

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + border, 0, Math.PI * 2)
      ctx.fillStyle = "black"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()

      ctx.fillStyle = "black"
      ctx.strokeStyle = "black"
      const fontSize = Math.round(97 * scale)
      ctx.lineWidth = fontSize * 0.05
      ctx.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const textX = centerX
      const textY = centerY + Math.round(5 * scale)
      ctx.strokeText(label.toString(), textX, textY)
      ctx.fillText(label.toString(), textX, textY)
    }

    const texture = new CanvasTexture(canvas)
    texture.flipY = false
    return texture
  }
}
