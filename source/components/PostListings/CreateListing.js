import React, { Component } from 'react';
import { Platform, Text, View, I18nManager,TextInput, TouchableOpacity, Picker, ScrollView, ActivityIndicator, Image } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import IconDrop from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import { COLOR_SECONDARY, COLOR_PRIMARY, COLOR_SECTIONS } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
import { withNavigation } from 'react-navigation';
import Api from '../../ApiController/ApiController';
const inputSize = totalSize(1.5);
@observer class CreateListing extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            stateRefresher: false,
            loading: false,
            arr: ['1', '2', '3', '4', '5'],
            is_picker: false,
            title: '',
            cate_id: '',
            cate_name: 'select category',
            amenities: [],
            phone: '',
            weburl: ''
        }
    }
    static navigationOptions = {
        header: null,
    };

    componentWillMount = async () => {
        let data = store.GET_LISTING.data.create_listing;
        if (data.category.dropdown.length > 0 && data.category.value !== "") {
            await this.getAmenities(data.category.value)
        }
        await this.setState({
            title: data.title.value,
            cate_id: data.category.value,
            cate_name: data.category.name || data.category.placeholder,
            phone: data.phone.value,
            weburl: data.weburl.value,
        })
    }
    selectCategory = (itemValue) => {
        let data = store.GET_LISTING.data.create_listing;
        this.setState({ cate_id: itemValue })
        data.category.dropdown.forEach(item => {
            if (item.category_id === itemValue) {
                this.setState({ cate_name: item.category_name })
            }
        });
    }
    getAmenities = async (cate_id) => {
        if (cate_id !== '') {
            this.setState({ cate_id: cate_id, loading: true, is_picker: Platform.OS === 'ios' ? false : false })
            let response = await ApiController.post('get-amenities', { category_id: cate_id, listing_id: store.LISTING_UPDATE ? store.LIST_ID : '' });
            // console.log('ameninites====>>>',response);

            if (response.success) {
                store.AMENITIES = response.data;
                if (store.LISTING_UPDATE) {
                    store.AMENITIES.amenities.forEach(item => {
                        if (item.status) {
                            item.checkStatus = true;
                            item.added = true;
                            this.state.amenities.push(item.id);
                        } else {
                            item.checkStatus = false;
                            item.added = false;
                        }
                    })
                } else {
                    store.AMENITIES.amenities.forEach(item => {
                        item.checkStatus = false;
                        item.added = false;
                    })
                }

                this.setState({ loading: false })
            } else {
                store.AMENITIES.amenities = [];
                this.setState({ loading: false })
            }
        }
    }
    selectAmenities = async (amenity) => {
        store.AMENITIES.amenities.forEach(item => {
            if (item.checkStatus === false) {
                if (amenity.id === item.id) {
                    item.checkStatus = !item.checkStatus;
                    this.state.amenities.push(item.id);
                    this.setState({ stateRefresher: false })
                }
            } else {
                if (amenity.id === item.id) {
                    item.checkStatus = false;
                    var index = this.state.amenities.indexOf(item.id);
                    this.state.amenities.splice(index, 1);
                    this.setState({ stateRefresher: false })
                }
            }
        });
    }
    createListing = async () => {
        store.LISTING_OBJ.title = this.state.title;
        store.LISTING_OBJ.category_id = this.state.cate_id;
        store.LISTING_OBJ.contact_no = this.state.phone;
        store.LISTING_OBJ.weburl = this.state.weburl;
        store.LISTING_OBJ.cat_features = this.state.amenities.join();
        // console.log('storeCreate',store.LISTING_OBJ);
    }

    render() {
        this.createListing()
        let main_clr = store.settings.data.main_clr;
        let data = store.GET_LISTING.data.create_listing;

        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.title.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Icon name="edit" size={24} color="#c4c4c4" />
                            </View>
                            <TextInput
                                onChangeText={(value) => { this.setState({ title: value }) }}
                                placeholder={data.title.placeholder}
                                scrollEnabled={false}
                                value={this.state.title}
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={[{ height: height(6), width: width(77), fontSize: inputSize, backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 14, marginVertical: 7, color: 'black', fontWeight: 'bold' }}>{data.category.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        {
                            Platform.OS === 'android' ?
                                <View style={{ height: height(6), width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                                    <Picker
                                        selectedValue={parseInt(this.state.cate_id)}
                                        style={{ height: height(6), width: width(90), color: 'gray' }}
                                        onValueChange={async (itemValue, itemIndex) => {
                                            await this.getAmenities(itemValue)
                                        }}>
                                        <Picker.Item label={data.category.placeholder} value='' />
                                        {
                                            data.category.dropdown.map((item, key) => {
                                                return (
                                                    <Picker.Item key={key} label={item.category_name} value={item.category_id} />
                                                );
                                            })
                                        }
                                    </Picker>
                                </View>
                                :
                                <TouchableOpacity style={{ height: height(6), width: width(90), alignItems: 'center', flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                                    <View style={{ width: width(80), alignItems: 'flex-start' }}>
                                        <Text style={{ marginHorizontal: 8, fontSize: 15, color: COLOR_SECONDARY }}>{this.state.cate_name}</Text>
                                    </View>
                                    <IconDrop name="md-arrow-dropdown" size={24} color="#c4c4c4" />
                                </TouchableOpacity>
                        }
                    </View>
                    {
                        store.AMENITIES.has_amenities || this.state.loading ?
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                                {
                                    this.state.loading ?
                                        <View style={{ width: width(90), alignItems: 'center' }}>
                                            <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                                        </View>
                                        :
                                        <View style={{ alignItems: 'flex-start' }}>
                                            <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>Amenities</Text>
                                            <View style={{ width: width(90), flexDirection: 'row', borderRadius: 4, backgroundColor: COLOR_SECTIONS }}>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' }}>
                                                    {
                                                        store.AMENITIES.amenities !== [] ?
                                                            store.AMENITIES.amenities.map((item, key) => {
                                                                return (
                                                                    <View style={{ width: width(45) }}>
                                                                        <CheckBox
                                                                            key={key}
                                                                            title={item.name}
                                                                            checkedColor={main_clr}
                                                                            containerStyle={{ marginRight: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                                                            size={18}
                                                                            checked={item.checkStatus}
                                                                            onPress={() => { this.selectAmenities(item) }}
                                                                        />
                                                                    </View>
                                                                );
                                                            })
                                                            :
                                                            null
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                }
                            </View>
                            :
                            null
                    }

                    {/* <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10 }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>Additional Fields</Text>
                        <View style={{ width: width(90), borderColor: '#c4c4c4', borderWidth: 0.5, borderRadius: 4 }}>
                            <View style={{ marginHorizontal: 18, marginVertical: 5 }}>
                                <Text style={{ marginVertical: 5, fontSize: 14, color: 'black' }}>Good for</Text>
                                <TextInput
                                    // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                    placeholder={'title'}
                                    // value={this.state.location}
                                    placeholderTextColor='gray'
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={{ height: height(6), width: width(78), fontSize: 16, alignSelf: 'stretch', borderRadius: 3, backgroundColor: 'white', paddingHorizontal: 10, borderColor: '#c4c4c4', borderWidth: 0.5, borderRadius: 4 }}
                                />
                            </View>
                            <View style={{ marginHorizontal: 18, marginVertical: 5 }}>
                                <Text style={{ marginVertical: 5, fontSize: 14, color: 'black' }}>Open Hours</Text>
                                <TextInput
                                    // onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                                    placeholder={'title'}
                                    // value={this.state.location}
                                    placeholderTextColor='gray'
                                    underlineColorAndroid='transparent'
                                    autoCorrect={true}
                                    style={{ height: height(6), width: width(78), fontSize: 16, alignSelf: 'stretch', borderRadius: 3, backgroundColor: 'white', paddingHorizontal: 10, borderColor: '#c4c4c4', borderWidth: 0.5, borderRadius: 4 }}
                                />
                            </View>
                            <Text style={{ marginTop: 10, paddingHorizontal: 20, fontSize: 14, color: 'black' }}>Pre Bookings</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' }}>
                                {
                                    this.state.arr.map((item, key) => {
                                        return (
                                            <CheckBox
                                                key={key}
                                                title='checkbox'
                                                checkedColor={main_clr}
                                                containerStyle={{ marginRight: 0, borderWidth: 0, backgroundColor: 'transparent' }}
                                                size={18}
                                                checked={true}
                                            // onPress={() => { this.props.fun() }}
                                            />
                                        );
                                    })
                                }
                            </View>
                        </View>
                    </View> */}
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems: 'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.phone.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Icon name="phone" size={26} color="#c4c4c4" />
                            </View>
                            <TextInput
                                onChangeText={(value) => { this.setState({ phone: value }) }}
                                placeholder={data.phone.placeholder}
                                value={this.state.phone}
                                scrollEnabled={false}
                                keyboardType='phone-pad'
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                            />
                        </View>
                    </View>
                    {
                        store.GET_LISTING.data.is_weblink ?
                            <View style={{ marginHorizontal: 10, marginTop: 10, alignItems: 'flex-start' }}>
                                <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.weburl.main_title}</Text>
                                <View style={{ height: height(6), width: width(90), flexDirection: 'row', marginBottom: 15, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <Icon name="link" size={24} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        onChangeText={(value) => { this.setState({ weburl: value }) }}
                                        placeholder={data.weburl.placeholder}
                                        value={this.state.weburl}
                                        scrollEnabled={false}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                    />
                                </View>
                            </View>
                            :
                            null
                    }
                </ScrollView>
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
                                selectedValue={this.state.cate_id}
                                style={{ height: height(6), width: width(100) }}
                                onValueChange={async (itemValue, itemIndex) => {
                                    this.selectCategory(itemValue),
                                        await this.getAmenities(itemValue)
                                }}>
                                <Picker.Item label={data.category.placeholder} value='' />
                                {
                                    data.category.dropdown.map((item, key) => {
                                        return (
                                            <Picker.Item key={key} label={item.category_name} value={item.category_id} />
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

export default withNavigation(CreateListing)