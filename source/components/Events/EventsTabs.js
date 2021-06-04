import React, { Component } from 'react';
import { Text , ActivityIndicator , View, Dimensions } from 'react-native';
import store from '../../Stores/orderStore';
import { height , width , totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY,COLOR_SECONDARY } from '../../../styles/common';
import ApiController from '../../ApiController/ApiController';
import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import CreateEvent from './CreateEvent';
import PublishedEvents from './PublishedEvents';
import PendingEvents from './PendingEvents';
import ExpiredEvents from './ExpiredEvents';

class EventsTabs extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0
    }
  }
  static navigationOptions = { header: null };

  componentWillMount = async () => {
    await this.getEvents()
  }
  getEvents = async () => {
    await this.setState({ loading: true })
    let response = await ApiController.post('my-events');
    console.log('My Events==========================>>',response);
    store.MY_EVENTS = response;
    if ( response.success ) {
      await this.setState({ loading: false })
    } else {
      await this.setState({ loading: false })
    }
  }
  // componentDidUpdate = async() => {
  //   console.warn('update',store.refresh);
  //   if (store.refresh) {
  //      await this.getEvents()
  //   }
  // }
  _renderLabel = ({ route }) => (
    <Text style={{ fontSize: 14, color: COLOR_SECONDARY }}>{route.title}</Text>
  );
  render() {
    let main_clr = store.settings.data.main_clr;
    if (this.state.loading == true) {
      return (
        <View style={{ height: height(100), width: width(100), justifyContent:'center',alignItems:'center',flex: 1 }}>
            <ActivityIndicator size='large' color={main_clr} animating={true} />
        </View>
      );
    }
    let data = store.MY_EVENTS.data;
    return (
      <TabView
        navigationState={{
          index: this.state.index,
          routes:[
            // { key: 'create', title: 'Create Events' },
            { key: 'publish', title: data.e_publish },
            { key: 'pending', title: data.e_pending },
            { key: 'expired', title: data.e_expired },
          ],
        }}
        renderScene = {({ route, jumpTo }) => {
          switch (route.key) {
            // case 'create':
            //   return <CreateEvent jumpTo={jumpTo} />;
            case 'publish':
              return <PublishedEvents jumpTo={jumpTo} />;
            case 'pending':
              return <PendingEvents jumpTo={jumpTo} />;  
            case 'expired':
              return <ExpiredEvents jumpTo={jumpTo} />;    
            default:
              return null;  
          }
        }}
        // renderScene={SceneMap({
        //   create: CreateEvent,
        //   publish: PublishedEvents,
        //   pending: PendingEvents,
        //   expired: ExpiredEvents
        // })}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height
        }}
        swipeEnabled={true}
        animationEnabled={true}
        onIndexChange={index => this.setState({ index: index })}
        canJumpToTab={true}
        tabBarPosition='bottom'
        lazy={false}
        // renderLazyPlaceholder='loading...'
        renderTabBar={props =>
          <TabBar
            {...props}
            renderLabel={this._renderLabel}
            scrollEnabled={true}
            bounces={true}
            useNativeDriver={true}
            pressColor={main_clr}
            style={{ height: 45, justifyContent: 'center', backgroundColor: COLOR_PRIMARY }}
            labelStyle={{ color: COLOR_SECONDARY }}
            tabStyle={{ 
              width: width(50)
            }}
            indicatorStyle={{ backgroundColor: store.settings.data.main_clr, height: 3 }}
            activeLabelStyle={{ color: main_clr }}
          />
        }
      />
    )
  }
}

// const Tab = TabNavigator({
//   CreateEvent: {
//     screen: CreateEvent,
//     navigationOptions: {
//       title: "Create Event",
//     }
//   },
//   PublishedEvents: {
//     screen: PublishedEvents,
//     navigationOptions: {
//       title: "Published Events",
//     }
//   },
//   PendingEvents: {
//     screen: PendingEvents,
//     navigationOptions: {
//       title: "Pending Events",
//     }
//   },
//   ExpiredEvents: {
//     screen: ExpiredEvents,
//     navigationOptions: {
//       title: "Expired Events",
//     }
//   },
// },
//   {
//     order: ['CreateEvent', 'PublishedEvents', 'PendingEvents', 'ExpiredEvents'],
//     initialRouteName: 'CreateEvent',
//     tabBarPosition: 'bottom',
//     removeClippedSubviews: true,
//     animationEnabled: true,
//     swipeEnabled: true,
//     showIcon: false,
//     animationEnabled: true,
//     lazy: true,
//     backBehavior: true,
//     tabBarOptions: {
//       activeTintColor: COLOR_SECONDARY,
//       inactiveTintColor: COLOR_GRAY,
//       allowFontScaling: true,
//       scrollEnabled: true,
//       showIcon: false,
//       upperCaseLabel: false,
//       pressColor: COLOR_ORANGE,
//       labelStyle: {
//         // fontFamily: FONT_BOLD,
//         fontSize: totalSize(1.6),
//         // textAlign: 'center',
//         justifyContent: 'center',
//         alignItems: 'center',
//         // padding:0
//       },
//       tabStyle: {
//         // height:height(6),
//         // width:width(35)
//         // justifyContent: 'center',
//         // alignItems: 'center',
//       },
//       style: {
//         // height:height(6),
//         // justifyContent:'center',
//         backgroundColor: COLOR_PRIMARY,
//       },
//       indicatorStyle: {
//         borderColor: COLOR_ORANGE,
//         borderWidth: 2,
//       },
//     },
//   }
// );
export default EventsTabs;