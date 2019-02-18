import React from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, AsyncStorage } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import uuid from 'react-native-uuid';

import { HOST } from '../constants/Dark';

export default class StatsScreen extends React.Component {
  static navigationOptions = {
    title: 'Stats',
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

      const keys = Object.keys(response)
    	let data = keys.map(k => ({"emoji": k, "count": response[k]}))

    	this.setState({
          dataSource: data,
        });
    })
    .catch((response)=>console.error(response));
  }


  render() {
    return (

      <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.emoji}, {item.count}</Text>}
          keyExtractor={(item, index) => '' + index}
         />

    );
  }
}
