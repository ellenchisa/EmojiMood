import React from 'react';
import { FlatList, View, StyleSheet, Text, AsyncStorage } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { LinearGradient } from 'expo';

import { HOST } from '../constants/Dark';
import Styles from '../constants/Styles';
import Colors, {
  skyBright, sunBright, seaBright,
  skyLight, sunLight, seaLight,
  skyPrimary, sunPrimary, seaPrimary,
  skyDark
} from '../constants/Colors';
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
    const bgcolors = [seaBright, skyBright]
    const textcolors = [seaLight, skyLight]

    const renderItem = ({item, index}) => {
      return (<View style={styles.item}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View
          style={{...styles.count,
            flex: item.count,
            backgroundColor: bgcolors[index%2]
          }}
        ><Text
          style={{
            ...styles.countText,
            color: textcolors[index%2]
          }}
          >{item.count}</Text></View>
        <View style={{flex: max - item.count}}></View>
      </View>)
    }

    return (
      <LinearGradient
        colors={Colors.gradient}
        style={styles.container}
      >
      <FlatList
      data={this.state.dataSource}
      renderItem={renderItem}
      keyExtractor={(item, index) => '' + index}
      ListHeaderComponent={(<Text style={styles.header}>Usage Frequency</Text>)}
     />
   </LinearGradient>)
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.container,
    flexWrap: 'nowrap',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 15,
    color: skyDark
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: 8,
    paddingLeft: 8,
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
    borderBottomRightRadius: 15
  },
  countText: {
    width: '100%',
    textAlign: 'right',
    paddingRight: 8,
  }
});
