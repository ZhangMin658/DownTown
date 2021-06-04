import React, { Component } from 'react';
import {
    Text, View, Image, ImageBackground, TouchableOpacity, Platform,
    ScrollView, TextInput, ActivityIndicator
} from 'react-native';
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob';
import { NavigationActions } from 'react-navigation';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import Modal from "react-native-modal";
import { CheckBox, Icon } from 'react-native-elements';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import styles from '../../../styles/Home';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast'
import ListingComponent from '../Home/SearchListingComponent';

@observer export default class SearchingScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            reCaller: false,
            loading: false,
            loadmore: false,
            sorting: false,
            sortCheck: false,
            search: '',
            firstDone: false
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
    async componentDidMount() {
        await this.interstitial()
        this.subs = this.props.navigation.addListener("didFocus", func = async () => {
            //Your logic, this listener will call when you open the class every time
            await this.getSearchList()
        });
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
    _sort = () => this.setState({ sorting: !this.state.sorting })
    componentWillMount = async () => {
        // if(this.props)

        await this.getSearchList()
    }
    getSearchList = async () => {
        // console.log('this props',this.props)
        let { orderStore } = Store;
        let { params } = this.props.navigation.state;
        // console.log('this.state.firstDone',this.state.firstDone)
        // console.log('this.props.navigation.state.params.from',this.state.firstDone)

        if (this.state.firstDone == false  && this.props.navigation.state.params != undefined) {
            console.log('got inside')
            if (this.props.navigation.state.params.from != undefined) {
                if (this.props.navigation.state.params.from == "home007") {
                    this.setState({ firstDone: true })
                    if (this.props.navigation.state.params.search_text.length !== 0) {
                        store.SEARCH_OBJ.by_title = this.props.navigation.state.params.search_text;
                    } else {
                        // store.SEARCH_OBJ.by_title = this.state.search;
                    }
                }
            } else {
                if (this.state.search.length !== 0) {
                    store.SEARCH_OBJ.by_title = this.state.search;
                } else {
                    // store.SEARCH_OBJ.by_title = this.state.search;
                }
            }
        } else {
            console.log('got inside else')

            if (this.state.search.length !== 0) {
                store.SEARCH_OBJ.by_title = this.state.search;
            } else {
                // store.SEARCH_OBJ.by_title = this.state.search;
            }
        }
        // if (this.state.search.length !== 0) {
        //     store.SEARCH_OBJ.by_title = this.state.search;
        // } else {
        //     // store.SEARCH_OBJ.by_title = this.state.search;
        // }


        if (store.moveToSearch === true) {
            store.SEARCH_OBJ.l_category = store.CATEGORY.category_id;
        }
        if (store.moveToSearchLoc === true) {
            store.SEARCH_OBJ.l_location = store.LOCATION.location_id;
        }
        // console.log('paramsPPP===>>>', store.SEARCH_OBJ);
        try {
            this.setState({ loading: true })
            //API calling
            let response = await ApiController.post('listing-search', store.SEARCH_OBJ);
            orderStore.SEARCHING.LISTING_SEARCH = response;
            if (response.success === true) {
                // console.log('listSeacrh===>', store.SEARCHING.LISTING_SEARCH);
                this.setState({ loading: false })
            } else {
                // store.SEARCHING.LISTING_SEARCH.data = [];
                Toast.show(response.message)
                this.setState({ loading: false })
            }
        } catch (error) {
            this.setState({ loading: false })
            console.log('error', error);
        }
    }
    resetSearchList = async () => {
        let { orderStore } = Store;
        store.CATEGORY = {};
        store.LOCATION = {};
        store.SEARCH_OBJ = {};
        store.SEARCHTEXT=""

        await this.setState({
            search: ''
        })
        try {
            this.setState({ loading: true })
            //API calling
            let response = await ApiController.post('listing-search');
            orderStore.SEARCHING.LISTING_SEARCH = response;
            if (response.success === true) {
                // console.log('listSeacrh===>', store.SEARCHING.LISTING_SEARCH);
                this.setState({ loading: false })
            } else {
                this.setState({ loading: false })
            }
        } catch (error) {
            this.setState({ loading: false })
            console.log('error', error);
        }
    }
    loadMore = async (pageNo) => {
        let { orderStore } = Store;
        let params = {
            next_page: pageNo
        }
        // Merging two objects
        let obj = Object.assign(params, store.SEARCH_OBJ);
        // console.log('merges obj===>>>', obj);
        this.setState({ loadmore: true })
        var data = orderStore.SEARCHING.LISTING_SEARCH.data;
        let response = await ApiController.post('listing-search', obj);
        // console.log('loadMore=====>>>', response);
        if (response.success && data.pagination.has_next_page) {
            //forEach Loop LoadMore results
            response.data.listings.forEach((item) => {
                data.listings.push(item);
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
    _sortingModule = async (item, options) => {
        // store.SEARCH_OBJ = {};
        options.forEach(option => {
            if (option.key === item.key) {
                store.SEARCH_OBJ.sort_by = item.key;
                this.setState({ sorting: false })
                this.sortedApi()
                // console.warn('object===>>>',store.SEARCH_OBJ);
            } else {
                option.checkStatus = false;
            }
        })
    }
    sortedApi = async () => {
        let { orderStore } = Store;
        try {
            this.setState({ loading: true })
            //API calling
            let response = await ApiController.post('listing-search', store.SEARCH_OBJ);
            orderStore.SEARCHING.LISTING_SEARCH = response;
            // console.log('sorting Response===>>>',orderStore.SEARCHING.LISTING_SEARCH);
            if (response.success === true) {
                // console.log('listSeacrh===>', store.SEARCHING.LISTING_SEARCH);
                this.setState({ loading: false })
            } else {
                this.setState({ loading: false })
            }
        } catch (error) {
            this.setState({ loading: false })
            console.log('error', error);
        }
    }
    render() {
        let { orderStore } = Store;
        let list = orderStore.SEARCHING.LISTING_SEARCH.data;
        let data = store.SEARCHING.LISTING_FILTER.data;
        let home = orderStore.home.homeGet.data.advanced_search;
        let settings = store.settings.data;
        return (
            <View style={styles.container}>
                <View style={{ height: height(10), width: width(100), backgroundColor: store.settings.data.navbar_clr, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: height(7), width: width(90), backgroundColor: COLOR_PRIMARY, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={{ width: width(80), alignSelf: 'stretch', paddingHorizontal: 10 }}
                            placeholder={home.search_placeholder}
                            // placeholderTextColor={COLOR_SECONDARY}
                            value={this.state.search}
                            autoCorrect={true}
                            autoFocus={store.moveToSearch ? false : false}
                            returnKeyType='search'
                            onChangeText={(value) => {
                                this.setState({ search: value });
                            }}
                        />
                        <TouchableOpacity onPress={() => { this.getSearchList() }}>
                            <Image source={require('../../images/searching-magnifying.png')} style={{ height: height(3), width: width(5), resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: height(8), width: width(100), backgroundColor: 'rgba(0,0,0,0.9)', flexDirection: 'row', borderColor: 'white', borderWidth: 0, alignItems: 'center' }}>
                    <TouchableOpacity style={{ height: height(5), width: width(33.3), flexDirection: 'row', borderRightWidth: 1, borderRightColor: 'rgba(241,241,241,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('AdvanceSearch', { navigateToScreen: this.navigateToScreen, getSearchList: this.getSearchList })}>
                        <Image source={require('../../images/filterNew.png')} style={{ height: height(3), width: width(5), resizeMode: 'contain', marginHorizontal: 5 }} />
                        <Text style={{ color: 'white', fontSize: totalSize(1.8), fontWeight: '400' }}>{home.filter}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: height(5), width: width(33.3), flexDirection: 'row', borderRightWidth: 1, borderRightColor: 'rgba(241,241,241,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={this._sort} >
                        <Image source={require('../../images/SortNew.png')} style={{ height: height(3), width: width(5), resizeMode: 'contain', marginHorizontal: 5 }} />
                        <Text style={{ color: 'white', fontSize: totalSize(1.8), fontWeight: '400' }}>{home.sort}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: height(5), width: width(33.3), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.resetSearchList()}>
                        <Image source={require('../../images/reload.png')} style={{ height: height(3), width: width(5), resizeMode: 'contain', marginHorizontal: 5 }} />
                        <Text style={{ color: 'white', fontSize: totalSize(1.8), fontWeight: '400' }}>{home.reset}</Text>
                    </TouchableOpacity>
                </View>
                {
                    list !== "" ?
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            {
                                this.state.loading ?
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                                    </View>
                                    :
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        onScroll={({ nativeEvent }) => {
                                            if (this.isCloseToBottom(nativeEvent)) {
                                                if (this.state.reCaller === false) {
                                                    this.loadMore(list.pagination.next_page);
                                                }
                                                this.setState({ reCaller: true })
                                            }
                                        }}
                                        scrollEventThrottle={400}>
                                        <View style={{ height: height(6), width: width(100), backgroundColor: 'white', justifyContent: 'center', marginBottom: 5, alignItems: 'flex-start' }}>
                                            <Text style={{ fontSize: totalSize(2.2), color: COLOR_SECONDARY, marginHorizontal: 15, marginVertical: 10 }}>{list.total_listings}</Text>
                                        </View>
                                        {
                                            list !== "" ?
                                                list.listings.map((item, key) => {
                                                    return (
                                                        <ListingComponent item={item} key={key} listStatus={true} />
                                                    )
                                                })
                                                : null
                                        }
                                        {
                                            list.pagination.has_next_page ?
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
                            }
                        </View>
                        :
                        this.state.loading ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>{orderStore.SEARCHING.LISTING_SEARCH.message}</Text>
                            </View>
                }
                <Modal
                    animationInTiming={200}
                    animationOutTiming={100}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                    avoidKeyboard={true}
                    transparent={true}
                    isVisible={this.state.sorting}
                    onBackdropPress={() => this.setState({ sorting: false })}
                    style={{ flex: 1 }}>
                    <View style={{ height: height(5 + (data.sorting.option_dropdown.length * 6)), width: width(90), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                        <View style={{ height: height(7), width: width(90), flexDirection: 'row', borderBottomWidth: 0.5, alignItems: 'center', borderBottomColor: '#c4c4c4' }}>
                            <View style={{ height: height(5), width: width(80), justifyContent: 'center' }}>
                                <Text style={{ fontSize: totalSize(2), fontWeight: '500', color: COLOR_SECONDARY, marginHorizontal: 10 }}>{data.sorting.title}</Text>
                            </View>
                            <TouchableOpacity style={{ height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: store.settings.data.navbar_clr }} onPress={() => { this._sort() }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        {
                            data.sorting.option_dropdown.map((item, key) => {
                                return (
                                    <TouchableOpacity key={key} style={{ height: height(5), width: width(90), flexDirection: 'row', justifyContent: 'center' }}
                                        onPress={() => { this._sortingModule(item, data.sorting.option_dropdown), item.checkStatus = !item.checkStatus }}
                                    >
                                        <View style={{ height: height(6), width: width(80), justifyContent: 'center', alignItems: 'flex-start' }}>
                                            <Text style={{ fontSize: totalSize(1.6), color: item.checkStatus ? store.settings.data.navbar_clr : COLOR_SECONDARY, marginHorizontal: 10 }}>{item.value}</Text>
                                        </View>
                                        <View style={{ height: height(6), width: width(10), justifyContent: 'center', alignItems: 'center' }}>
                                            <CheckBox
                                                size={16}
                                                uncheckedColor={COLOR_GRAY}
                                                checkedColor={store.settings.data.navbar_clr}
                                                containerStyle={{ backgroundColor: 'transparent', width: width(10), borderWidth: 0 }}
                                                checked={item.checkStatus}
                                                onPress={() => { this._sortingModule(item, data.sorting.option_dropdown), item.checkStatus = !item.checkStatus }}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </View>
                </Modal>
                <View style={{ alignItems: 'center' }}>
                    {
                        settings.has_admob && settings.admob.banner !== '' ?
                            <AdMobBanner
                                adSize={Platform.OS === 'ios' ? "smartBanner" : "smartBannerLandscape"}
                                adUnitID={settings.admob.banner} // 'ca-app-pub-3940256099942544/6300978111' 
                                onAdFailedToLoad={async () => await this.setState({ loadAdd: false })}
                                didFailToReceiveAdWithError={async () => await this.setState({ loadAdd: false })}
                                onAdLoaded={async () => { await this.setState({ loadAdd: true }) }}
                            />
                            :
                            null
                    }
                </View>
            </View>
        );
    }
}