import React, { Component } from 'react';
import { Platform, Text, View, TextInput,I18nManager, TouchableOpacity, Picker, ScrollView, ActivityIndicator, Image } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconG from 'react-native-vector-icons/Entypo';
import IconDrop from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import MapIcon from 'react-native-vector-icons/FontAwesome5'
import { COLOR_SECONDARY, COLOR_PRIMARY, COLOR_SECTIONS } from '../../../styles/common';
import { observer } from 'mobx-react';
import DatePicker from 'react-native-datepicker';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
import { withNavigation } from 'react-navigation';
const inputSize = totalSize(1.5);
@observer class PricingListing extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            refresher: false,
            is_pricePicker: false,
            is_currencyPicker: false,
            is_timezonePicker: false,
            category: '',
            price_id: '',
            price_name: '',
            currency_id: '',
            currency_name: '',
            price_from: '',
            price_to: '',
            hour_NA: true,
            hour_24: false,
            hour_selected: false,
            checkBox: false,
            fbURL: '',
            twURL: '',
            gURL: '',
            inURL: '',
            youtubeURL: '',
            insURL: '',
            dateFrom: '',
            DateTo: '',
            selectedDay: '',
            timezone: 'America/Bogota'
        }
    }
    static navigationOptions = {
        header: null,
    };
    componentWillMount = async () => {
        let data = store.GET_LISTING.data.create_listing;

        //initially setting first day active
        data.days.dropdown.forEach(item => {
            if (item.id === 0) {
                item.checkStatus = true;
                this.setState({ selectedDay: item.day_name, dateFrom: item.start_time, DateTo: item.end_time })
            }
        });

        await this.setState({
            price_id: data.price_type.value,
            price_name: data.price_type.name || data.price_type.placeholder,
            currency_id: data.currency_type.value,
            currency_name: data.currency_type.name || data.currency_type.placeholder,
            price_from: data.price_from.value,
            price_to: data.price_to.value,
            timezone: 'America/Bogota',
            fbURL: data.fb.value,
            twURL: data.tw.value,
            gURL: data.tw.value,
            inURL: data.in.value,
            youtubeURL: data.youtube.value,
            insURL: data.insta.value,
            timezone: 'America/Bogota'
        })
        await this.selectBusinessHours(parseInt(data.business_hours.value));
    }
    selectPriceType = (itemValue) => {
        let data = store.GET_LISTING.data.create_listing;
        this.setState({ price_id: itemValue })
        data.price_type.dropdown.forEach(item => {
            if (item.id === itemValue) {
                this.setState({ price_name: item.name })
            }
        });
    }
    selectCurrencyType = (itemValue) => {
        let data = store.GET_LISTING.data.create_listing;
        this.setState({ currency_id: itemValue })
        data.currency_type.dropdown.forEach(item => {
            if (item.id === itemValue) {
                this.setState({ currency_name: item.name })
            }
        });
    }
    selectDays = async (day) => {
        let data = store.GET_LISTING.data.create_listing;
        data.days.dropdown.forEach(async (item) => {
            if (day.id === item.id && day.day_name === item.day_name) {
                item.checkStatus = true;
                store.CHECKED = item.added;
                this.setState({ checkBox: item.added })
                await this.setState({ selectedDay: item.day_name, dateFrom: item.start_time, DateTo: item.end_time })
            } else {
                item.checkStatus = false;
            }
        });

    }
    setDaysTiming = async (text, timeZone) => {
        store.FROM_ARR = []; store.TO_ARR = [];
        let data = store.GET_LISTING.data.create_listing;
        data.days.dropdown.forEach(async (item) => {
            if (this.state.selectedDay === item.day_name && timeZone === 'start') {
                item.start_time = text;
            }
            if (this.state.selectedDay === item.day_name && timeZone === 'end') {
                item.end_time = text;
            }
            store.FROM_ARR.push(item.start_time);
            store.TO_ARR.push(item.end_time);
            this.setState({ refresher: false })
        });
    }
    isCheckBox = async () => {
        store.SHOP_OPENED = [];
        let data = store.GET_LISTING.data.create_listing;
        data.days.dropdown.forEach(async (item, key) => {
            if (this.state.selectedDay === item.day_name) {
                item.added = !item.added;
                store.CHECKED = item.added;
                this.setState({ checkBox: item.added })
            }
        });
    }
    selectBusinessHours = async (value) => {
        switch (value) {
            case 0:
                this.setState({ hour_NA: true, hour_24: false, hour_selected: false });
                break;
            case 1:
                this.setState({ hour_NA: false, hour_24: true, hour_selected: false });
                break;
            case 2:
                this.makeArr()
                break;
        }
    }
    makeArr = () => {
        store.FROM_ARR = []; store.TO_ARR = [];
        let data = store.GET_LISTING.data.create_listing;
        data.days.dropdown.forEach(async (item) => {
            store.FROM_ARR.push(item.start_time);
            store.TO_ARR.push(item.end_time);
        });
        this.setState({ hour_NA: false, hour_24: false, hour_selected: true })
    }

    createListing = async () => {
        store.LISTING_OBJ.price_type = this.state.price_id;
        store.LISTING_OBJ.currency_type = this.state.currency_id;
        store.LISTING_OBJ.pricefrom = this.state.price_from;
        store.LISTING_OBJ.priceto = this.state.price_to;
        store.LISTING_OBJ.fb = this.state.fbURL;
        store.LISTING_OBJ.tw = this.state.twURL;
        store.LISTING_OBJ.linkedin = this.state.inURL;
        store.LISTING_OBJ.youtube = this.state.youtubeURL;
        store.LISTING_OBJ.insta = this.state.insURL;
        store.LISTING_OBJ.hours_type = this.state.hour_NA ? '0' : this.state.hour_24 ? '1' : this.state.hour_selected ? '2' : ''
        store.LISTING_OBJ.from = store.FROM_ARR.join(); // convert array into string  by using join()
        store.LISTING_OBJ.to = store.TO_ARR.join(); // convert array into string by using join()
        store.LISTING_OBJ.timezone = 'America/Bogota';

        // console.log('storePrice', store.LISTING_OBJ);
    }
    render() {
        this.createListing()
        let data = store.GET_LISTING.data.create_listing;
        let main_clr = store.settings.data.main_clr;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    {
                        store.GET_LISTING.data.is_price_range ?
                            <View style={{ alignItems: 'flex-start' }}>
                                <Text style={{ color: COLOR_SECONDARY, marginVertical: 7, fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>{data.price_type.main_title}</Text>
                                <View style={{ width: width(95), borderRadius: 4, backgroundColor: COLOR_SECTIONS }}>
                                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                                        {/* <Text style={{ width: width(61), fontSize: 14, marginVertical: 7, color: 'black' }}>{data.price_type.main_title}<Text style={{ color: 'red' }}>*</Text></Text> */}
                                        {
                                            Platform.OS === 'android' ?
                                                <View style={{ height: height(6), width: width(90), marginTop: 15, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                                    <Picker
                                                        selectedValue={parseInt(this.state.price_id)}
                                                        style={{ height: height(6), width: width(90), color: 'gray' }}
                                                        onValueChange={(itemValue, itemIndex) =>
                                                            this.setState({ price_id: itemValue })
                                                        }>
                                                        <Picker.Item label={data.price_type.placeholder} value='' />
                                                        {
                                                            data.price_type.dropdown.map((item, key) => {
                                                                return (
                                                                    <Picker.Item key={key} label={item.name} value={item.id} />
                                                                );
                                                            })
                                                        }
                                                    </Picker>
                                                </View>
                                                :
                                                <TouchableOpacity style={{ height: height(6), width: width(90), marginTop: 15, backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }} onPress={() => this.setState({ is_pricePicker: !this.state.is_pricePicker })}>
                                                    <View style={{ width: width(78), alignItems: 'flex-start' }}>
                                                        <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{this.state.price_name}</Text>
                                                    </View>
                                                    <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                                </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: 14, marginVertical: 7, color: 'black', }}>{data.currency_type.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                                        {
                                            Platform.OS === 'android' ?
                                                <View style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                                    <Picker
                                                        selectedValue={parseInt(this.state.currency_id)}
                                                        style={{ height: height(6), width: width(90), color: 'gray' }}
                                                        onValueChange={(itemValue, itemIndex) => {
                                                        //     console.log('itemval-itemindex',itemValue+"-"+)
                                                        //    if(itemValue!=undefined){
                                                        //     let valx = itemValue
                                                        //     console.log('valx',valx)
                                                        //     if (itemValue.includes('|')) {
                                                        //         let temp = itemValue.split('|')
                                                        //         valx = temp[0]
                                                        //     }
                                                        //     console.log('currency', valx)
                                                        //    }
                                                           this.setState({ currency_id: itemValue })

                                                        
                                                        }
                                                        }>
                                                        <Picker.Item label={data.currency_type.placeholder} value='' />
                                                        {
                                                            data.currency_type.dropdown.map((item, key) => {
                                                               
                                                                        return (

                                                                            <Picker.Item key={key} label={item.name} value={item.id_currency} />
                                                                        );
                                                             

                                                            })
                                                        }
                                                    </Picker>
                                                </View>
                                                :
                                                <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }} onPress={() => this.setState({ is_currencyPicker: !this.state.is_currencyPicker })}>
                                                    <View style={{ width: width(78), alignItems: 'flex-start' }}>
                                                        <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{this.state.currency_name}</Text>
                                                    </View>
                                                    <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                                </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 20 }}>
                                        <View style={{ marginVertical: 5, marginTop: 10, alignItems: 'flex-start', alignItems: 'flex-start' }}>
                                            <Text style={{ marginVertical: 7, fontSize: 14, color: 'black' }}>{data.price_from.main_title}</Text>
                                            <View style={{ height: height(6), width: width(43), backgroundColor: COLOR_PRIMARY, flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                                <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                                    <MapIcon name="money-bill-wave" size={20} color="#c4c4c4" />
                                                </View>
                                                <TextInput
                                                    onChangeText={(value) => { this.setState({ price_from: value }) }}
                                                    keyboardType='phone-pad'
                                                    scrollEnabled={false}
                                                    placeholder={data.price_from.placeholder}
                                                    value={this.state.price_from}
                                                    placeholderTextColor='gray'
                                                    underlineColorAndroid='transparent'
                                                    autoCorrect={true}
                                                    style={[{ height: height(6), width: width(43), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10, },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ marginVertical: 5, marginTop: 10, marginLeft: 10, alignItems: 'flex-start' }}>
                                            <Text style={{ marginVertical: 7, fontSize: 14, color: 'black' }}>{data.price_to.main_title}</Text>
                                            <View style={{ height: height(6), width: width(44), flexDirection: 'row', backgroundColor: COLOR_PRIMARY, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                                <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                                    <MapIcon name="money-bill-wave" size={20} color="#c4c4c4" />
                                                </View>
                                                <TextInput
                                                    onChangeText={(value) => { this.setState({ price_to: value }) }}
                                                    keyboardType='phone-pad'
                                                    scrollEnabled={false}
                                                    placeholder={data.price_to.placeholder}
                                                    value={this.state.price_to}
                                                    placeholderTextColor='gray'
                                                    underlineColorAndroid='transparent'
                                                    autoCorrect={true}
                                                    style={[{ height: height(6), width: width(43), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            :
                            null
                    }
                    {
                        store.GET_LISTING.data.is_business_hours ?
                            <View style={{ marginTop: 30, alignItems: 'flex-start' }}>
                                <Text style={{ color: COLOR_SECONDARY, marginVertical: 7, fontSize: 14, fontWeight: 'bold', marginHorizontal: 10 }}>{store.GET_LISTING.data.create_listing.business_hours.main_title}</Text>
                                <View style={{ flexDirection: 'row', width: width(90) }}>
                                    <CheckBox
                                        title={store.GET_LISTING.data.create_listing.business_hours.dropdown[0].text}
                                        checkedColor={main_clr}
                                        textStyle={{ marginRight: 0, marginLeft: 3 }}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        containerStyle={{ marginRight: 0, marginLeft: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                        size={18}
                                        checked={this.state.hour_NA}
                                        onPress={() => { this.selectBusinessHours(0) }}
                                    />
                                    <CheckBox
                                        title={store.GET_LISTING.data.create_listing.business_hours.dropdown[1].text}
                                        checkedColor={main_clr}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        textStyle={{ marginRight: 0, marginLeft: 3 }}
                                        containerStyle={{ marginRight: 0, marginLeft: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                        size={18}
                                        checked={this.state.hour_24}
                                        onPress={() => { this.selectBusinessHours(1) }}
                                    />
                                    <CheckBox
                                        title={store.GET_LISTING.data.create_listing.business_hours.dropdown[0].text}
                                        checkedColor={main_clr}
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        textStyle={{ marginRight: 0, marginLeft: 3 }}
                                        containerStyle={{ marginRight: 0, marginLeft: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                        size={18}
                                        checked={this.state.hour_selected}
                                        onPress={() => { this.selectBusinessHours(2) }}
                                    />
                                </View>
                            </View>
                            :
                            null
                    }
                    {
                        this.state.hour_selected ?
                            <View style={{ width: width(95), borderRadius: 4, backgroundColor: COLOR_SECTIONS }}>
                                <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                    <Text style={{ fontSize: 14, marginVertical: 7, color: 'black' }}>{data.timezone.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                                    {
                                        Platform.OS === 'android' ?
                                            <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }} >
                                                <View style={{ width: width(78), alignItems: 'flex-start' }}>
                                                    <Text style={{ marginHorizontal: 8, fontSize: 14 }}>America/Bogota</Text>
                                                </View>
                                                {/* <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" /> */}
                                            </TouchableOpacity>
                                            :
                                            // onPress={() => this.setState({ is_timezonePicker: !this.state.is_timezonePicker })}
                                            <TouchableOpacity style={{ height: height(6), width: width(90), backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }} >
                                                <View style={{ width: width(78), alignItems: 'flex-start' }}>
                                                    <Text style={{ marginHorizontal: 8, fontSize: 14 }}>{this.state.timezone}</Text>
                                                </View>
                                                {/* <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" /> */}
                                            </TouchableOpacity>
                                    }
                                </View>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginHorizontal: 10, marginBottom: 5, width: width(90), backgroundColor: '#ffffff', marginTop: 10 }}
                                >
                                    {
                                        data.days.dropdown.map((item, key) => {
                                            return (
                                                <TouchableOpacity key={key} style={{ height: 40, width: width(25), justifyContent: 'center', alignItems: 'center', borderBottomColor: item.checkStatus ? main_clr : 'white', borderBottomWidth: 1 }}
                                                    onPress={() => this.selectDays(item)}
                                                >
                                                    <Text style={{ color: item.checkStatus ? main_clr : 'black', fontSize: 14 }}>{item.day_name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                                <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                                    <View style={{ marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                                        <Text style={{ marginVertical: 7, fontSize: 14 }}>{'From'}</Text>
                                        <DatePicker
                                            style={{ height: height(6), width: width(44), alignSelf: 'stretch', backgroundColor: 'white', paddingHorizontal: 10, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}
                                            date={this.state.dateFrom}
                                            mode="time"
                                            androidMode='spinner' //spinner
                                            showIcon={true}
                                            placeholder={'12:00 AM'}
                                            duration={400}
                                            format="hh:mm a"
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
                                            onDateChange={async (date) => { await this.setDaysTiming(date, 'start'), this.setState({ dateFrom: date }) }}
                                        />
                                    </View>
                                    <View style={{ marginVertical: 5, marginTop: 10, marginLeft: 10, alignItems: 'flex-start' }}>
                                        <Text style={{ marginVertical: 7, fontSize: 14 }}>{'To'}</Text>
                                        <DatePicker
                                            style={{ height: height(6), width: width(44), alignSelf: 'stretch', backgroundColor: 'white', paddingHorizontal: 10, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}
                                            date={this.state.DateTo}
                                            mode="time"
                                            androidMode='spinner' //spinner
                                            showIcon={true}
                                            placeholder={'12:00 AM'}
                                            duration={400}
                                            format="hh:mm a"
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
                                            onDateChange={async (date) => { await this.setDaysTiming(date, 'end'), this.setState({ DateTo: date }) }}
                                        />
                                    </View>
                                </View>
                                <CheckBox
                                    title={data.days.close}
                                    checkedColor={main_clr}
                                    textStyle={{ marginRight: 0, marginLeft: 3 }}
                                    containerStyle={{ marginRight: 0, marginLeft: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                    size={18}
                                    checked={this.state.checkBox}
                                    onPress={() => this.isCheckBox()}
                                />
                            </View>
                            :
                            null
                    }
                    <View>
                        {/* <View style={{ width: width(95), backgroundColor: '#eff3f6' }}> */}
                        <View style={{ marginHorizontal: 10, marginBottom: 20, marginTop: 10, alignItems: 'flex-start' }}>
                            <Text style={{ color: COLOR_SECONDARY, marginVertical: 7, fontSize: 14, fontWeight: 'bold' }}>Social Media Addresses</Text>
                            <View style={{ height: height(6), width: width(90), marginTop: 5, flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, backgroundColor: 'white' }}>
                                <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                    <Icon name="facebook" size={22} color="#c4c4c4" />
                                </View>
                                <TextInput
                                    onChangeText={(value) => { this.setState({ fbURL: value }) }}
                                    value={this.state.fbURL}
                                    placeholderTextColor='gray'
                                    scrollEnabled={false}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                />
                            </View>
                            <View style={{ height: height(6), width: width(90), marginTop: 10, flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, backgroundColor: 'white' }}>
                                <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                    <Icon name="twitter" size={22} color="#c4c4c4" />
                                </View>
                                <TextInput
                                    onChangeText={(value) => { this.setState({ twURL: value }) }}
                                    value={this.state.twURL}
                                    placeholderTextColor='gray'
                                    scrollEnabled={false}
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                />
                            </View>
                            <View style={{ height: height(6), width: width(90), marginTop: 10, flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, backgroundColor: 'white' }}>
                                <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                    <IconG name="linkedin" size={20} color="#c4c4c4" />
                                </View>
                                <TextInput
                                    onChangeText={(value) => { this.setState({ inURL: value }) }}
                                    value={this.state.inURL}
                                    scrollEnabled={false}
                                    placeholderTextColor='gray'
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                />
                            </View>
                            <View style={{ height: height(6), width: width(90), marginTop: 10, flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, backgroundColor: 'white' }}>
                                <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                    <Icon name="youtube" size={22} color="#c4c4c4" />
                                </View>
                                <TextInput
                                    onChangeText={(value) => { this.setState({ youtubeURL: value }) }}
                                    value={this.state.youtubeURL}
                                    scrollEnabled={false}
                                    placeholderTextColor='gray'
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                />
                            </View>
                            <View style={{ height: height(6), width: width(90), marginTop: 10, flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6, backgroundColor: 'white' }}>
                                <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                    <Icon name="instagram" size={24} color="#c4c4c4" />
                                </View>
                                <TextInput
                                    onChangeText={(value) => { this.setState({ insURL: value }) }}
                                    value={this.state.insURL}
                                    scrollEnabled={false}
                                    placeholderTextColor='gray'
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                />
                            </View>
                        </View>
                        {/* </View> */}
                    </View>
                </ScrollView>
                <Modal
                    animationInTiming={500}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    avoidKeyboard={true}
                    // transparent={false}
                    isVisible={this.state.is_pricePicker}
                    onBackdropPress={() => this.setState({ is_pricePicker: false })}
                    style={{ flex: 1, marginTop: 275 }}>
                    <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                        <View style={{ height: height(4), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_pricePicker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Picker
                                selectedValue={this.state.price_id}
                                style={{ height: height(6), width: width(100), color: 'gray' }}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.selectPriceType(itemValue)
                                }}>
                                <Picker.Item label={data.price_type.placeholder} value='' />
                                {
                                    data.price_type.dropdown.map((item, key) => {
                                        return (
                                            <Picker.Item key={key} label={item.name} value={item.id} />
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
                    isVisible={this.state.is_currencyPicker}
                    onBackdropPress={() => this.setState({ is_currencyPicker: false })}
                    style={{ flex: 1, marginTop: 275 }}>
                    <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                        <View style={{ height: height(4), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_currencyPicker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Picker
                                selectedValue={this.state.currency_id}
                                style={{ height: height(6), width: width(100), color: 'gray' }}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.selectCurrencyType(itemValue)
                                }}>
                                <Picker.Item label={data.currency_type.placeholder} value='' />
                                {
                                    data.currency_type.dropdown.map((item, key) => {
                                        return (
                                            <Picker.Item key={key} label={item.name} value={item.id} />
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
                    isVisible={this.state.is_timezonePicker}
                    onBackdropPress={() => this.setState({ is_timezonePicker: false })}
                    style={{ flex: 1, marginTop: 275 }}>
                    <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                        <View style={{ height: height(4), alignItems: 'flex-end' }}>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_timezonePicker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Picker
                                selectedValue={'America/Bogota'}
                                style={{ height: height(6), width: width(100), color: 'gray' }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ timezone: 'America/Bogota' })
                                }>
                                <Picker.Item label={data.timezone.placeholder} value='' />
                                {
                                    store.TIME_ZONE.map((item, key) => {
                                        return (
                                            <Picker.Item key={key} label={item} value={item} />
                                        );
                                    })
                                }
                            </Picker>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default withNavigation(PricingListing)