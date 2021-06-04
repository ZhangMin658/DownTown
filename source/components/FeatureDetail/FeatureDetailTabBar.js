import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import React, { Component } from 'react';
import { View, Dimensions, Text, TouchableOpacity, Share } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { INDICATOR_COLOR, INDICATOR_SIZE, INDICATOR_VISIBILITY, OVERLAY_COLOR, TEXT_SIZE, TEXT_COLOR, ANIMATION, COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, S18, S2 } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import { withNavigation } from 'react-navigation';
import ApiController from '../../ApiController/ApiController';
import Spinner from 'react-native-loading-spinner-overlay';
import Description from './Description';
import Amenties from './Amenties';
import AditionalDetails from './AditionalDetails';
import Location from './Location';
import UserReviews from './UserReviews';
import WriteReview from './WriteReview';
import Menu from './Menu';
import Video from './Video';
import AntDesign from 'react-native-vector-icons/AntDesign';

let _this = null;
const onShare = async () => {
  try {
    const result = await Share.share({
      message:
        'Findex | Share your favorite',
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

class FeatureDetailTabBar extends Component<Props> {
  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      loading: false,
      controlTab: true,
      dis: 'Discription',
      write: 'Write a Review',
      routes: [],
      index: 0
    }
  }
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.list_title,
    headerTintColor: 'white',
    headerTitleStyle: {
      fontSize: totalSize(2),
      fontWeight: 'normal'
    },
    headerStyle: {
      backgroundColor: store.settings.data.navbar_clr
    },
    header: (
      <View style = {{backgroundColor : '#000', flexDirection : 'row', height: 45, justifyContent : 'center', alignItems : 'center' }}>
      <TouchableOpacity onPress= {()=>{navigation.pop();}} style = {{marginLeft : 10, marginRight : 10, width : 20}}>
          <AntDesign
            size={22}
            name='arrowleft'
            color='#fff'
            containerStyle={{ marginLeft: 0, marginVertical: 3 }}
          />
      </TouchableOpacity>
      <View >
          <Text style ={{color : '#fff', fontSize: 14}}>{navigation.getParam('otherParam', store.settings.data.menu.home)}</Text>
      </View>
      <View style={{flex:1}}>
      </View>
      <TouchableOpacity onPress= {onShare} style={{ backgroundColor: 'black', marginRight: 12,  alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginLeft: 5, height:30, width: 30, borderRadius: 15 }}>
          <AntDesign
            size={22}
            name='sharealt'
            color='#fff'
            containerStyle={{ marginLeft: 0, marginVertical: 3 }}
          />
      </TouchableOpacity>
    </View>
    )
  });

  
  label() {
    return 'Discription', 'new'
  }
  componentWillMount = async () => {
    _this = this;
    let { orderStore } = Store;
    let { params } = this.props.navigation.state;
    orderStore.home.LIST_ID = params.listId;
    try {
      this.setState({ loading: true })
      //API calling
      let parameter = {
        listing_id: params.listId    // params.listId
      }
      let response = await ApiController.post('listing-detial', parameter);
      // console.log('listing details=====>>>>',response);
      if (response.success === true) {
        await this.route(response);
        orderStore.home.FEATURE_DETAIL = response;
        store.home.TAB_LABELS.amenties = response.data.listing_detial.ameneties.tab_txt;
        await this._getReports()
        await this._getClaims()
        this.setState({ loading: false })
        await this.showHideTabnavigator()
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
      // console.warn('error', error);
    }
  }
  route = (response) => {
    if (this.state.controlTab) {
      this.state.routes.push({ key: 'discription', title: response.data.listing_detial.view_desc });
    }
    if (response.data.listing_detial.has_amenties) {
      this.state.routes.push({ key: 'ameneties', title: response.data.listing_detial.ameneties.tab_txt });
    }
    if (response.data.listing_detial.has_location) {
      this.state.routes.push({ key: 'location', title: response.data.listing_detial.location.tab_txt });
    }
    if (response.data.listing_detial.has_video) {
      this.state.routes.push({ key: 'video', title: response.data.listing_detial.video.tab_txt });
    }
    if (response.data.listing_detial.has_add_fields) {
      this.state.routes.push({ key: 'aditionalDetail', title: response.data.listing_detial.additional_fields.tab_txt });
    }
    if (response.data.listing_detial.has_menu) {
      this.state.routes.push({ key: 'menu', title: response.data.listing_detial.menu.tab_txt });
    }
    if (response.data.listing_detial.has_reviews_score) {
      this.state.routes.push({ key: 'review', title: response.data.listing_detial.reviews.tab_txt });
    }
    if (response.data.listing_detial.has_write_review) {
      this.state.routes.push({ key: 'writeReview', title: response.data.listing_detial.write_reviews.tab_txt });

    }

  }
  _renderLabel = ({ route }) => (
    <Text style={{ fontSize: 13, color: COLOR_SECONDARY }}>{route.title}</Text>
  );
  _getReports = async () => {
    let { orderStore } = Store;
    //API CALLING FOR REPORTS
    try {
      let response = await ApiController.post('listing-report');
      if (response.success) {
        orderStore.home.REPORTS = response.data;
      }
    } catch (error) {
      console.log('err=', error);
    }
  }
  _getClaims = async () => {
    let { orderStore } = Store;
    //API CALLING FOR CLAIM
    try {
      let response = await ApiController.get('listing-claim');
      if (response.success) {
        orderStore.home.CLAIMS = response.data;
      }
    } catch (error) {
      console.log('err=', error);
    }
  }
  _controls = () => {
    console.warn('control');
    this.setState({
      controlTab: false
    })
    console.warn(this.state.controlTab);
  }
  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    var main_clr = store.settings.data.main_clr;
    if (this.state.loading == true) {
      return (
        <View style={{ height: height(100), width: width(100), flex: 1 }}>
          <Spinner
            visible={INDICATOR_VISIBILITY}
            // textContent={data.loading_txt}
            size={INDICATOR_SIZE}
            cancelable={true}
            color={store.settings.data.navbar_clr}
            animation={ANIMATION}
            overlayColor={OVERLAY_COLOR}
          // textStyle={{ fontSize: totalSize(TEXT_SIZE), color: TEXT_COLOR }}
          />
        </View>
      );
    }
    return (
      <TabView
        navigationState={{
          index: this.state.index,
          routes: this.state.routes
        }}
        renderScene={({ route }) => {
          if (route.key === 'discription') {
            return <Description />;
          } else {
            if (route.key === 'ameneties' && store.home.FEATURE_DETAIL.data.listing_detial.has_amenties) {
              return <Amenties fun={this._controls} />;
            } else {
              if (route.key === 'location' && store.home.FEATURE_DETAIL.data.listing_detial.has_location) {
                return <Location />;
              } else {
                if (route.key === 'menu' && store.home.FEATURE_DETAIL.data.listing_detial.has_menu) {
                  return <Menu />;
                } else {
                  if (route.key === 'review' && store.home.FEATURE_DETAIL.data.listing_detial.has_reviews_score) {
                    return <UserReviews />
                  } else {
                    if (route.key === 'video' && store.home.FEATURE_DETAIL.data.listing_detial.has_video) {
                      return <Video />;
                    } else {
                      if (route.key === 'aditionalDetail' && store.home.FEATURE_DETAIL.data.listing_detial.has_add_fields) {
                        return <AditionalDetails />;
                      } else {
                        if(route.key === 'writeReview' && store.home.FEATURE_DETAIL.data.listing_detial.has_write_review)
                        return <WriteReview />
                      }
                    }
                  }
                }
              }
            }
          }
          // WriteReview
        }}
        swipeEnabled={true}
        animationEnabled={true}
        onIndexChange={index => this.setState({ index: index })}
        initialLayout={{ width: Dimensions.get('window').width }}
        // canJumpToTab={true}
        tabBarPosition='bottom'
        renderTabBar={props =>
          <TabBar
            {...props}
            // getLabelText={()=> this.label()}
            // renderLabel={()=> this.label()}
            renderLabel={this._renderLabel}
            scrollEnabled={true}
            bounces={true}
            useNativeDriver={true}
            pressColor={main_clr}
            style={{ height: 45, justifyContent: 'center', backgroundColor: COLOR_PRIMARY, borderTopWidth: 0.2, borderColor: COLOR_GRAY, shadowColor: COLOR_GRAY }}
            labelStyle={{ color: COLOR_SECONDARY }}
            tabStyle={{}}
            indicatorStyle={{ backgroundColor: store.settings.data.main_clr, height: 3 }}
            activeLabelStyle={{ color: main_clr }}
          />

        }
      />
    );
  }
}

export default withNavigation(FeatureDetailTabBar)