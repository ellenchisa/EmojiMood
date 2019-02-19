import React from 'react';
import { Alert, View, StyleSheet, Text, AsyncStorage } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

import { HOST } from '../constants/Dark';
import Styles from '../constants/Styles';
import ErrorPage from '../components/ErrorPage';

export default class StatsScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props){
    super(props);
    this.state = {
      dataSource : [],
      error: null
    }
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
    .catch( (error) => this.setState({error}) );
  }

  retryLoad = () => {
    this.setState({error: null})
    this.load()
  }


  render() {
    if (this.state.error) return (<ErrorPage retryAction={this.retryLoad} />)

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
