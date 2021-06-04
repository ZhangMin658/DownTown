import React, { Component } from 'react';
import {
  Text, View, Image,I18nManager, TouchableOpacity, ActivityIndicator, TextInput, FlatList, Platform
} from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import ProgressImage from '../CustomTags/ImageTag';
import { NavigationActions } from 'react-navigation';
import ApiController from '../../ApiController/ApiController';
import styles from '../../../styles/Categories/CategoriesStyleSheet';
@observer class Categories extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchCate: [],
      name: '',
      placeholderx:''
    }
  }
  static navigationOptions = { header: null };
  componentWillMount() {
    let { orderStore } = Store;
    // calling homeData func
    this.getCategories()
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
  // Getting home data func 
  getCategories = async () => {
    let { orderStore } = Store;
    try {
      this.setState({ loading: true })
      //API calling
      let response = await ApiController.post('categories');
      orderStore.categories = response.data.categories;
      this.setState({placeholderx:response.data.search_input})
      console.log('responsecategory=', response);
      if (response.success === true) {
        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
      // console.log('error',error);
    }
  }
  searchCate() {
    let { orderStore } = Store;
    if (this.state.name.length !== 0) {
      for (let i = 0; i < orderStore.categories.length; i++) {
        if (orderStore.categories[i].name.includes(this.state.name)) {
          this.state.searchCate.push(orderStore.categories[i]);
          this.setState({ loading: false })
        }
      }
    } else {
      Toast.show('enter any category name')
      this.setState({ searchCate: [] })
    }
  }
  navigateToScreen = (route, title) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {
          this.state.loading ?
            <ActivityIndicator color={data.main_clr} size='large' animating={true} />
            :
            <View style={styles.container}>
              <View style={{ alignItems:'center' }}>
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
              </View>
              <View style={styles.TextInputCon}>
                <TextInput
                  onChangeText={(value) => this.setState({ name: value })}
                  value={this.state.name}
                  placeholder={this.state.placeholderx}
                  placeholderTextColor='gray'
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  autoFocus={true}
                  style={[styles.TextInput,I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                />
                <TouchableOpacity onPress={() => {
                  if (this.state.searchCate.length > 0) {
                    this.setState({ searchCate: [], name: '' })
                  } else {
                    this.searchCate()
                  }
                }}>
                  <Image source={this.state.searchCate.length > 0 ? require('../../images/close.png') : require('../../images/searching-magnifying.png')} style={styles.searchIcon} />
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: 10 }}>
                <FlatList
                  indicatorStyle='black'
                  data={this.state.searchCate.length === 0 ? orderStore.categories : this.state.searchCate}
                  renderItem={({ item }) =>
                    <TouchableOpacity style={styles.cate_strip}
                      onPress={() => {
                        store.CATEGORY = item,
                          store.moveToSearch = true,
                          this.navigateToScreen('SearchingScreen', 'search')
                      }}
                    >
                      <ProgressImage source={{ uri: item.img }} style={styles.icon} />
                      <Text style={styles.cate_text}>{item.name}</Text>
                      <Image source={require('../../images/next.png')} style={styles.rightIcon} />
                    </TouchableOpacity>
                  }
                />
              </View>
            </View>
        }
      </View>
    );
  }
}
export default Categories;
