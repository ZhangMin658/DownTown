import React, { Component } from 'react';
import { Platform, ActivityIndicator, Text, View, TextInput, Image, Picker, TouchableOpacity } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, S2, S18 } from '../../../styles/common';
import { observer } from 'mobx-react';
import { Dropdown } from 'react-native-material-dropdown';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import Api from '../../ApiController/ApiController';

@observer export default class Report extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            report_reason: '',
            report_comments: '',
            list: [{ value: 'first' }, { value: 'second' }, { value: 'third' }, { value: 'four' }]
        }
    }
    static navigationOptions = { header: null };
    postReport = async () => {
        let { orderStore } = Store;
        let params = {
            listing_id: orderStore.home.LIST_ID,
            report_reason: this.state.report_reason,
            report_comments: this.state.report_comments,
        };
        this.setState({ loading: true })
        let response = await Api.post('listing-report', params);
        // console.log('PostReport=', response);
        if (response.success) {
            this.props.hideModels('report', false)
            this.setState({ loading: false })
            Toast.show(response.message, Toast.LONG);
        } else {
            this.setState({ loading: false })
            Toast.show(response.message, Toast.LONG);
        }
    }
    render() {
        let { orderStore } = Store;
        let REPORTS = orderStore.home.REPORTS.reasons_updated;
        var main_clr = store.settings.data.main_clr;        
        return (
            <View style={{ height: height(44), width: width(85), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                <View style={{ height: height(4), alignItems: 'flex-end' }}>
                    <TouchableOpacity style={{ elevation: 3, height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: main_clr }} onPress={() => { this.props.hideModels('report', false) }}>
                        <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: totalSize(1.8), color: 'black', marginVertical: 10, marginHorizontal: 20, fontWeight: 'bold' }}>{orderStore.home.REPORTS.dialog_txt}</Text>
                <View style={{ height: height(7), width: width(75), marginVertical: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: COLOR_PRIMARY, borderRadius: 5, borderWidth: 0.6, borderColor: COLOR_GRAY, alignSelf: 'center' }}>
                    <Dropdown
                        containerStyle={{ alignSelf:'stretch',marginHorizontal: 8 ,marginVertical: 0 }}
                        // overlayStyle={{height:height(7), width:width(84),marginHorizontal: 10 }}
                        label={orderStore.home.REPORTS.dialog_placeholder}
                        labelFontSize={14}
                        dropdownPosition={-4.1}
                        itemCount={3}
                        value={this.state.report_reason}
                        textColor={COLOR_SECONDARY}
                        itemColor='gray'
                        onChangeText={(value) => { this.setState({ report_reason: value }) }}
                        data={REPORTS}
                    />
                </View>
                <TextInput
                    onChangeText={(value) => this.setState({ report_comments: value })}
                    placeholder={orderStore.home.REPORTS.dialog_txtarea}
                    placeholderTextColor={COLOR_GRAY}
                    underlineColorAndroid='transparent'
                    autoCorrect={true}
                    style={{ height: height(15), marginHorizontal: 20, padding: 10, textAlignVertical: 'top', marginBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLOR_GRAY, backgroundColor: COLOR_PRIMARY, color: COLOR_SECONDARY, fontSize: totalSize(1.6) }}
                />
                {
                    store.settings.data.is_demo_mode === false ? 
                        <TouchableOpacity style={{ elevation: 3, height: height(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 5, marginHorizontal: 20, backgroundColor: main_clr }}>
                            {
                                this.state.loading ?
                                    <ActivityIndicator size='large' color={COLOR_PRIMARY} animating={true} />
                                    :
                                    <Text style={{ fontSize: totalSize(1.8), color: COLOR_PRIMARY, fontWeight: 'bold' }}>{orderStore.home.REPORTS.dialog_btn_txt}</Text>
                            }
                        </TouchableOpacity>
                        :
                        <View style={{ elevation: 3, height: height(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 5, marginHorizontal: 20, backgroundColor: main_clr }}>
                            {
                                this.state.loading ?
                                    <ActivityIndicator size='large' color={COLOR_PRIMARY} animating={true} />
                                    :
                                    <Text style={{ fontSize: totalSize(1.8), color: COLOR_PRIMARY, fontWeight: 'bold' }}>{store.settings.data.demo_mode_txt}</Text>
                            }
                        </View>
                }
            </View>
        );
    }
}
