import React from 'react';
import { Platform, Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import CheckinScreen from '../screens/CheckinScreen';
import HistoryScreen from '../screens/HistoryScreen';
import StatsScreen from '../screens/StatsScreen';

import Colors, {seaBright, seaLight, seaPrimary} from '../constants/Colors';

const CheckinStack = createStackNavigator({
  Checkin: CheckinScreen
});

CheckinStack.navigationOptions = {
  tabBarLabel: 'Checkin',
  tabBarIcon: ({ focused }) =>
    (focused ?
    <Image source={require('./img/tab_checkin-on.png')} /> :
    <Image source={require('./img/tab_checkin.png')} />),
};

const HistoryStack = createStackNavigator({
  History: HistoryScreen,
});

HistoryStack.navigationOptions = {
  tabBarLabel: 'History',
  tabBarIcon: ({ focused }) =>
    (focused ?
    <Image source={require('./img/tab_history-on.png')} /> :
    <Image source={require('./img/tab_history.png')} />),
};

const StatsStack = createStackNavigator({
  Stats: StatsScreen,
});

StatsStack.navigationOptions = {
  tabBarLabel: 'Stats',
  tabBarIcon: ({ focused }) =>
    (focused ?
      <Image source={require('./img/tab_stats-on.png')} /> :
      <Image source={require('./img/tab_stats.png')} />),
};

export default createBottomTabNavigator({
  HistoryStack,
  CheckinStack,
  StatsStack,
}, {
  'lazy': false,
  'initialRouteName': 'CheckinStack',
  'tabBarOptions': {
    'activeTintColor': Colors.tabIconSelected,
    'inactiveTintColor': Colors.tabIconDefault,
    'style': {
      'backgroundColor': Colors.tabBar,
      'borderTopColor': 'transparent'
    }
  }
});
