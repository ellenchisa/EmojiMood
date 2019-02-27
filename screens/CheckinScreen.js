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
import { LinearGradient } from 'expo';

import { MonoText } from '../components/StyledText';
import EmojiInput from 'react-native-emoji-input';
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Layout from '../constants/Layout';
import { HOST } from '../constants/Dark';
import Colors from '../constants/Colors';
import { Styles } from '../constants/Layout';
import ErrorPage from '../components/ErrorPage';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      moods: [],
      error: null
    };
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
      .then( (response) => this.setState({moods: []}) )
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
    return (
      <LinearGradient
        colors={Colors.gradient}
        style={styles.container}
      >
        <View style={styles.top}>
          <Button
            color={Colors.tintColor}
            style={styles.postButton}
            onPress={this.clear}
            title="Clear"
          />
          <Text style={styles.displayText}>{displayText}</Text>
          <Button
            color={Colors.tintColor}
            style={styles.postButton}
            onPress={this.postMoods}
            title="Save"
            disabled={this.state.moods.length == 0}
          />
        </View>
        <View style={
          {padding: 0, height: Layout.window.height - ifIphoneX(200, 120)}}>
        <EmojiInput
          enableFrequentlyUsedEmoji={false}
          categoryFontSize={32}
          categoryLabelHeight={20}
          categoryLabelTextStyle={styles.catLabel}
          enableSearch={true}
          showCategoryTab={false}
          keyboardBackgroundColor='transparent'
          onEmojiSelected={this.update}
          emojiFontSize={32}
        />
        </View>
        </LinearGradient>
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
  postButton: {
    width: 20,
    flex: 1
  },
  catLabel: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#aaa'
  }
});
