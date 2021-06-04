import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Picker } from 'react-native';
import Modal from "react-native-modal";
import { CheckBox, Icon } from 'react-native-elements'
// import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_DARK_GRAY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import styles from '../../../styles/UserDashboardStyles/EditProfileStyleSheet';
// import { Icon } from 'react-native-paper/typings/components/List';
export default class TimeZonPicker extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            is_picker: false
        }
    }

    static navigationOptions = { header: null };

    render() {
        let  { item } = this.props.item;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{ height: 50, width: 340, alignItems: 'center', flexDirection: 'row', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                    <Text style={{ marginHorizontal: 8, width: 290 }}>{item.placeholder}</Text>
                    <Icon
                        size={14}
                        name='caretdown'
                        type='antdesign'
                        color='gray'
                    />
                </TouchableOpacity>
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
                        <View style={{ height: height(4), flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: totalSize(1.8), width: 335, marginHorizontal: 7, color: 'black', fontWeight: 'bold' }}>Set Your Password</Text>
                            <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_picker: false }) }}>
                                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                            <Picker
                                selectedValue={this.state.language}
                                style={{ height: 45, width: 370 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ language: itemValue })
                                }>
                                <Picker.Item label={item.placeholder} />
                                {
                                    store.TIME_ZONE.map((item, key) => {
                                        return (
                                            <Picker.Item label={item} value={item} />
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