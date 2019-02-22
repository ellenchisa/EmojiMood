import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, AsyncStorage, View } from 'react-native';

import { LinearGradient } from 'expo';

import { HOST } from '../constants/Dark';
import Colors, { seaPrimary, seaBright, skyPrimary, sunPrimary, sunBright, skyDark } from '../constants/Colors';
import Styles from '../constants/Styles';
import ErrorPage from '../components/ErrorPage';

export default class HistoryScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props){
    super(props);
    this.state = {
      dataSource: [],
      error: null
    }
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
    .catch( (error) => this.setState({error}) );
  }

  retryLoad = () => {
    this.setState({error: null})
    this.load()
  }


  render() {
    if (this.state.error) return (<ErrorPage retryAction={this.retryLoad} />)

    const renderItem = ({item}) => {
      return (<View style={styles.item}>
        <Text style={styles.emojis}>{item.emojis}</Text>
        <Text style={styles.date}>{(new Date(item.date.value)).toLocaleString('en-US')}</Text>
      </View>)
    }

    return (
      <LinearGradient
        colors={Colors.gradient}
        style={Styles.container}
      >
      <FlatList
          data={this.state.dataSource}
          renderItem={renderItem}
          keyExtractor={(item, index) => '' + index}
         />
      </LinearGradient>
    );
  }
}


const styles = StyleSheet.create({
  item: {
    marginBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  emojis: {
    fontSize: 32
  },
  date: {
    fontSize: 14,
    color: skyDark
  }
});
