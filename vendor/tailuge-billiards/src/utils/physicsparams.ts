import * as C from "../model/physics/constants"

export function applyPhysicsParams(params: URLSearchParams) {
  for (const [key, value] of params) {
    const setter = (C as any)[`set${key}`]
    if (typeof setter === "function") {
      const n = Number(value)
      if (!isNaN(n)) setter(n)
    }
  }
}

/** 中式八球：略增滚动阻力，避免球滚太远（可用 URL ?mu= 覆盖） */
export function applyChinesePhysicsDefaults(
  ruletype: string,
  params: URLSearchParams
) {
  if (ruletype !== "chinese8ball") return
  if (!params.has("mu")) C.setmu(0.0125)
  if (!params.has("rho")) C.setrho(0.06)
}
