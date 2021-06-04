import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import React, { Component } from 'react';
import { View, Dimensions, Text,ActivityIndicator } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, INDICATOR_VISIBILITY, ANIMATION,INDICATOR_SIZE,OVERLAY_COLOR,COLOR_GRAY, COLOR_SECONDARY, S18, S2 } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import Spinner from 'react-native-loading-spinner-overlay';
import Events from './Events';
import Listings from './Listings';

@observer export default class PublicProfileTab extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0
    }
  }
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.user_name,
    headerTintColor: 'white',
    headerTitleStyle: {
      fontSize: totalSize(2),
      fontWeight: 'normal'
    },
    headerStyle: {
      backgroundColor: store.settings.data.navbar_clr
    }
  });
  componentWillMount = async () => {
      let { params } = this.props.navigation.state;
      this.setState({ loading: true })
      store.PUB_PROFILE_ID = params.profiler_id;
      let parameter = {
        user_id: params.profiler_id //params.profiler_id // 544
      };
      let response = await ApiController.post('author-detial',parameter);
      // console.log('public profile==>>',response);
      
      if ( response.success ) {
          store.PUB_PROFILE_DETAIL = response.data;
          this.setState({ loading: false })
      } else {
          this.setState({ loading: false })
      }
  }

  _renderLabel = ({ route }) => (
    <Text style={{ fontSize: totalSize(S2), color: COLOR_SECONDARY }}>{route.title}</Text>
  );
  render() {
    let data = store.settings.data;
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
          routes:[
            { key: 'listing', title: store.PUB_PROFILE_DETAIL.tab_listing },
            { key: 'event', title: store.PUB_PROFILE_DETAIL.tab_events },
          ],
        }}
        renderScene={SceneMap({
          listing: Listings,
          event: Events,
        })}
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
            lazy={true}
            scrollEnabled={true}
            bounces={true}
            useNativeDriver={true}
            pressColor={main_clr}
            style={{ height: 45, justifyContent: 'center', backgroundColor: COLOR_PRIMARY, borderTopWidth: 0.2, borderColor: COLOR_GRAY, shadowColor: COLOR_GRAY }}
            labelStyle={{ color: COLOR_SECONDARY }}
            tabStyle={{ 
              width: width(50)
             }}
            indicatorStyle={{ backgroundColor: store.settings.data.main_clr, height: 3 }}
            activeLabelStyle={{ color: main_clr }}
          />
        }
      />
    );
  }
}