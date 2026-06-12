/** 专属球杆：仅 lpr 粉色；其他玩家使用默认球杆 */
window.C8BALL_SPECIAL_CUE = {
  lpr: { cueColor: 'ff69b4', label: '粉色球杆' },
}

window.c8ballNormalizeName = function (name) {
  return String(name || '').trim().toLowerCase()
}

window.c8ballPlayerConfig = function (name) {
  return window.C8BALL_SPECIAL_CUE[window.c8ballNormalizeName(name)]
}

window.c8ballCueColorParam = function (name) {
  const cfg = window.c8ballPlayerConfig(name)
  return cfg && cfg.cueColor ? cfg.cueColor.replace(/^#/, '') : null
}
