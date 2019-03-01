import React from 'react';
import { View, StyleSheet, Text, Button, Image } from 'react-native';

import { Styles } from '../constants/Layout';
import Colors from '../constants/Colors';

export default class ErrorPage extends React.Component {

	render(){
		return (
			<View
				style={styles.container}
			>
				<Image
          source={require('./img/error.png')}
        />
				<Text>{this.props.message ? this.props.message : "Oops! Something went wrong with our servers"}</Text>
				<Button
					color={Colors.tintColor}
					onPress={this.props.retryAction} title="Try Again" />
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
  	...Styles.container,
  	padding: 20,
  	justifyContent: 'center',
  	alignItems: 'center',
  },
});
