import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
import Store from '../../Stores';
import { createStackNavigator } from 'react-navigation';
import ProgressImage from '../CustomTags/ImageTag';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast'

class Blogs extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loadmore: false,
      reCaller: false,
    }
  }
  componentDidMount = async () => {
    await this.interstitial()
  }
  interstitial = () => {
    let data = store.settings.data;
    try {
      if (data.has_admob && data.admob.interstitial !== '') {
        AdMobInterstitial.setAdUnitID(data.admob.interstitial); //ca-app-pub-3940256099942544/1033173712
        AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
      }
      // InterstitialAdManager.showAd('636005723573957_636012803573249')
      //   .then(didClick => console.log('response===>>>',didClick))
      //   .catch(error => console.log('error===>>>',error)); 
    } catch (error) {
      console.log('catch===>>>', error);
    }
  }
  componentWillMount = async () => {
    // let parameter = {
    //   user_id: store.login.loginResponse.data.id
    // };
    this.setState({ loading: true })
    let response = await ApiController.post('blog');
    if (response.success) {
      store.BLOGS = response.data;
      this.setState({ loading: false })
    } else {
      this.setState({ loading: false })
    }
  }

  static navigationOptions = { header: null };

  _blog = (item, key) => {
    return (
      <TouchableOpacity key={key} style={{ elevation: 5, shadowOpacity: 0.5, marginVertical: 5, borderRadius: 5, marginHorizontal: 5, width: width(95), shadowColor: 'gray', alignSelf: 'center', backgroundColor: COLOR_PRIMARY, flexDirection: 'row' }}
        onPress={() => this.props.navigation.push('BlogDetail', { item: item })}
      >
        <View style={{ width: width(36), justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: item.blog_img }} style={{ height: 110, width: width(35), alignSelf: 'center', borderRadius: 5 }} />
        </View>
        <View style={{ width: width(58), justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 0, marginVertical: 5 }}>
          <Text style={{ marginHorizontal: 7, fontWeight: 'bold', color: COLOR_SECONDARY, marginBottom: 3, textAlign: 'left', fontSize: totalSize(1.8) }} >{item.blog_title}</Text>
          <Text style={{ marginHorizontal: 7, fontSize: totalSize(1.6), textAlign: 'left', marginBottom: 3 }} >{item.short_desc}</Text>
          <Text style={{ marginHorizontal: 7, fontSize: totalSize(1.2), textAlign: 'left' }} >{item.posted_date}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  loadMore = async (pageNo) => {
    let { orderStore } = Store;
    let params = {
      next_page: pageNo
    }
    this.setState({ loadmore: true })
    var data = store.BLOGS;
    let response = await ApiController.post('blog', params);
    // console.log('loadMore=====>>>', response);
    if (response.success && data.pagination.has_next_page) {
      //forEach Loop LoadMore results
      response.data.blogs.forEach((item) => {
        data.blogs.push(item);
      })
      data.pagination = response.data.pagination;
      this.setState({ loadmore: false })
    } else {
      this.setState({ loadmore: false })
      // Toast.show(response.data.no_more)
    }
    this.setState({ reCaller: false })
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {
    let main_clr = store.settings.data.main_clr;
    let data = store.settings.data;
    return (
      <View style={{ flex: 1 }}>
        {
          this.state.loading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size='large' color={main_clr} animating={true} />
            </View>
            :
            <View style={{ alignItems: 'center' }}>
              {
                data.has_admob && data.admob.banner !== '' ?
                  <AdMobBanner
                    adSize={Platform.OS === 'ios' ? "smartBanner" : "smartBannerLandscape"}
                    adUnitID={data.admob.banner} // 'ca-app-pub-3940256099942544/6300978111' 
                    onAdFailedToLoad={async () => await this.setState({ loadAdd: false })}
                    didFailToReceiveAdWithError={async () => await this.setState({ loadAdd: false })}
                    onAdLoaded={async () => { await this.setState({ loadAdd: true }) }}
                  />
                  :
                  null
              }
              <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={({ nativeEvent }) => {
                  if (this.isCloseToBottom(nativeEvent)) {
                    if (this.state.reCaller === false) {
                      this.loadMore(store.BLOGS.pagination.next_page);
                    }
                    this.setState({ reCaller: true })
                  }
                }}
                scrollEventThrottle={400}>
                <View style={{ backgroundColor: COLOR_PRIMARY, marginBottom: 10, elevation: 3, shadowOpacity: 0.3, alignItems: 'flex-start' }}>
                  <Text style={{ marginVertical: 5, marginHorizontal: 10 }}>{store.BLOGS.total_articles}</Text>
                </View>
                {
                  store.BLOGS.blogs.map((item, key) => {
                    return (
                      this._blog(item, key)
                    )
                  })
                }
                {
                  store.BLOGS.pagination.has_next_page ?
                    <View style={{ height: height(7), width: width(100), justifyContent: 'center', alignItems: 'center' }}>
                      {
                        this.state.loadmore ?
                          <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                          : null
                      }
                    </View>
                    :
                    null
                }
              </ScrollView>
            </View>
        }
      </View>
    );
  }
}
export default blogStack = createStackNavigator({
  Blogs: Blogs,
  // BlogDetail: BlogDetail
}, {
    initialRouteName: 'Blogs',
    // headerMode: 'none'
  }
);
