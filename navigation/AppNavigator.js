import React from 'react';
import { createStackNavigator } from 'react-navigation';

import CheckinScreen from '../screens/CheckinScreen';
import StatsScreen from '../screens/StatsScreen';

export default createStackNavigator({
  Checkin: CheckinScreen,
  Stats: StatsScreen
});
