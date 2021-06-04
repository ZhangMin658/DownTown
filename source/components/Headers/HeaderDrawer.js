import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList,Alert
} from 'react-native';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import styles from '../../../styles/HeadersStyles/DrawerHeaderStyleSheet';
const drawerHeader = (navigation) => {
  return(
            <View style={styles.overlyHeader}>
              <TouchableOpacity style={styles.drawerBtnCon} onPress={()=>{
                // Alert.alert(navigation+'')
                // navigation.toggleDrawer()
                navigation.openDrawer()
              }}>
                <Image source={require('../../images/drawerBtn.png')} style={styles.drawerBtn} />
              </TouchableOpacity>
              <View style={styles.headerTxtCon}>
                <Text style={styles.headerTxt}>DownTown</Text>
              </View>
              <Image source={require('../../images/search_white.png')} style={styles.headerSearch} />
              <Image source={require('../../images/cart.png')} style={styles.cart} />
            </View>
  );
}
export default drawerHeader;
// export default class HeaderDrawer extends Component<Props> {
//   constructor( props ) {
//     super(props);
//     I18nManager.forceRTL(false);
//   }
//   static navigationOptions = {
//     header: null,
//   };
//   render() {
//
//     return (
//         <View style={styles.overlyHeader}>
//           <TouchableOpacity style={styles.drawerBtnCon} onPress={()=>{
//             Alert.alert(this.props.navigation+'')
//             // this.prop.navigation.openDrawer()
//           }}>
//             <Image source={require('../../images/drawerBtn.png')} style={styles.drawerBtn} />
//           </TouchableOpacity>
//           <View style={styles.headerTxtCon}>
//             <Text style={styles.headerTxt}>DownTown</Text>
//           </View>
//           <Image source={require('../../images/search_white.png')} style={styles.headerSearch} />
//           <Image source={require('../../images/cart.png')} style={styles.cart} />
//         </View>
//     );
//   }
// }
