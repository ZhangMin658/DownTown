import React, { Component } from 'react';
import {
  Text, View, Image, RefreshControl, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import { CheckBox, Icon } from 'react-native-elements';
import { observer } from 'mobx-react';
import styles from '../../../styles/Home';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast'
import ListingComp from './ListingComp';

@observer export default class SavedListing extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      reCaller: false,
      loading: false,
      loadmore: false,
      search: '',
      isRemove: false
    }
  }
  static navigationOptions = { header: null };
  navigateToScreen = (route, title) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  componentWillMount = async () => {
    await this.getFavListings()
  }
  getFavListings = async () => {
    let { params } = this.props.navigation.state;
    try {
      await this.setState({ loading: true })
      //API calling
      let response = await ApiController.post('fav-listings');
      if (response.success === true) {
        store.SAVED_LISTING = response;
        if (response.data.has_bookmarks) {
          store.SAVED_LISTING.data.bookmarks.forEach(item => {
            item.checkStatus = false;
          })
        }        
        this.setState({ loading: false })
      } else {
        store.SAVED_LISTING = response;
        Toast.show(response.message)
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
      console.log('error', error);
    }
  }
  loadMore = async (pageNo) => {
    let params = {
      next_page: pageNo
    }
    this.setState({ loadmore: true })
    var data = store.SAVED_LISTING.data;
    let response = await ApiController.post('fav-listings', params);
    if (response.success && data.pagination.has_next_page) {
      //forEach Loop LoadMore results
      response.data.bookmarks.forEach((item) => {
        data.bookmarks.push(item);
      })
      data.pagination = response.data.pagination;
      this.setState({ loadmore: false })
    } else {
      this.setState({ loadmore: false })
    }
    this.setState({ reCaller: false })
  }
  deleteListing = (id) => {
    let data = store.SAVED_LISTING.data.confirmation;
    Alert.alert(
      data.title,
      data.text,
      [
        {
          text: data.btn_cancle,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: data.btn_ok, onPress: () => this.deleteListings(id) },
      ],
      { cancelable: false },
    );
  }
  deleteListings = async (list_id) => {
    try {
      await this.setState({ isRemove: true })
      let params = {
        listing_id: list_id
      }
      //API calling
      let response = await ApiController.post('remove-favz', params);
      if (response.success) {
        store.SAVED_LISTING.data.bookmarks.forEach(item => {
          if (item.listing_id === list_id) {
            item.checkStatus = true;
          } else {
            item.checkStatus = false;
          }
          this.setState({ isRemove: false })
        })
        Toast.show(response.message)
        this.setState({ isRemove: false })
      } else {
        Toast.show(response.message)
        this.setState({ isRemove: false })
      }
    } catch (error) {
      this.setState({ isRemove: false })
      console.log('error', error);
    }
  }
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  render() {
    let list = store.SEARCHING.LISTING_SEARCH.data;
    let data = store.SAVED_LISTING.data;
    return (
      <View style={styles.container}>
        {
          this.state.loading ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
            </View>
            :
            store.SAVED_LISTING.success && data.has_bookmarks ?
              <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  onScroll={({ nativeEvent }) => {
                    if (this.isCloseToBottom(nativeEvent)) {
                      if (this.state.reCaller === false) {
                        this.loadMore(data.pagination.next_page);
                      }
                      this.setState({ reCaller: true })
                    }
                  }}
                  scrollEventThrottle={400}
                  refreshControl={
                    <RefreshControl
                      colors={['white']}
                      progressBackgroundColor={store.settings.data.main_clr}
                      tintColor={store.settings.data.main_clr}
                      refreshing={this.state.refreshing}
                      onRefresh={this.getFavListings}
                    />
                  }
                >
                  <View style={{ elevation: 3, shadowOpacity: 0.3, height: height(6), width: width(100), flexDirection:'row',backgroundColor: 'white', alignItems: 'center', marginBottom: 5 }}>
                    <View style={{  alignItems:'flex-start',width: width(83) }}>
                      <Text style={{ fontSize: totalSize(2.2),color: COLOR_SECONDARY, marginHorizontal: 15, marginVertical: 10 }}>{data.bookmark_count}</Text>
                    </View>
                    {
                      this.state.isRemove ?
                        <ActivityIndicator size='small' color={store.settings.data.navbar_clr} animating={true} />
                        :
                        null
                    }
                  </View>
                  {
                    data.has_bookmarks ?
                      data.bookmarks.map((item, key) => {
                        return (
                          <View key={key}>
                            {
                              item.checkStatus ?
                                null
                                :
                                <ListingComp item={item} key={key} listStatus={true} _deleteListing={this.deleteListing} />
                            }
                          </View>
                        )
                      })
                      : null
                  }
                  {
                    data.pagination.has_next_page ?
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
              :
              <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{store.SAVED_LISTING.message}</Text>
              </View>
        }
      </View>
    );
  }
}
