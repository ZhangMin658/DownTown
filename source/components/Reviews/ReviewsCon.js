import React, {Component} from 'react';
import { Text , ActivityIndicator , View } from 'react-native';
import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import store from '../../Stores/orderStore';
import { height , width , totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY,COLOR_SECONDARY } from '../../../styles/common';
import ApiController from '../../ApiController/ApiController';
import ReceiveReview from './ReceiveReview';
import SubmitReview from './SubmitReview';

export default class ReviewsCon extends Component<Props> {
  constructor( props ) {
    super(props);
    this.state = {
      loading: false,
      index: 0,
    }
  }
  static navigationOptions = {
    header: null,
  };
  componentWillMount = async () => {
    let { params } = this.props.navigation.state;
    this.setState({ loading: true })
    let response = await ApiController.post('reviews');
    // console.log('User Reviews==========================>>',response);
    store.USER_REVIEWS = response;
    if ( response.success ) {
      if (store.USER_REVIEWS.data.submitted_reviews.has_comments) {
        store.USER_REVIEWS.data.submitted_reviews.commnets.forEach(item => {
          item.added = false;
          item.checked = false;
          item.is_Active = false;
         });
      }
       if (store.USER_REVIEWS.data.received_reviews.has_comments) {
          store.USER_REVIEWS.data.received_reviews.commnets.forEach(item => {
            item.added = false;
            item.checked = false;
            item.is_Active = false;
          });
       } 
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
    let data = store.USER_REVIEWS;
    return (
      <TabView
        navigationState={{
          index: this.state.index,
          routes:[
            { key: 'receive', title: data.extra_text.received_txt },
            { key: 'submit', title: data.extra_text.submitted_txt },
          ],
        }}
        renderScene={SceneMap({
          receive: ReceiveReview,
          submit: SubmitReview,
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
    );
  }
}