import React, {Component} from 'react';
import { Platform, Dimensions, ActivityIndicator,Text, View,TouchableOpacity } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, INDICATOR_VISIBILITY, ANIMATION,INDICATOR_SIZE,OVERLAY_COLOR,COLOR_GRAY, S2,COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import { withNavigation } from 'react-navigation';
import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import ApiController from '../../ApiController/ApiController';
import ListingTabCon from '../Listing/ListingTabCon';
import Dashboard from './Dashboard';
import MyProfile from './MyProfile';
import EditProfile from './EditProfile';
class UserDashboard extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0
    }
  }
  static navigationOptions = ({ navigation }) => ({
    header: null
  });
  componentWillMount = async () => {
      let { params } = this.props.navigation.state;
      this.setState({ loading: true })
      let response = await ApiController.post('profile');
      console.log('User profile==========================>>',response);
      if ( response.success ) {
          store.USER_PROFILE = response;
          this.setState({ loading: false })
      } else {
          this.setState({ loading: false })
      }
  }

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
    let data = store.USER_PROFILE.extra_text;
    return (
      <TabView
        navigationState={{
          index: this.state.index,
          routes:[
            { key: 'dashBoard', title: data.p_dashboard },
            { key: 'listing', title: data.p_listings },
            { key: 'myProfile', title: data.p_profile },
            { key: 'editProfile', title: data.p_edit_profile },
          ],
        }}
        renderScene={SceneMap({
          dashBoard: Dashboard,
          listing: ListingTabCon,
          myProfile: MyProfile,
          editProfile: EditProfile
        })}
        swipeEnabled={true}
        animationEnabled={true}
        onIndexChange={index => this.setState({ index: index })}
        // initialLayout={{ width: Dimensions.get('window').width }}
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

export default withNavigation(UserDashboard)