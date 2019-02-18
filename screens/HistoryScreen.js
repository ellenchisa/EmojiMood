import React from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, AsyncStorage } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import uuid from 'react-native-uuid';

import { HOST } from '../constants/Dark';

export default class HistoryScreen extends React.Component {
  static navigationOptions = {
    title: 'History',
  };

  constructor(props){
    super(props);
    this.state ={ }
  }

  componentDidMount(){
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }

     load = async () => {
      const deviceid = await AsyncStorage.getItem('deviceid'); 
    return fetch(`${HOST}/checkins?device=${deviceid}`)
    .then((response) => response.json())
    .then((response)=> { this.setState({
          dataSource: response,
        }, function(){

        });
 })
    .catch((response)=>Alert.alert("errorsad"));
  }


  render() {
    return (

      <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.date.value}, {item.emojis}</Text>}
          keyExtractor={(item, index) => '' + index}
         />

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
