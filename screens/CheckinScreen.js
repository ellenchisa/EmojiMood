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

import { HOST } from '../constants/Dark';
import Colors, { seaBright, seaLight, seaPrimary,
  skyLight, skyPrimary, skyBright,
  sunBright, sunPrimary } from '../constants/Colors';
import Styles from '../constants/Styles';
import ErrorPage from '../components/ErrorPage';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      error: null
    };
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
          emojilist: this.state.text,
          device: deviceid
        }),
      })
      .then((response)=>{
        this.setState({text: ''})
      })
      .catch( (error) => this.setState({error}) );
  }

  clear = () => {
    this.setState({text: ''})
  }

  retryLoad = () => {
    this.setState({error: null})
    this.postMoods()
  }

  render() {
    if (this.state.error)
      return (<ErrorPage
        retryAction={this.retryLoad}
        message="Oops! We are having trouble receiving your moods." />)

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
          <Text style={styles.displayText}>{this.state.text}</Text>
          <Button
            color={Colors.tintColor}
            style={styles.postButton}
            onPress={this.postMoods}
            title="Save"
            disabled={this.state.text.length == 0}
          />
        </View>
        <View style={{padding: 0, height: 500}}>
        <EmojiInput
          enableFrequentlyUsedEmoji={false}
          categoryFontSize={32}
          categoryLabelHeight={20}
          categoryLabelTextStyle={styles.catLabel}
          enableSearch={true}
          categoryHighlightColor={seaBright}
          categoryUnhighlightedColor={seaPrimary}
          showCategoryTab={false}
          keyboardBackgroundColor='transparent'
          onEmojiSelected={(emoji) => {
            const all = this.state.text + emoji.char;
            this.setState({text: all})
          }}
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
    fontSize: 40
  },
  postButton: {
    width: 20,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#aaa'
  }
});
