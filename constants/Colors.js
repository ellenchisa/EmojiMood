const sunLight = '#FCF9D7'
const sunPrimary = '#FDF5AD'
const sunBright = '#FFF48F'
const sunDark = '#FFA023';

const seaLight = '#E5FDFF'
const seaPrimary = '#B6E3E7'
const seaBright = '#81CFD6' //'#7FDFE7'
const seaDark = '#45A6AF';

const skyLight = '#E0CADB'
const skyPrimary = '#C6A9BF'
const skyBright = '#A16592'
const skyDark = '#521F46'

export default {
  tintColor: skyBright,
  tintFade: skyPrimary,
  grey: '#aaa',

  background: seaLight,
  gradient: [skyPrimary, seaPrimary, sunBright],

  text: skyDark,

  headerTint: seaDark,

  keyboardBackground: seaPrimary,

  statsBar: [seaBright, skyBright],
  statsBartx: [seaLight, skyLight],
};
