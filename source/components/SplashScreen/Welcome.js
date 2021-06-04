import React, { Component } from 'react';
import { Alert, BackHandler, ActivityIndicator, I18nManager, Platform, StyleSheet, Text, View, Image, ImageBackground ,TouchableOpacity} from 'react-native';
import { INDICATOR_COLOR, INDICATOR_SIZE, OVERLAY_COLOR } from '../../../styles/common';
import { width, height, totalSize } from 'react-native-dimension';
import styles from '../../../styles/SplashStyleSheet'
import { observer } from 'mobx-react';
import {Pages} from 'react-native-pages';

@observer export default class Welcome extends Component<Props> {
  constructor(props) {
    super(props);
    this.props = props;
  }
 
  static navigationOptions = { header: null };

  render() {

    return (
       
      <Pages>
        <View style={[styles.container]}>
          <ImageBackground source={require('../../images/welcome1.jpg')} style={styles.imgCon}>
          </ImageBackground>
        </View>
        <View style={[styles.container]}>
          <ImageBackground source={require('../../images/welcome2.jpg')} style={styles.imgCon}>
          </ImageBackground>
        </View>
        <View style={[styles.container]}>
          <ImageBackground source={require('../../images/welcome3.jpg')} style={styles.imgCon}>
          </ImageBackground>
        </View>
        <View style={[styles.container]}>
          <ImageBackground source={require('../../images/welcome4.jpg')} style={styles.imgCon}>
          </ImageBackground>
        </View>
        <View style={[styles.container, ]}>
          <ImageBackground source={require('../../images/welcome4.jpg')} style={styles.imgCon, {flex : 1,  width : width(100), justifyContent: 'flex-end', alignItems : 'center', paddingBottom : 70}}>
            <TouchableOpacity style = {{width : '80%', height : 45, borderRadius : 10, marginTop : 60, justifyContent: 'center', alignItems : 'center', backgroundColor : '#a800b7'}} onPress = {() => { this.props.navigation.replace('SignUp')}}>
              <Text style= {{color : '#fff', fontSize : 14}}>Sign Up</Text>
            </TouchableOpacity>
            <View style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginTop : 8}}>
              <TouchableOpacity onPress = {() => { this.props.navigation.replace('Drawer')}}>
                <Text style= {{color : '#fff', fontSize : 12,marginRight : 5, borderBottomColor : '#fff', borderBottomWidth : 1,}}>Explore more</Text>
              </TouchableOpacity>
              <View>
                <Text style= {{color : '#eef', fontSize : 10}}>Already have an account?</Text>
              </View>
              <TouchableOpacity onPress = {() => { this.props.navigation.replace('SignIn')}}>
                <Text style= {{color : '#fff', fontSize : 12,marginLeft : 5, borderBottomColor : '#fff', borderBottomWidth : 1,}}>SignIn</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </Pages>
     
    );
  }
}