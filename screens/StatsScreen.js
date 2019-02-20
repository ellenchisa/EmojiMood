import React from 'react';
import { FlatList, View, StyleSheet, Text, AsyncStorage } from 'react-native';
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
    .then((response)=> { this.setState({ dataSource: response });
    })
    .catch( (error) => this.setState({error}) );
  }

  retryLoad = () => {
    this.setState({error: null})
    this.load()
  }


  render() {
    if (this.state.error) return (<ErrorPage retryAction={this.retryLoad} />)

    const max = this.state.dataSource.reduce((m, e) => e.count > m ? e.count : m, 0)

    /*
    const renderItem = (item, index) => {
      return (<View key={index} style={styles.item}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={{...styles.count, flex: item.count}}>{item.count}</Text>
        <View style={{flex: max - item.count}}></View>
      </View>)
    }
    return (<View style={styles.container}>
      {this.state.dataSource.map(renderItem)}
    </View>)
    */

    const renderItem = ({item, index}) => {
      return (<View style={styles.item}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={{...styles.count, flex: item.count, backgroundColor: (index%2==0 ? 'pink' : 'lightblue')}}>{item.count}</Text>
        <View style={{flex: max - item.count}}></View>
      </View>)
    }

    return (<FlatList
      style={styles.container}
      data={this.state.dataSource}
      renderItem={renderItem}
      keyExtractor={(item, index) => '' + index}
     />)
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.container,
    paddingRight: 10,
    flexWrap: 'nowrap',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emoji: {
    width: 20,
    fontSize: 16,
    marginRight: 4
  },
  count: {
    textAlign: 'right',
    height: 30,
    padding: 4,
  }
});
