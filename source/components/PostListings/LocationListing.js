import React, { Component } from 'react';
import { Platform, Text, View, TextInput, I18nManager, TouchableOpacity, Picker, ScrollView, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Coupon from 'react-native-vector-icons/FontAwesome';
import CouponCode from 'react-native-vector-icons/EvilIcons';
import RefLink from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import IconDrop from 'react-native-vector-icons/Ionicons';
import Location from 'react-native-vector-icons/EvilIcons';
import MapIcon from 'react-native-vector-icons/AntDesign'
import { COLOR_PRIMARY, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Geolocation from '@react-native-community/geolocation';



import store from '../../Stores/orderStore';
import Modal from "react-native-modal";
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
import { withNavigation } from 'react-navigation';




const inputSize = totalSize(1.5);

@observer class LocationListing extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            predictions: [],
            is_picker: false,
            is_States: false,
            is_City: false,
            is_town: false,
            is_cityPicker: false,
            is_statePicker: false,
            is_townPicker: false,
            couponTitle: '',
            couponCode: '',
            ref_link: '',
            couponExp: '',
            couponDes: '',
            listingLoc: '',
            latitude: null,
            longitude: null,
            sates: {},
            selectedCountry: '',
            selectState: '',
            selectTown: '',
            selectCity: '',
            country_id: '',
            state_id: '',
            city_id: '',
            town_id: '',
            showCity: false,
            showTown: false,
            is_featured: false,
            is_bump: false,
            auto_loading: false
        }
    }

    static navigationOptions = {
        header: null,
    };

    componentWillMount = async () => {
        let data = store.GET_LISTING.data.create_listing;

        await this.setState({
            selectedCountry: data.custom_loc.name || data.custom_loc.placeholder,
            couponTitle: data.coupon.value,
            couponCode: data.coupon_code.value,
            ref_link: data.coupon_link.value,
            couponExp: data.coupon_expiry.value || data.coupon_expiry.placeholder,
            couponDes: data.coupon_desc.value,
            listingLoc: data.street_address.value,
            latitude: data.latt.value,
            longitude: data.long.value,
            country_id: data.custom_loc.value,
            // is_featured: store.GET_LISTING.data.featured_already
        })
        if(data.latt.value==''){
            this.getCurrentPosition()
        }
        if (data.custom_loc.value !== "") {
            await this.selectLocation(data.custom_loc.value, false)
        }
    }
    // getLatLong = async (address) => {
    //     this.setState({ listingLoc: address })
    //     const API_KEY = 'pk.eyJ1IjoiZ2xpeGVuZCIsImEiOiJjazNueGk1MHgxOHd1M2xubXA2a3F1ZjhrIn0.PwzeDhioLVSDVa-4_UyWtQ';  //old play4team
    //     // const API_KEY = '46c366d82550cc';  //old play4team
    //     // const API_KEY = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';  //old play4team
    //     let newaddress=""
    //     if (address.includes('#')) {
    //      newaddress=   address.replace('#', ',')
    //     }
    //     let newurl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + newaddress + '.json?access_token=' + API_KEY
    //     console.log(newurl)
    //     fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?access_token=' + API_KEY)
    //         // fetch('https://us1.locationiq.com/v1/search.php?key=46c366d82550cc&q=' + address +'&format=json')
    //         .then((response) => response.json())
    //         .then(async (responseJson) => {
    //             console.warn('latLong', responseJson);
    //             if (responseJson.status === 'OK') {
    //                 await this.setState({
    //                     latitude: responseJson.results[0].geometry.location.lat,
    //                     longitude: responseJson.results[0].geometry.location.lng,
    //                     predictions: []
    //                 })
    //                 console.warn(this.state.latitude, this.state.longitude);
    //             }
    //         })
    // }


    getCurrentPosition = async () =>{
        Geolocation.getCurrentPosition(async position => {
            await this.getAddress(position.coords.latitude, position.coords.longitude);
            await this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            // this.setState({ currentLoc: false })
          });
      
    }

    getAddress = async (lat, long) => {
        let api_key = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';
        fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + api_key)
          .then((response) => response.json())
          .then(func = async (responseJson) => {
            if (responseJson.status === 'OK') {
              var res = responseJson.results[0].address_components;
              await this.setState({ listingLoc: res[0].long_name + ', ' + res[2].long_name})
            }
          })
      }


     getLatLong = async (address) => {
        this.setState({ listingLoc: address })
        let api_key = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + api_key)
            .then((response) => response.json())
            .then(func = async (responseJson) => {
                // console.warn('latLong', responseJson);
                if (responseJson.status === 'OK') {
                    await this.setState({
                        latitude: responseJson.results[0].geometry.location.lat,
                        longitude: responseJson.results[0].geometry.location.lng,
                        predictions: []
                    })
                    console.warn(this.state.latitude, this.state.longitude);
                }
            })
    }
    placesComplete = async (text) => {
        if (text.length > 0) {
            // const API_KEY = 'AIzaSyDVcpaziLn_9wTNCWIG6K09WKgzJQCW2tI'; // new
            const API_KEY = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';  //old play4team
            // const API_KEY = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';  //old play4team
            fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + text + '&types=address' + '&key=' + API_KEY)
                .then((response) => response.json())
                .then(async (responseJson) => {
                    // console.log('result Places AutoComplete===>>', responseJson);
                    if (responseJson.status === 'OK') {
                        await this.setState({ predictions: responseJson.predictions })
                    }
                }).catch((error) => {
                    console.log('error', error);
                });
        } else {
            this.setState({ predictions: [] })
        }
    }
    selectLocation = async (itemValue, state) => {
        let data = store.GET_LISTING.data.create_listing;
        this.setState({ country_id: itemValue, auto_loading: state })
        if (itemValue !== '') {
            data.custom_loc.dropdown.forEach(item => {
                if (item.location_id === itemValue) {
                    this.setState({ selectedCountry: item.name })
                }
            });
        }
        else {
            this.setState({ selectedCountry: data.custom_loc.placeholder })
        }
        await this.getStates(itemValue)
    }
    selectStates = async (itemValue) => {
        let data = store.STATES.locations;
        this.setState({ state_id: itemValue })
        if (itemValue !== '') {
            data.dropdown.forEach(item => {
                if (item.location_id === itemValue) {
                    this.setState({ selectState: item.name })
                }
            });
        } else {
            this.setState({ selectState: data.placeholder })
        }

        await this.getCities(itemValue)
    }
    selectCity = async (itemValue) => {
        let data = store.CITIES.locations;
        await this.setState({ city_id: itemValue })
        if (itemValue !== '') {
            data.dropdown.forEach(item => {
                if (item.location_id === itemValue) {
                    this.setState({ selectCity: item.name })
                }
            });
        } else {
            this.setState({ selectCity: data.placeholder })
        }

        await this.getTowns(itemValue)
    }
    selectTown = async (itemValue) => {
        let data = store.TOWNS.locations;
        await this.setState({ town_id: itemValue })
        if (itemValue !== '') {
            data.dropdown.forEach(item => {
                if (item.location_id === itemValue) {
                    this.setState({ selectTown: item.name })
                }
            });
        } else {
            this.setState({ selectTown: data.placeholder })
        }
        this.setState({ is_townPicker: false })
    }
    getStates = async (id) => {
        await this.setState({ is_picker: false, is_States: true, showCity: false, showTown: false })
        let params = { location_id: id, level: '2', listing_id: !this.state.auto_loading ? store.LIST_ID : '' }
        try {
            let response = await ApiController.post('get-locations', params);
            console.log('states===>>>', response);

            store.STATES = response.data;
            if (response.success) {
                if (store.STATES.has_sub_location === false) {
                    this.setState({
                        state_id: '',
                        selectState: '',
                        city_id: '',
                        selectCity: ''
                    })
                } else {
                    await this.setState({
                        selectState: response.data.locations.name || response.data.locations.placeholder,
                        state_id: response.data.locations.value
                    })
                    if (response.data.locations.value !== "" && this.state.auto_loading === false) {
                        await this.getCities(response.data.locations.value)
                    }
                }
                await this.setState({ is_States: false, showCity: !this.state.auto_loading ? true : false, showTown: !this.state.auto_loading ? true : false })
            } else {
                // Toast.show(response.message)
                this.setState({ is_States: false })
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }
    getCities = async (id) => {
        this.setState({ is_statePicker: false, is_City: true })
        try {
            let response = await ApiController.post('get-locations', { location_id: id, level: '3', listing_id: !this.state.auto_loading ? store.LIST_ID : '' });
            console.log('cities===>>>', response);

            store.CITIES = response.data;
            if (response.success) {
                if (store.CITIES.has_sub_location === false) {
                    this.setState({
                        city_id: ''
                    })
                }
                else {
                    await this.setState({
                        selectCity: response.data.locations.name || response.data.locations.placeholder,
                        city_id: response.data.locations.value,
                    })
                    if (response.data.locations.value !== "" && this.state.auto_loading === false) {
                        await this.getTowns(response.data.locations.value)
                    }
                }
                await this.setState({ is_City: false, showCity: true, showTown: !this.state.auto_loading ? true : false })
            } else {
                this.setState({ is_City: false })
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }
    getTowns = async (id) => {
        this.setState({ is_cityPicker: false, is_town: true })
        try {
            let response = await ApiController.post('get-locations', { location_id: id, level: '4', listing_id: !this.state.auto_loading ? store.LIST_ID : '' });
            console.log('towns===>>>', response);

            store.TOWNS = response.data;
            if (response.success) {
                if (store.TOWNS.has_sub_location === false) {
                    this.setState({
                        town_id: '',
                    })
                } else {
                    await this.setState({
                        selectTown: response.data.locations.name || response.data.locations.placeholder,
                        town_id: response.data.locations.value,
                    })
                }
                await this.setState({ is_town: false, showTown: true })
            } else {
                this.setState({ is_town: false })
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }
    createListing = async () => {
        store.LISTING_OBJ.coupon_title = this.state.couponTitle;
        store.LISTING_OBJ.coupon_code = this.state.couponCode;
        store.LISTING_OBJ.coupon_referral = this.state.ref_link;
        store.LISTING_OBJ.coupon_exp = this.state.couponExp;
        store.LISTING_OBJ.coupon_desc = this.state.couponDes;
        store.LISTING_OBJ.street_addr = this.state.listingLoc;
        store.LISTING_OBJ.lat = this.state.latitude;
        store.LISTING_OBJ.long = this.state.longitude;
        store.LISTING_OBJ.country = this.state.country_id;
        store.LISTING_OBJ.country = this.state.country_id;
        store.LISTING_OBJ.state = this.state.state_id;
        store.LISTING_OBJ.city = this.state.city_id;
        store.LISTING_OBJ.town = this.state.town_id;
        store.LISTING_OBJ.is_bump = this.state.is_bump ? '1' : '';
        store.LISTING_OBJ.is_featured = this.state.is_featured ? '1' : '';
        if (store.LISTING_UPDATE) {
            store.LISTING_OBJ.is_update = store.LIST_ID
        } else {
            store.LISTING_OBJ.is_update = ''
        }
        console.log('storePrice', store.LISTING_OBJ);
    }
    clearStore = async () => {
        //clear mobx store
        store.LISTING_OBJ = {};
        store.TAGS = [];
        store.AMENITIES = {};
        store.FROM_ARR = [];
        store.TO_ARR = [];
        store.SHOP_OPENED = [];
        store.STATES = {};
        store.CITIES = {};
        store.TOWNS = {};
        store.CHECKED = false;
        store.LISTING_UPDATE = false;
        store.LIST_ID = '';
        //clear local states
        await this.setState({
            loading: false,
            predictions: [],
            is_picker: false,
            is_States: false,
            is_City: false,
            is_town: false,
            is_cityPicker: false,
            is_statePicker: false,
            is_townPicker: false,
            couponTitle: '',
            couponCode: '',
            ref_link: '',
            couponExp: '',
            couponDes: '',
            listingLoc: '',
            sates: {},
            // selectedCountry: '',
            selectState: '',
            selectTown: '',
            selectCity: '',
            country_id: '',
            state_id: '',
            city_id: '',
            town_id: '',
            showCity: false,
            showTown: false,
            is_featured: false,
            is_bump: false,
            auto_loading: false
        })
    }
    postListing = async () => {
        this.setState({ loading: true })
        let data = store.GET_LISTING.data.create_listing;
        data.days.dropdown.forEach(async (item) => {
            if (item.added) {
                store.SHOP_OPENED.push(item.closedValue);
            }
        });
        store.LISTING_OBJ.is_closed = store.SHOP_OPENED.join();

        
        try {
            let response = await ApiController.post('post-listing', store.LISTING_OBJ);
            if (response.success) {
                this.setState({ loading: false })
                await this.clearStore()
                this.props.navigation.push('FeatureDetailTabBar', { listId: response.listing_id, list_title: response.listing_title })
            } else {
                Toast.show(response.message)
                this.setState({ loading: false })
            }
            console.log('res===>>>', response);
        } catch (error) {
            this.setState({ loading: false })
            console.log('error: ', error);
        }
    }
    render() {
        this.createListing()
        let main_clr = store.settings.data.main_clr;
        let data = store.GET_LISTING.data.create_listing;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    {
                        store.GET_LISTING.data.is_coupon_code ?
                            <View>
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.coupon.main_title}</Text>
                                    <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                        <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                            <Coupon name="cut" size={24} color="#c4c4c4" />
                                        </View>
                                        <TextInput
                                            onChangeText={(value) => { this.setState({ couponTitle: value }) }}
                                            placeholder={data.coupon.placeholder}
                                            value={this.state.couponTitle}
                                            placeholderTextColor='gray'
                                            underlineColorAndroid='transparent'
                                            autoCorrect={true}
                                            style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.coupon_code.main_title}</Text>
                                    <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                        <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                            <CouponCode name="lock" size={30} color="#c4c4c4" />
                                        </View>
                                        <TextInput
                                            onChangeText={(value) => { this.setState({ couponCode: value }) }}
                                            placeholder={data.coupon_code.placeholder}
                                            value={this.state.couponCode}
                                            placeholderTextColor='gray'
                                            underlineColorAndroid='transparent'
                                            autoCorrect={true}
                                            style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.coupon_link.main_title}</Text>
                                    <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                        <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                            <RefLink name="ios-link" size={26} color="#c4c4c4" />
                                        </View>
                                        <TextInput
                                            onChangeText={(value) => { this.setState({ ref_link: value }) }}
                                            placeholder={data.coupon_link.placeholder}
                                            value={this.state.ref_link}
                                            placeholderTextColor='gray'
                                            underlineColorAndroid='transparent'
                                            autoCorrect={true}
                                            style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.coupon_expiry.main_title}</Text>
                                    <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                        <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                            <CouponCode name="clock" size={26} color="#c4c4c4" />
                                        </View>
                                        <DatePicker
                                            style={{ height: height(6), width: width(50), backgroundColor: 'transparent', alignSelf: 'center' }}
                                            date={this.state.couponExp}
                                            mode="datetime"
                                            androidMode='spinner' //spinner
                                            showIcon={false}
                                            placeholder={this.state.couponExp}
                                            duration={400}
                                            format="MM/DD/YYYY hh:mm a"
                                            minDate="1/12/2018"
                                            maxDate="1/12/2030"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            disabled={false}
                                            is24Hour={true}
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 2,
                                                    marginTop: 6,
                                                    height: 20,
                                                    width: 20
                                                },
                                                dateInput: {
                                                    marginLeft: 0,
                                                    borderWidth: 0,
                                                }
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => { this.setState({ couponExp: date }) }}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.coupon_desc.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                                    <TextInput
                                        onChangeText={(value) => { this.setState({ couponDes: value }) }}
                                        placeholder={data.coupon_desc.placeholder}
                                        value={this.state.couponDes}
                                        multiline={true}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={[{ height: height(15), width: width(90), fontSize: inputSize, backgroundColor: 'transparent', paddingHorizontal: 10, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                                    />
                                </View>
                            </View>
                            :
                            null
                    }
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.street_address.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Location name="location" size={24} color="#c4c4c4" />
                            </View>
                            <TextInput
                                onChangeText={(value) => { this.setState({ listingLoc: value }), this.placesComplete(value) }}
                                placeholder={data.street_address.placeholder}
                                value={this.state.listingLoc}
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 }}
                            />
                        </View>
                    </View>
                    {
                        this.state.predictions.length > 0 ?
                            <View style={{ alignSelf: 'center', width: width(90), backgroundColor: 'white', marginVertical: 5, elevation: 3, marginHorizontal: 5, shadowOpacity: 0.4 }}>
                                <ScrollView>
                                    {
                                        this.state.predictions.map((item, key) => {
                                            return (
                                                <TouchableOpacity key={key} style={{ height: height(6), width: width(90), justifyContent: 'center', alignItems: 'flex-start', marginBottom: 0.5, backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: COLOR_GRAY }}
                                                    onPress={() => this.getLatLong(item.description)}
                                                >
                                                    <Text style={{ marginHorizontal: 10 }}>{item.description}</Text>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </ScrollView>
                            </View>
                            : null
                    }
                    {/* <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, flexDirection: 'row' }}>
                        <View style={{ marginRight: 8, alignItems: 'flex-start' }}>
                            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.latt.main_title}</Text>
                            <View style={{ height: height(6), width: width(44), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                <View style={{ height: height(6), width: width(10), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                    <MapIcon name="pushpino" size={20} color="#c4c4c4" />
                                </View>
                                <Text style={{ fontSize: totalSize(1.6), alignSelf: 'center', color: 'black', paddingHorizontal: 7 }}>{this.state.latitude !== "" ? parseFloat(this.state.latitude).toFixed(4) : data.latt.placeholder}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.long.main_title}</Text>
                            <View style={{ height: height(6), width: width(44), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                <View style={{ height: height(6), width: width(10), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                    <MapIcon name="pushpino" size={20} color="#c4c4c4" />
                                </View>
                                <Text style={{ fontSize: totalSize(1.6), alignSelf: 'center', color: 'black', paddingHorizontal: 7 }}>{this.state.longitude !== "" ? parseFloat(this.state.longitude).toFixed(4) : data.long.placeholder}</Text>
                            </View>
                        </View>
                    </View> */}
                    {/* <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                        <MapView
                            ref={(ref) => this.mapView = ref}
                            zoomEnabled={true}
                            zoomControlEnabled={true}
                            showsBuildings={true}
                            showsIndoors={true}
                            provider={PROVIDER_GOOGLE}
                            showsMyLocationButton={true}
                            showsUserLocation={true}
                            followsUserLocation={true}
                            minZoomLevel={5}
                            maxZoomLevel={20}
                            mapType={"standard"}
                            loadingEnabled={true}
                            loadingIndicatorColor={'#ffffff'}
                            loadingBackgroundColor='gray'
                            moveOnMarkerPress={false}
                            style={{
                                height: height(40),
                                width: width(90),
                                zIndex: -10,
                                // position: 'absolute'
                            }}
                            region={{
                                latitude: this.state.latitude !== "" ? parseFloat(this.state.latitude) : 31.582045,
                                longitude: this.state.longitude !== "" ? parseFloat(this.state.longitude) : 74.329376,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421
                            }}
                        >
                            {
                                this.state.latitude !== "" && this.state.longitude !== "" ?
                                    <MapView.Marker
                                        coordinate={
                                            { latitude: parseFloat(this.state.latitude), longitude: parseFloat(this.state.longitude) }
                                        }
                                        title={'Current location'}
                                        description={'I am here'}
                                        pinColor={'#3edc6d'}
                                    />
                                    :
                                    null
                            }
                        </MapView>
                    </View> */}
                    {
                        store.GET_LISTING.data.custom_location ?
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginVertical: 5 }}>{data.custom_loc.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                                {
                                    Platform.OS === 'android' ?
                                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                            <Picker
                                                selectedValue={parseInt(this.state.country_id)}
                                                style={{ height: height(6), width: width(90), color: 'gray' }}
                                                onValueChange={(itemValue, itemIndex) => this.selectLocation(itemValue, true)}>
                                                <Picker.Item label={data.custom_loc.placeholder} value='' />
                                                {
                                                    data.custom_loc.dropdown.map((item, key) => {
                                                        return (
                                                            <Picker.Item key={key} label={item.name} value={item.location_id} />
                                                        );
                                                    })
                                                }
                                            </Picker>
                                        </View>
                                        :
                                        <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, marginVertical: 5 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                                            <View style={{ alignItems: 'flex-start', width: width(78) }}>
                                                <Text style={{ marginHorizontal: 8 }}>{this.state.selectedCountry}</Text>
                                            </View>
                                            <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                        </TouchableOpacity>
                                }
                            </View>
                            :
                            null
                    }
                    {
                        this.state.is_States ?
                            <View style={{ width: width(90), alignItems: 'center' }}>
                                <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                            </View>
                            :
                            store.STATES.has_sub_location && store.STATES !== '' ?
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginVertical: 5 }}>{store.STATES.locations.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                                    {
                                        Platform.OS === 'android' ?
                                            <View style={{ height: height(6), width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                                <Picker
                                                    selectedValue={parseInt(this.state.state_id)}
                                                    style={{ height: height(6), width: width(90), color: 'gray' }}
                                                    onValueChange={(itemValue, itemIndex) => this.selectStates(itemValue)}>
                                                    <Picker.Item label={store.STATES.has_sub_location ? store.STATES.locations.placeholder : ''} value='' />
                                                    {
                                                        store.STATES.locations.dropdown.map((item, key) => {
                                                            return (
                                                                <Picker.Item key={key} label={item.name} value={item.location_id} />
                                                            );
                                                        })
                                                    }
                                                </Picker>
                                            </View>
                                            :
                                            <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, marginVertical: 5 }} onPress={() => this.setState({ is_statePicker: !this.state.is_statePicker })}>
                                                <View style={{ alignItems: 'flex-start', width: width(78) }}>
                                                    <Text style={{ marginHorizontal: 8 }}>{this.state.selectState}</Text>
                                                </View>
                                                <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                            </TouchableOpacity>
                                    }
                                </View>
                                :
                                null
                    }
                    {
                        this.state.is_City ?
                            <View style={{ width: width(90), alignItems: 'center' }}>
                                <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                            </View>
                            :
                            store.CITIES.has_sub_location && store.STATES.has_sub_location && this.state.showCity ?
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginVertical: 5 }}>{store.CITIES.locations.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                                    {
                                        Platform.OS === 'android' ?
                                            <View style={{ height: height(6), width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                                <Picker
                                                    selectedValue={parseInt(this.state.city_id)}
                                                    style={{ height: height(6), width: width(90), color: 'gray' }}
                                                    onValueChange={(itemValue, itemIndex) => this.selectCity(itemValue)}>
                                                    <Picker.Item label={store.CITIES.has_sub_location ? store.CITIES.locations.placeholder : ''} value='' />
                                                    {
                                                        store.CITIES.locations.dropdown.map((item, key) => {
                                                            return (
                                                                <Picker.Item key={key} label={item.name} value={item.location_id} />
                                                            );
                                                        })
                                                    }
                                                </Picker>
                                            </View>
                                            :
                                            <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, marginVertical: 5 }} onPress={() => this.setState({ is_cityPicker: !this.state.is_cityPicker })}>
                                                <View style={{ alignItems: 'flex-start', width: width(78) }}>
                                                    <Text style={{ marginHorizontal: 8 }}>{this.state.selectCity}</Text>
                                                </View>
                                                <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                            </TouchableOpacity>

                                    }
                                </View>
                                :
                                null
                    }

                    {
                        this.state.is_town ?
                            <View style={{ width: width(90), alignItems: 'center' }}>
                                <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                            </View>
                            :

                            store.TOWNS.has_sub_location && store.STATES.has_sub_location && store.CITIES.has_sub_location && this.state.showTown ?
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginVertical: 5 }}>{store.TOWNS.locations.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                                    {
                                        Platform.OS === 'android' ?
                                            <View style={{ height: height(6), width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                                <Picker
                                                    selectedValue={parseInt(this.state.town_id)}
                                                    style={{ height: height(6), width: width(90), color: 'gray' }}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.setState({ town_id: itemValue })
                                                    }>
                                                    <Picker.Item label={store.TOWNS.has_sub_location ? store.TOWNS.locations.placeholder : ''} value='' />
                                                    {
                                                        store.TOWNS.locations.dropdown.map((item, key) => {
                                                            return (
                                                                <Picker.Item key={key} label={item.name} value={item.location_id} />
                                                            );
                                                        })
                                                    }
                                                </Picker>
                                            </View>
                                            :
                                            <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, marginVertical: 5 }} onPress={() => this.setState({ is_townPicker: !this.state.is_townPicker })}>
                                                <View style={{ alignItems: 'flex-start', width: width(78) }}>
                                                    <Text style={{ marginHorizontal: 8 }}>{this.state.selectTown}</Text>
                                                </View>
                                                <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                            </TouchableOpacity>

                                    }
                                </View>
                                :
                                null
                    }
                    {
                        store.GET_LISTING.data.can_featured ?
                            <View style={{ height: height(8), flexDirection: 'row', width: width(90), marginBottom: 10, alignItems: 'center', backgroundColor: '#e3f8f5', alignSelf: 'center', marginTop: 10 }}>
                                {
                                    store.GET_LISTING.data.featured_already ?
                                        <Text style={{ color: 'black', fontSize: 14, marginHorizontal: 10 }}>{store.GET_LISTING.data.already_featured}</Text>
                                        :
                                        <CheckBox
                                            title={store.GET_LISTING.data.featured_text}
                                            checkedColor={main_clr}
                                            textStyle={{ marginRight: 0, marginLeft: 3 }}
                                            containerStyle={{ marginLeft: 0, marginRight: 10, marginVertical: 0, borderWidth: 0, backgroundColor: 'transparent', width: width(90) }}
                                            size={18}
                                            checked={this.state.is_featured}
                                            onPress={() => this.setState({ is_featured: !this.state.is_featured })}
                                        />
                                }
                            </View>
                            :
                            null
                    }
                    {
                        store.GET_LISTING.data.can_bump ?
                            <View style={{ height: height(8), flexDirection: 'row', width: width(90), marginBottom: 10, alignItems: 'center', backgroundColor: '#fde5e7', alignSelf: 'center' }}>
                                <CheckBox
                                    title={store.GET_LISTING.data.bump_text}
                                    checkedColor={main_clr}
                                    textStyle={{ marginRight: 0, marginLeft: 3 }}
                                    containerStyle={{ marginLeft: 0, marginRight: 10, marginVertical: 0, borderWidth: 0, backgroundColor: 'transparent', width: width(90) }}
                                    size={18}
                                    checked={this.state.is_bump}
                                    onPress={() => this.setState({ is_bump: !this.state.is_bump })}
                                />
                            </View>
                            :
                            null
                    }
                    {
                        store.settings.data.is_demo_mode ?
                            <View style={{ marginHorizontal: 10, marginBottom: 10, backgroundColor: main_clr, width: width(90), borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: 'white', fontSize: 16, marginVertical: 10, fontWeight: 'bold' }}>{store.settings.data.demo_mode_txt}</Text>
                            </View>
                            :
                            <TouchableOpacity style={{ marginHorizontal: 10, marginBottom: 10, backgroundColor: main_clr, width: width(90), borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}
                                onPress={() => { this.postListing() }}
                            >
                                {console.log(store.GET_LISTING.data.btn_text)}
                                <Text style={{ color: 'white', fontSize: 16, marginVertical: 10, fontWeight: 'bold' }}>{store.GET_LISTING.data.btn_text}</Text>
                            </TouchableOpacity>
                    }
                </ScrollView>
                {
                    this.state.loading ?
                        <View style={{ height: height(90), width: width(100), position: 'absolute', backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                        </View>
                        :
                        null
                }
                <Modal
                    animationInTiming={500}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    avoidKeyboard={true}
                    // transparent={false}
                    isVisible={this.state.is_picker}
                    onBackdropPress={() => this.setState({ is_picker: false })}
                    style={{ flex: 1, marginTop: 275 }}>
                    <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                        <View style={{ height: height(4), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_picker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Picker
                                selectedValue={this.state.country_id}
                                style={{ height: height(6), width: width(100), color: 'gray' }}
                                onValueChange={(itemValue, itemIndex) => this.selectLocation(itemValue, true)}>
                                <Picker.Item label={data.custom_loc.placeholder} value='' />
                                {
                                    data.custom_loc.dropdown.map((item, key) => {
                                        return (
                                            <Picker.Item key={key} label={item.name} value={item.location_id} />
                                        );
                                    })
                                }
                            </Picker>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationInTiming={500}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    avoidKeyboard={true}
                    // transparent={false}
                    isVisible={this.state.is_statePicker}
                    onBackdropPress={() => this.setState({ is_statePicker: false })}
                    style={{ flex: 1, marginTop: 275 }}>
                    <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                        <View style={{ height: height(4), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_statePicker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Picker
                                selectedValue={this.state.state_id}
                                style={{ height: height(6), width: width(100), color: 'gray' }}
                                onValueChange={(itemValue, itemIndex) => this.selectStates(itemValue)}>
                                <Picker.Item label={store.STATES.has_sub_location ? store.STATES.locations.placeholder : ''} value='' />
                                {
                                    store.STATES.has_sub_location ?
                                        store.STATES.locations.dropdown.map((item, key) => {
                                            return (
                                                <Picker.Item key={key} label={item.name} value={item.location_id} />
                                            );
                                        })
                                        :
                                        null
                                }
                            </Picker>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationInTiming={500}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    avoidKeyboard={true}
                    // transparent={false}
                    isVisible={this.state.is_cityPicker}
                    onBackdropPress={() => this.setState({ is_cityPicker: false })}
                    style={{ flex: 1, marginTop: 275 }}>
                    <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                        <View style={{ height: height(4), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_cityPicker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Picker
                                selectedValue={this.state.city_id}
                                style={{ height: height(6), width: width(100), color: 'gray' }}
                                onValueChange={(itemValue, itemIndex) => this.selectCity(itemValue)}>
                                <Picker.Item label={store.CITIES.has_sub_location ? store.CITIES.locations.placeholder : ''} value='' />
                                {
                                    store.CITIES.has_sub_location ?
                                        store.CITIES.locations.dropdown.map((item, key) => {
                                            return (
                                                <Picker.Item key={key} label={item.name} value={item.location_id} />
                                            );
                                        })
                                        :
                                        null
                                }
                            </Picker>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationInTiming={500}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    avoidKeyboard={true}
                    // transparent={false}
                    isVisible={this.state.is_townPicker}
                    onBackdropPress={() => this.setState({ is_townPicker: false })}
                    style={{ flex: 1, marginTop: 275 }}>
                    <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                        <View style={{ height: height(4), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_townPicker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Picker
                                selectedValue={this.state.town_id}
                                style={{ height: height(6), width: width(100), color: 'gray' }}
                                onValueChange={(itemValue, itemIndex) => this.selectTown(itemValue)}>
                                <Picker.Item label={store.TOWNS.has_sub_location ? store.TOWNS.locations.placeholder : ''} value='' />
                                {
                                    store.TOWNS.has_sub_location ?
                                        store.TOWNS.locations.dropdown.map((item, key) => {
                                            return (
                                                <Picker.Item key={key} label={item.name} value={item.location_id} />
                                            );
                                        })
                                        :
                                        null
                                }
                            </Picker>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default withNavigation(LocationListing)