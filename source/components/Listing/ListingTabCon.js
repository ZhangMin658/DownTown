import React, {Component} from 'react';
import { Text } from 'react-native'; 
import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import { COLOR_PRIMARY,COLOR_SECONDARY } from '../../../styles/common';
import store from '../../Stores/orderStore';
import Active from './Active';
import Pending from './Pending';
import Featured from './Featured';
import Expired from './Expired';
export default class ListingTabCon extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {
      index: 0,
    }
  }
  static navigationOptions = {
    header: null,
  };
  _renderLabel = ({ route }) => (
    <Text style={{ fontSize: 14, color: COLOR_SECONDARY }}>{route.title}</Text>
  );
  render() {
    let main_clr = store.settings.data.main_clr;
    let data = store.USER_PROFILE.data;
    return (
      <TabView
        navigationState={{
          index: this.state.index,
          routes:[
            { key: 'publish', title: data.l_publish },
            { key: 'pending', title: data.l_pending },
            { key: 'featured', title: data.l_featured }, //data.p_profile
            { key: 'expired', title: data.l_expired },
          ],
        }}
        renderScene={SceneMap({
          publish: Active,
          pending: Pending,
          featured: Featured,
          expired: Expired
        })}
        swipeEnabled={true}
        animationEnabled={true}
        onIndexChange={index => this.setState({ index: index })}
        // initialLayout={{ width: Dimensions.get('window').width }}
        // canJumpToTab={true}
        tabBarPosition='top'
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
            style={{ height: 45, justifyContent: 'center', backgroundColor: COLOR_PRIMARY }}
            labelStyle={{ color: COLOR_SECONDARY }}
            tabStyle={{ 
              // width: width(40)
            }}
            indicatorStyle={{ backgroundColor: store.settings.data.main_clr, height: 3 }}
            activeLabelStyle={{ color: main_clr }}
          />
        }
      />
    );
  }
}
