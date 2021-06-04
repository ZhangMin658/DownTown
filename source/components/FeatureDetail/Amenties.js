import React, {Component} from 'react';
import {Text, View, Button,Image,I18nManager,
        ScrollView
} from 'react-native';
import Modal from "react-native-modal";
import { CheckBox } from 'react-native-elements';
import { height , width } from 'react-native-dimension';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import Claim from './Claim'
import Report from './Report'
import styles from '../../../styles/AmentiesStyleSheet';
import FeatureDetail from './FeatureDetail';
export default class Amenties extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {
      reportModel: false,
      isClaimVisible: false
      
    }
  }
  setModalVisible = (state,prop) => {
    if (state === 'claim' && prop === false) {
      this.setState({ reportModel: false , isClaimVisible: true })
    } else { 
      if (state === 'report') {
        this.setState({ reportModel: true , isClaimVisible: false })
      }
    }
  }
  hideModels = (state,hide) => {
    if (state === 'claim') {
      this.setState({ isClaimVisible: hide , reportModel: hide })
    } else { 
      if (state === 'report') {
        this.setState({ reportModel: hide , reportModel: hide })
      }
    }
  }
  static navigationOptions = {
    header: null,
  };
  render() {
    let { orderStore } = Store;
    let data =  orderStore.home.FEATURE_DETAIL.data.listing_detial;
    var main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        <ScrollView>
          <FeatureDetail callModel={this.setModalVisible}/>
          {
            data.has_amenties ? 
              <View style={styles.listCon}>
                {
                  data.ameneties.tab_desc.map((item,key)=>{
                    return(
                      <View key={key} style={styles.listChild}>
                        <CheckBox 
                           checkedColor={ main_clr }
                           containerStyle={{ height: height(5),width:width(10),marginRight:0 ,borderWidth: 0,backgroundColor:'transparent' }}
                           size={18}
                           checked={true}
                           onPress={()=>{ this.props.fun() }}
                        />
                        {/* <Image source={require('../../images/check.png')} style={styles.childIcon} /> */}
                        <View style={styles.childTxtCon}>
                          <Text style={styles.childTxt}>{item.amenties_values}</Text>
                        </View>
                      </View>
                    );
                  })
                }
              </View>
              : null
          }
        </ScrollView>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.reportModel }
          onBackdropPress={() => this.setState({ reportModel: false }) }
          style={{ flex: 1 }}>      
            <Report hideModels={this.hideModels} /> 
        </Modal>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.isClaimVisible}
          onBackdropPress={() => this.setState({ isClaimVisible: false }) }
          style={{ flex: 1 }}>
            <Claim hideModels={this.hideModels} />
        </Modal>
      </View>
    );
  }
}
