import { CanvasTexture, Color, LinearFilter, SRGBColorSpace } from "three"
import { chineseBallColor } from "../utils/ballcolors"

export class BallTextureFactory {
  private static readonly textureCache: Map<string, CanvasTexture> = new Map()

  static getOrCreateTexture(
    label: number,
    _color: Color,
    size = 512
  ): CanvasTexture {
    const key = `ball_${label}_${size}`
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!
    }

    const texture = this.createNumberTexture(label, size)
    this.textureCache.set(key, texture)
    return texture
  }

  private static createNumberTexture(
    label: number,
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

    const ballColor = chineseBallColor(label)

    if (label === 8) {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, size, size)
    } else if (label >= 1) {
      ctx.fillStyle = ballColor
      ctx.fillRect(0, 0, size, size)
      if (label >= 9) {
        const cap = size * 0.2
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, cap)
        ctx.fillRect(0, size - cap, size, cap)
      }
    } else {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, size, size)
    }

    if (label > 0) {
      const centerX = size / 2
      const centerY = size / 2
      const radius = Math.round(52 * scale)
      const border = Math.round(15 * scale)

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + border, 0, Math.PI * 2)
      ctx.fillStyle = "#000000"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      ctx.fillStyle = "#000000"
      ctx.strokeStyle = "#000000"
      const fontSize = Math.round(97 * scale)
      ctx.lineWidth = fontSize * 0.05
      ctx.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const textY = centerY + Math.round(5 * scale)
      ctx.strokeText(label.toString(), centerX, textY)
      ctx.fillText(label.toString(), centerX, textY)
    }

    const texture = new CanvasTexture(canvas)
    texture.flipY = false
    texture.colorSpace = SRGBColorSpace
    texture.generateMipmaps = false
    texture.minFilter = LinearFilter
    texture.magFilter = LinearFilter
    texture.needsUpdate = true
    return texture
  }
}
