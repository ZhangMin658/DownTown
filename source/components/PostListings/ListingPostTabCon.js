import React, { Component } from 'react';
import { View, Text, Dimensions, I18nManager,ActivityIndicator, TouchableOpacity } from 'react-native';
import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import { height, width, totalSize } from 'react-native-dimension';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import CreateListing from './CreateListing';
import PricingListing from './PricingListing';
import DescriptionListing from './DescriptionListing';
import LocationListing from './LocationListing';
import Icon from 'react-native-vector-icons/AntDesign';

export default class ListingTabCon extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0,
    }
  }
  static navigationOptions = ({ navigation }) => ({
    headerTitle: store.settings.data.menu.create_listing,
    headerTintColor: COLOR_PRIMARY,
    headerStyle: {
      backgroundColor: store.settings.data.main_clr
    },
  });

  componentWillMount = async () => {
    await this.listingGetService()
  }
  listingGetService = async () => {
    await this.setState({ loading: true })
    let { params } = this.props.navigation.state;    
    if ( store.LISTING_UPDATE ) {
      store.LIST_ID = params.list_id;
      var response = await ApiController.post('update-listing',{ is_update: params.list_id });
    } else {
      store.LIST_ID = '';
      var response = await ApiController.post('create-listing');
    }
    console.log('Listing data==========================>>',response);
    store.GET_LISTING = response;
    if (response.success) {
      let data = store.GET_LISTING.data.create_listing.days;
      for (let i = 0; i < data.dropdown.length; i++) {
          data.dropdown[i].id = i;
          if (store.LISTING_UPDATE) {
            if (data.dropdown[i].closed === 1) {
              data.dropdown[i].checkStatus = false;
              data.dropdown[i].added = true;
            } else {
              data.dropdown[i].checkStatus = false;
              data.dropdown[i].added = false;
            }
            // data.dropdown[i].closed = false;        
            data.dropdown[i].closedValue = i;
          } else {
            data.dropdown[i].checkStatus = false;
            data.dropdown[i].added = false;
            data.dropdown[i].start_time = '12:00 AM';
            data.dropdown[i].end_time = '12:00 PM';
            data.dropdown[i].closed = false;        
            data.dropdown[i].closedValue = i; 
          }
      }
      await this.setState({ loading: false })
    } else {
      await this.setState({ loading: false })
    }
  }
  indexingInc = async () => {
    if (this.state.index < 3) {
      await this.setState({ index: this.state.index + 1 })
    }
  }
  indexingDec = async () => {
    if (this.state.index > 0) {
      await this.setState({ index: this.state.index - 1 })
    }
  }
  _renderTabBar = props => (
    <View style={{ height: 50, width: width(100), flexDirection: 'row', backgroundColor: store.settings.data.main_clr }}>
      {
        this.state.index > 0 ?
          <TouchableOpacity style={{ width: width(20),justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} onPress={() => this.indexingDec()}>
            <Icon size={20} name={I18nManager.isRTL ? 'right' : 'left'} color='white' style={{ marginRight: 2 }} />
          </TouchableOpacity>
          :
          null
      }
      {
        this.state.index === 0 ?
          <TouchableOpacity style={{ width: width(80), justifyContent: 'center',alignItems:'flex-start' }}>
            <Text style={{ fontSize: 16, color: 'white', marginHorizontal: 20 }}>{store.GET_LISTING.data.steps} 0{this.state.index + 1}</Text>
          </TouchableOpacity>
          :
          null
      }
      {
        this.state.index > 0 && this.state.index < 3 ?
          <View style={{ width: width(60), justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: 'white', marginHorizontal: 20 }}>{store.GET_LISTING.data.steps} 0{this.state.index + 1}</Text>
          </View>
          :
          null
      }
      {
        this.state.index !== 3 ?
          <TouchableOpacity style={{ width: width(20), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} onPress={() => this.indexingInc()}>
            <Icon size={20} name={I18nManager.isRTL ? 'left' : 'right'} color='white' style={{ marginLeft: 2 }} />
          </TouchableOpacity>
          :
          null
      }
    </View>
  );
  render() {
    let main_clr = store.settings.data.main_clr;
    if (this.state.loading == true) {
      return (
        <View style={{ height: height(100), width: width(100), justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator size='large' color={main_clr} animating={true} />
        </View>
      );
    }
    return (
      <TabView
        navigationState={{
          index: this.state.index,
          routes: [
            { key: 'create', title: 'createListing' },
            { key: 'price', title: 'Pricing' },
            { key: 'description', title: 'Description' },
            { key: 'location', title: 'LocationListing' }
          ],
        }}
        renderScene={SceneMap({
          create: CreateListing,
          price: PricingListing,
          description: DescriptionListing,
          location: LocationListing
        })}
        swipeEnabled={true}
        animationEnabled={true}
        onIndexChange={index => this.setState({ index: index })}
        initialLayout={{ height: 0, width: Dimensions.get('window').width }}
        // canJumpToTab={true}
        tabBarPosition='bottom'
        renderTabBar={this._renderTabBar}
      />
    );
  }
}
