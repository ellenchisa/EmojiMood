import { Dimensions } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};

export const Styles = {
	container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    ...ifIphoneX({
            paddingTop: 50
        }, {
            paddingTop: 20
        })
  }
}
