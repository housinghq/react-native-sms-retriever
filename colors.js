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
  purple3: '#5e0be0',
  purple30: setAlpha('#7946db', 30),
  purpleTab: '#5e23dc',
  purpleBg: '#5e0be0',
  white: '#ffffff',
  white50: setAlpha('#ffffff', 50),
  red: '#d9413b',
  black10: setAlpha('#000000', 10),
  black20: setAlpha('#000000', 20),
  black26: setAlpha('#000000', 26),
  black30: setAlpha('#000000', 30),
  black50: setAlpha('#000000', 50),
  black47: setAlpha('#000000', 47),
  black54: setAlpha('#000000', 54),
  black65: setAlpha('#000000', 65),
  black70: setAlpha('#000000', 70),
  black80: setAlpha('#000000', 80),
  black87: setAlpha('#000000', 87),
  black89: setAlpha('#000000', 89),
  grey: '#f5f5f5',
  grey2: '#979797',
  grey2_20: setAlpha('#979797', 20),
  grey3: '#fafafa',
  grey4: '#666666',
  grey5: '#e6e6e6',
  grey5_30: setAlpha('#e6e6e6', 30),
  grey6: '#4a4a4a',
  grey7: '#090118',
  grey8: '#6c6c6c',
  grey10: '#7f7f7f',
  orange: '#f5a623',
  purpleText: '#5e23dc',
  purpleUpload: '#b9a1ff',
  greenUpload: '#74eb77',
  transparent: '#00000000',
  grey20: '#333333',
  green: '#1dd38f',
  blue_violet: '#5e0be0',
  yellow1: '#f9cf52',
  greyButton: '#cccccc',
  yellow: '#f5a623',
  red2: '#ce2445',
  greenGradient: '#b8f1bf',
  blueGradient: '#d5ddff',
  orange1: '#f58220',
  red1: '#e71c29',
  red_20: setAlpha('#e71c29', 20),
  orange_20: setAlpha('#f58220', 20),
  green_20: setAlpha('#1dd38f', 20),
  blue: '#5e0be0',
  orange2_5: setAlpha('#fba511', 5),
  barbie_pink_60: setAlpha('#ffb6c1', 20),
  green_7: setAlpha('#1dd38f', 7),
  greyishBrown: '#545454',
  grey9: '#e8e8e8',
  black1: '#282828',
  purple4: '#5e0be0',
  charcoal: '#1e201f',
  greyish_brown: '#3c3c3c',
  warm_grey: '#999999',
  greenBlue: '#1fd290',
  greyish_brown1: '#595959'
}
