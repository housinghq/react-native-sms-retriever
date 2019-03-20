import R from 'ramda'

export function setAlpha(color, alpha) {
  const alphaValue = (() => {
    const hex = Math.floor(R.clamp(0, 100, alpha) * (255 / 100)).toString(16)
    if (hex.length === 1) {
      return `0${hex}`
    }
    return hex
  })()
  return color.substring(0, 7) + alphaValue // Format: #rrggbbaa
}

export default {
  black: '#000000',
  purple: '#7946db',
  purple2: '#5e23dc',
  red: '#d9413b',
  black10: setAlpha('#000000', 10),
  black50: setAlpha('#000000', 50),
  black54: setAlpha('#000000', 54),
}
