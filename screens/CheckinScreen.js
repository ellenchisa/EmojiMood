import React from 'react';
import {
  Alert,
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import EmojiInput from 'react-native-emoji-input';

import { HOST } from '../constants/Dark';
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
      <View style={styles.container}>
        <View style={styles.top}>
          <Button
            style={styles.postButton}
            onPress={this.clear}
            title="Clear"
          />
          <Text style={styles.displayText}>{this.state.text}</Text>
          <Button
            style={styles.postButton}
            onPress={this.postMoods}
            title="Save"
          />
        </View>  
        <View style={{padding: 0, height: 500}}>
        <EmojiInput
          keyboardBackgroundColor="transparent"
          enableFrequentlyUsedEmoji={false}
          categoryFontSize={32}
          categoryLabelHeight={20}
          categoryLabelTextStyle={styles.catLabel}
          enableSearch={false}
          onEmojiSelected={(emoji) => {
            const all = this.state.text + emoji.char;
            this.setState({text: all})
          }}
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
    fontSize: 40
  },
  postButton: {
    width: 20,
    backgroundColor: 'pink'
  },
  catLabel: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#aaa'
  }
});
