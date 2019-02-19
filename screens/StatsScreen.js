import React from 'react';
import { Alert, View, StyleSheet, Text, AsyncStorage } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import uuid from 'react-native-uuid';

import { HOST } from '../constants/Dark';
import Styles from '../constants/Styles';

export default class StatsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props){
    super(props);
    this.state = {dataSource : []}
  }

  componentDidMount(){
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }

  
  load = async () => {
     const deviceid = await AsyncStorage.getItem('deviceid'); 
    return fetch(`${HOST}/emojicount?device=${deviceid}`)
    .then((response) => response.json())
    .then((response)=> {

    	this.setState({
          dataSource: response,
        });
    })
    .catch((response)=>console.error(response));
  }


  render() {
    const emojiStyle = {

    }
    return (
      <View style={styles.container}>
        {this.state.dataSource.map((item, index) =>
          (<Text key={index} style={{...emojiStyle, fontSize: item.count*30}}>{item.emoji}</Text>))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {...Styles.container, flexDirection: 'row'},
  item: {
    marginBottom: 8
  }
});
