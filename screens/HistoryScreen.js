import React from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, AsyncStorage, View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import uuid from 'react-native-uuid';

import { HOST } from '../constants/Dark';
import Styles from '../constants/Styles';

export default class HistoryScreen extends React.Component {
  static navigationOptions = {
    header: null
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
    const renderItem = ({item}) => {
      return (<View style={styles.item}>
        <Text>{(new Date(item.date.value)).toLocaleString('en-US')}</Text>
        <Text>{item.emojis}</Text>
      </View>)
    }

    return (
      <FlatList
          style={styles.container}
          data={this.state.dataSource}
          renderItem={renderItem}
          keyExtractor={(item, index) => '' + index}
         />

    );
  }
}


const styles = StyleSheet.create({
  container: Styles.container,
  item: {
    marginBottom: 8
  }
});
