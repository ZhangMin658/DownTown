import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import ListingTabCon from './ListingTabCon'
const RootStack = createStackNavigator(
  {
    ListingTabCon: ListingTabCon
  },
  {
    initialRouteName: 'ListingTabCon',
    headerMode:'none'
  }
 );
export default class ListingStack extends Component<Props> {
  static navigationOptions = {
    header: null,
  };
  render() {
      return <RootStack />;
  }
}
