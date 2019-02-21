import React from 'react';
import { FlatList, View, StyleSheet, Text, AsyncStorage } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

import { HOST } from '../constants/Dark';
import Styles from '../constants/Styles';
import {
  skyBright, sunBright, seaBright,
  skyLight, sunLight, seaLight,
  skyPrimary
} from '../constants/Colors';
import ErrorPage from '../components/ErrorPage';

const sunDark = '#FFA023';
const seaDark = '#45A6AF';

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
    const bgcolors = [skyLight, sunLight, seaLight]
    const textcolors = [skyBright, sunDark, seaDark]

    const renderItem = ({item, index}) => {
      return (<View style={styles.item}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View
          style={{...styles.count,
            flex: item.count,
            backgroundColor: bgcolors[index%3]
          }}
        ><Text
          style={{
            ...styles.countText,
            color: textcolors[index%3]
          }}
          >{item.count}</Text></View>
        <View style={{flex: max - item.count}}></View>
      </View>)
    }

    return (<FlatList
      style={styles.container}
      data={this.state.dataSource}
      renderItem={renderItem}
      keyExtractor={(item, index) => '' + index}
      ListHeaderComponent={(<Text style={styles.header}>Usage Frequency</Text>)}
     />)
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.container,
    paddingRight: 10,
    paddingLeft: 10,
    flexWrap: 'nowrap',
  },
  header: {
    textAlign: 'center',
    color: skyPrimary,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 15
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
    height: 30,
    padding: 4,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  countText: {
    width: '100%',
    textAlign: 'right',
    paddingRight: 8,
  }
});
