import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';
import { StackActions } from 'react-navigation';
import { Icon } from 'expo';

import { MonoText } from '../components/StyledText';
import EmojiInput from 'react-native-emoji-input';
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Layout from '../constants/Layout';
import { HOST } from '../constants/Dark';
import Colors from '../constants/Colors';
import { Styles } from '../constants/Layout';
import ErrorPage from '../components/ErrorPage';

const toStatsScreen = StackActions.push({
  routeName: 'Stats'
});

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Checkin',
    headerBackTitle: 'Checkin',
  };

  constructor(props) {
    super(props);
    this.state = {
      moods: [],
      error: null
    };
  }

  toStatsScreen = () => {
    this.props.navigation.dispatch(toStatsScreen);
  }

  moodsToString = () => {
      if (this.state.moods)
        return this.state.moods.reduce((str, e) => str + e, "")
      else return ""
  }

  postMoods = async () => {
      const deviceid = await AsyncStorage.getItem('deviceid');
      fetch(`${HOST}/checkins`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emojilist: this.moodsToString(),
          device: deviceid
        }),
      })
      .then( (response) => {
        this.setState({moods: []})
        this.toStatsScreen()
      } )
      .catch( (error) => this.setState({error}) );
  }

  clear = () => {
    this.setState({moods: []})
  }

  retryLoad = () => {
    this.setState({error: null})
    this.postMoods()
  }

  update = (emoji) => {
    const { moods } = this.state;
    if (moods.length >= 5) return;

    this.setState({moods: moods.concat(emoji.char)})
  }

  render() {
    if (this.state.error)
      return (<ErrorPage
        retryAction={this.retryLoad}
        message="Oops! We are having trouble receiving your moods." />)

    const displayText = this.moodsToString();
    const blankFace = this.state.moods.length == 0;

    return (
      <View
        style={styles.container}
      >
        <View style={styles.top}>
          <Icon.Feather
            name="x-circle"
            size={20}
            color={blankFace ? 'transparent' : Colors.tintColor}
            style={styles.iconButton}
            onPress={this.clear}
          />
          <Text style={styles.displayText}>{displayText}</Text>
          <Icon.Feather
            name="arrow-up-circle"
            size={32}
            color={blankFace ? 'grey' : Colors.tintColor}
            style={styles.iconButton}
            onPress={this.postMoods} />
        </View>
        <View style={
          {padding: 0, height: Layout.window.height - ifIphoneX(200, 120)}}>
        <EmojiInput
          enableFrequentlyUsedEmoji={false}
          categoryFontSize={32}
          categoryLabelHeight={20}
          categoryLabelTextStyle={styles.catLabel}
          enableSearch={false}
          showCategoryTab={true}
          keyboardBackgroundColor='transparent'
          onEmojiSelected={this.update}
          emojiFontSize={40}
        />
        </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: Styles.container,
  top: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    height: 50,
  },
  displayText: {
    padding: 2,
    fontSize: 32,
    flex: 5,
    textAlign: 'center'
  },
  iconButton: {
    width: 30,
    paddingLeft: 2,
    paddingRight: 2,
    textAlign: 'center',
    flex: 1
  },
  catLabel: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#aaa'
  }
});
