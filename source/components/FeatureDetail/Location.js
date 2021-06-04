import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button,Image,ImageBackground,TouchableOpacity,I18nManager,
        ScrollView,TextInput,FlatList
} from 'react-native';
import Modal from "react-native-modal";
import { width, height, totalSize } from 'react-native-dimension';
import MapView, { Polyline,Marker,Callout,PROVIDER_GOOGLE } from 'react-native-maps';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import Claim from './Claim'
import Report from './Report'
import styles from '../../../styles/LocationStyleSheet';
import FeatureDetail from './FeatureDetail';
@observer export default class Location extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {
      name: '',
      reportModel: false,
      isClaimVisible: false
    }
    // I18nManager.forceRTL(false);
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
    let region = {
      latitude:       parseFloat(data.location.latt),
      longitude:      parseFloat(data.location.long),
      latitudeDelta:  0.00922*1.5,
      longitudeDelta: 0.00421*1.5
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <FeatureDetail callModel={this.setModalVisible}/>
          <View style={styles.mapCon}>
            <MapView
              ref = {(ref)=>this.mapView=ref}
              showsScale={true}
              rotateEnabled={true}
              scrollEnabled={false}
              zoomEnabled={true}
              zoomControlEnabled={true}
              toolbarEnabled={false}
              showsCompass={true}
              showsBuildings={true}
              showsIndoors={true}
              provider={PROVIDER_GOOGLE}
              showsMyLocationButton={true}
              minZoomLevel={5}
              maxZoomLevel = {20}
              mapType = {"standard"}
              animateToRegion = {{
                latitude:       31.582045,
                longitude:      74.329376,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5
                    }}
              style={styles.map}
              region={region}
              // onRegionChange={this.onRegionChange.bind(this)}
              >
                {
                  data.has_location?
                    <MapView.Marker
                      coordinate={
                      { latitude: parseFloat(data.location.latt), longitude: parseFloat(data.location.long) }
                      }
                      // title={'Current location'}
                      // description={'I am here'}
                      pinColor={'#3edc6d'}
                      />
                      : <View></View>
                }
            </MapView>
          </View>
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
