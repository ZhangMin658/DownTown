import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Store from '../../Stores';
import styles from '../../../styles/MainScreenStyle'
let { orderStore } = Store;
export default class MainScreen extends Component<Props> {
  constructor(props) {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    super(props);
  }
  static navigationOptions = { header: null };
  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../images/bk_ground.jpg')} style={styles.imgCon}>
          <ImageBackground source={require('../../images/Downtown_Shadownew.png')} style={styles.imgCon}>
            <View style={styles.logoView}>
              <Image source={{ uri: data.logo }} style={styles.logoImg} />
              <Text style={styles.logoTxt}>{data.slogan}</Text>
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.signInBtn} onPress={() => { this.props.navigation.navigate('SignIn') }}>
                <Text style={styles.signTxt}>{data.main_screen.sign_in}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.signUpBtn, { backgroundColor: orderStore.settings.data.main_clr }]} onPress={() => { this.props.navigation.navigate('SignUp') }}>
                <Text style={styles.signUpTxt}>{data.main_screen.sign_up}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.expTxt} onPress={() => this.props.navigation.navigate('Drawer')}>{data.main_screen.explore}</Text>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}
