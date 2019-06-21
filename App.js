import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { Permissions, AppLoading, Asset, Font, Icon, Notifications } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import uuid from 'react-native-uuid';

  askPermissions = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return false;
  }
  return true;
};

sendNotificationImmediately = async () => {
  let notificationId = await Notifications.presentLocalNotificationAsync({
    title: 'This is crazy',
    body: 'Your mind will blow after reading this',
  });
  console.log(notificationId); // can be saved in AsyncStorage or send to server
};

scheduleNotification = async () => {
  let notificationId = await Notifications.scheduleLocalNotificationAsync(
    {
      title: "Reminder to log your mood!",
      body: 'Share five emojis that summarize your day.',
    },
    {
      repeat: 'minute',
      time: new Date().getTime() + 10000,
    },
  );
  console.log(notificationId);
};



export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };


  componentDidMount = async () => {
    askPermissions()
    .then((perm) => {
      console.log('requested permissions', perm)
      if(perm) {
        scheduleNotification()
      }
    }, (error) => {
      console.log('error in getting permissions')
      console.log(error)
    })
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' &&
            <StatusBar backgroundColor='transparent'  />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
        require('./assets/images/splash.png'),
        require('./assets/images/icon.png'),
        require('./components/img/error.png'),
      ]),
      AsyncStorage.getItem('deviceid').then((res) => {
          if(res==null){
            const deviceid = uuid.v4();
            AsyncStorage.setItem('deviceid', deviceid);
            return deviceid;
          } else return res;
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});
