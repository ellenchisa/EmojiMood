import React from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, AsyncStorage } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import uuid from 'react-native-uuid';
var emo = require('emoji-tree');

export default class StatsScreen extends React.Component {
  static navigationOptions = {
    title: 'Stats',
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
    return fetch('https://ellen-emojimood.builtwithdark.com/checkins?device='+deviceid)
    .then((response) => response.json())
    .then((response)=> { 
    	let stats ={}

    	response.forEach((item)=>{
    		let emojis = emo(item.emojis)
    		emojis.forEach((emoji) => {
    			if (!stats[emoji.text]){
    				stats[emoji.text] = 0;
    			}
    			stats[emoji.text]++;
    		});
    	})

    	let emojis = Object.keys(stats);

    	let data = []
    	emojis.forEach((emoji)=>{
    		data.push({"emoji":emoji,"count":stats[emoji]})
    	})






    	this.setState({
          dataSource: data,
        }, function(){

        });
 })
    .catch((response)=>Alert.alert("errorsad"));
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
