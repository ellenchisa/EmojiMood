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
import uuid from 'react-native-uuid';
import EmojiInput from 'react-native-emoji-input';

import { HOST } from '../constants/Dark';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Mood Entry',
  };

  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  postMoods = async () => {
    console.log('posting moods');
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
        console.log('updated')
        this.setState({text: ''})
      })
      .catch((error)=>{Alert.alert("failedsad")});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
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
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50
  },
  displayText: {
    padding: 2,
    fontSize: 16
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
