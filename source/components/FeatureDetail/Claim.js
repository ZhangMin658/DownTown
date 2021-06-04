import React, { Component } from 'react';
import { Platform, ActivityIndicator, Text, View, TextInput, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, S2, S18 } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import Api from '../../ApiController/ApiController';

@observer export default class Claim extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: '',
            phone_no: '',
            message: '',
        }
        // I18nManager.forceRTL(false);
    }
    static navigationOptions = { header: null };
    
    postClaim = async () => {
        let { orderStore } = Store;
        this.setState({ loading: true })
        let params = {
            claim_listing_id: orderStore.home.LIST_ID,
            claimer_id: orderStore.login.loginStatus? orderStore.login.loginResponse.data.id : null,
            claimer_name: this.state.name,
            claimer_contact: this.state.phone_no,
            claimer_message: this.state.message
        };
        console.log('parameters=>>>',params);  
        try {
            let response = await Api.post('listing-claim', params);
            console.log('PostClaim=', response);
            if (response.success) {
                this.props.hideModels('claim', false)
                this.setState({ loading: false })
                Toast.show(response.message,Toast.LONG);
            } else {
                this.setState({ loading: false })
                Toast.show(response.message,Toast.LONG);
            }
        } catch (error) {
            this.setState({ loading: false })
            console.log('error==>>>',error);   
        }
    }
    render() {
        let { orderStore } = Store;
        let data = orderStore.home.CLAIMS;
        var main_clr = store.settings.data.main_clr;
        return (
            <View style={{ height: height(50), width: width(90), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                <View style={{ height: height(4), alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ elevation: 3, height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: main_clr }} onPress={() => { this.props.hideModels('claim', false) }}>
                        <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: totalSize(1.8), color: 'black', marginVertical: 10, marginHorizontal: 20, fontWeight: 'bold' }}>{data.dialog_txt}</Text>
                <TextInput
                    onChangeText={(value) => this.setState({ name: value })}
                    placeholder={data.name_placeholder}
                    placeholderTextColor={COLOR_GRAY}
                    underlineColorAndroid='transparent'
                    autoCorrect={false}
                    style={{ height: height(6), marginHorizontal: 20, padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLOR_GRAY, backgroundColor: COLOR_PRIMARY, color: COLOR_SECONDARY, fontSize: totalSize(1.6) }}
                />
                <TextInput
                    onChangeText={(value) => this.setState({ phone_no: value })}
                    placeholder={data.contact_placeholder}
                    placeholderTextColor={COLOR_GRAY}
                    underlineColorAndroid='transparent'
                    autoCorrect={false}
                    style={{ height: height(6), marginHorizontal: 20, padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLOR_GRAY, backgroundColor: COLOR_PRIMARY, color: COLOR_SECONDARY, fontSize: totalSize(1.6) }}
                />
                <TextInput
                    onChangeText={(value) => this.setState({ message: value })}
                    placeholder={data.proof_placeholder}
                    placeholderTextColor={COLOR_GRAY}
                    underlineColorAndroid='transparent'
                    autoCorrect={false}
                    style={{ height: height(15), marginHorizontal: 20, padding: 10, textAlignVertical: 'top', marginBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLOR_GRAY, backgroundColor: COLOR_PRIMARY, color: COLOR_SECONDARY, fontSize: totalSize(1.6) }}
                />
                {
                    store.settings.data.is_demo_mode ?
                        <View style={{ elevation: 3, height: height(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 5, marginHorizontal: 20, backgroundColor: main_clr }}>
                            <Text style={{ fontSize: totalSize(1.8), color: COLOR_PRIMARY, fontWeight: 'bold' }}>{store.settings.data.demo_mode_txt}</Text>
                        </View>
                        :
                        <TouchableOpacity style={{ elevation: 3, height: height(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 5, marginHorizontal: 20, backgroundColor: main_clr }} onPress={() => { this.postClaim() }}>
                            {
                                this.state.loading?
                                <ActivityIndicator size='large' color={COLOR_PRIMARY} animating={true} />
                                :
                                <Text style={{ fontSize: totalSize(1.8), color: COLOR_PRIMARY, fontWeight: 'bold' }}>{data.dialog_btn}</Text>
                            }
                        </TouchableOpacity>
                }
            </View>
        );
    }
}
