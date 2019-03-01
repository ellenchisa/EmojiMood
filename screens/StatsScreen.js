import React from 'react';
import { FlatList, View, StyleSheet, Text, AsyncStorage } from 'react-native';
import { Icon } from 'expo';

import { HOST } from '../constants/Dark';
import { Styles, NavBarOpts } from '../constants/Layout';
import Colors from '../constants/Colors';
import ErrorPage from '../components/ErrorPage';

const renderHistoryItem = ({item}) => {
  return (<View style={styles.listitem}>
    <Text style={styles.emojis}>{item.emojis}</Text>
    <Text style={styles.date}>{(new Date(item.date.value)).toLocaleString('en-US')}</Text>
  </View>)
}

const renderStatsItem = (max) => {
  return ({item, index}) => (<View style={styles.item}>
    <Text style={styles.emoji}>{item.emoji}</Text>
    <View
      style={{...styles.count,
        flex: item.count,
        backgroundColor: Colors.statsBar[index%2]
      }}
    ><Text
      style={{
        ...styles.countText,
        color: Colors.statsBartx[index%2]
      }}
      >{item.count}</Text></View>
    <View style={{flex: max - item.count}}></View>
  </View>)
}

export default class StatsScreen extends React.Component {
  static navigationOptions = {
    ...NavBarOpts,
    title: 'Mood Log',
    headerStyle: {
      backgroundColor: Colors.background,
      borderBottomColor: 'transparent'
    },
  };

  constructor(props){
    super(props);
    this.state = {
      listData: [],
      statsData: [],
      error: null,
      renderStats: true,
    }
  }

  componentDidMount(){
    this.load()
    this.props.navigation.addListener('willFocus', this.load)
  }


  load = async () => {
    const deviceid = await AsyncStorage.getItem('deviceid');

    if (this.state.renderStats) {
      return fetch(`${HOST}/emojicount?device=${deviceid}`)
      .then( (response) => response.json() )
      .then( (response) => this.setState({ statsData : response }) )
      .catch( (error) => this.setState({error}) );
    } else {
      return fetch(`${HOST}/checkins?device=${deviceid}`)
      .then( (response) => response.json() )
      .then( (response) => this.setState({listData: response}) )
      .catch( (error) => this.setState({error}) );
    }
  }

  retryLoad = () => {
    this.setState({error: null})
    this.load()
  }

  toggleStats = (renderStats) => {
    this.setState({renderStats})
    this.load()
  }

  render() {
    if (this.state.error) return (<ErrorPage retryAction={this.retryLoad} />)

    const {renderStats, statsData, listData} = this.state;

    const header =
    (<View style={styles.header}>
        <Icon.Feather
          name="list"
          size={24}
          color={renderStats ? Colors.tintFade : Colors.tintColor}
          style={styles.headerItem}
          onPress={() => this.toggleStats(false)} />
        <Icon.Feather
          name="bar-chart"
          size={24}
          color={renderStats ? Colors.tintColor : Colors.tintFade}
          style={styles.headerItem}
          onPress={() => this.toggleStats(true)} />
    </View>)

    const dataSource = renderStats ? statsData : listData;
    let renderFn = renderHistoryItem;
    if(renderStats){
      const max = statsData.reduce((m, e) => e.count > m ? e.count : m, 0);
      renderFn = renderStatsItem(max)
    }

    return (<FlatList
      data={dataSource}
      renderItem={renderFn}
      keyExtractor={(item, index) => '' + index}
      style={styles.container}
      ListHeaderComponent={header}
   />)

  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.container,
    flexWrap: 'nowrap',
  },
  header: {
    flex:1 ,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingBottom: 12,
  },
  headerItem: {
    marginRight: 16
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
  },
  listitem: {
    marginBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  emojis: {
    fontSize: 32
  },
  date: {
    fontSize: 14,
    color: Colors.text
  }
});
