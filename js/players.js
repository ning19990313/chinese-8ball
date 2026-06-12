/** 专属球杆配色（仅特殊昵称生效，其余默认球杆） */
window.C8BALL_SPECIAL_CUE = {
  lpr: { cueColor: 'ff69b4' },
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
