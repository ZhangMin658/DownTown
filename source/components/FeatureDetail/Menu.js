import React, { Component } from 'react';
import {
    Platform, StyleSheet, Text, View, Image, TouchableOpacity, I18nManager,
    ScrollView, TextInput, FlatList
} from 'react-native';
import Modal from "react-native-modal";
import { width, height, totalSize } from 'react-native-dimension';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import Claim from './Claim'
import Report from './Report'
import styles from '../../../styles/MenuStyleSheet';
import FeatureDetail from './FeatureDetail';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
@observer export default class Menu extends Component<Props> {
    constructor(props) {
        let { orderStore } = Store;
        super(props);
        this.state = {
            loading: false,
            reportModel: false,
            isClaimVisible: false,
            SECTION: []
        }
    }

    setModalVisible = (state, prop) => {
        if (state === 'claim' && prop === false) {
            this.setState({ reportModel: false, isClaimVisible: true })
        } else {
            if (state === 'report') {
                this.setState({ reportModel: true, isClaimVisible: false })
            }
        }
    }
    hideModels = (state, hide) => {
        if (state === 'claim') {
            this.setState({ isClaimVisible: hide, reportModel: hide })
        } else {
            if (state === 'report') {
                this.setState({ reportModel: hide, reportModel: hide })
            }
        }
    }

    static navigationOptions = { header: null };
    componentWillMount() {
        let { orderStore } = Store;
        let data = orderStore.home.FEATURE_DETAIL.data.listing_detial;
        for (let i = 0; i < data.menu.tab_list.length; i++) {
            this.state.SECTION.push({ menu: data.menu.tab_list[i] })
        }
        // console.log('section array is=',this.state.SECTION);
    }
    _renderHeader(section, content, isActive) {
        return (
            <Animatable.View
                duration={500}
                transition="backgroundColor"
                transition="source"
                transition="style"
                style={{ height: height(7), marginHorizontal: 15, marginVertical: 5, borderWidth: 0.6, borderColor: COLOR_GRAY, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',borderRadius: 5 }}>
                <Text style={{ width: width(77), fontSize: totalSize(1.8), textAlign:'left',fontWeight: 'bold', marginHorizontal: 15, color: isActive ? 'red' : COLOR_SECONDARY }}>{section.menu.menu_name}</Text>
                <View style={{ height: height(7), width: width(13), borderLeftWidth: 0.6, borderColor: COLOR_GRAY, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={(isActive ? require('../../images/next.png') : require('../../images/next.png'))} style={{ height: height(2), width: width(4), resizeMode: 'contain',transform: [{scaleX: I18nManager.isRTL ? -1 : 1}] }} />
                </View>
            </Animatable.View>
        );
    }
    _renderContent(section, content, isActive) {
        return (
            <Animatable.View
                duration={500}
                transition="backgroundColor"
                style={{ elevation: 0, borderRadius: 3, marginHorizontal: 15, marginVertical: 10, borderRadius: 5 }}>
                {
                    section.menu.inner_menu.map((item, key) => {
                        return (
                            <Animatable.View
                                duration={300}
                                easing="ease-out"
                                animation={isActive ? 'zoomIn' : 'zoomOut'}
                                align='center'
                                key={key}
                                style={{ flexDirection: 'row', width: width(95), borderBottomColor: 'rgba(128,128,128,0.2)', borderBottomWidth: 0.6, marginBottom: 0.6, backgroundColor: (isActive ? 'white' : 'white') }}>
                                <View style={{ flex: 1, marginHorizontal: 10, marginVertical: 5, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: totalSize(1.8), fontWeight: 'bold', textAlign:'left',color: COLOR_SECONDARY, marginVertical: 1 }}>{item.menu_title}</Text>
                                    <Text style={{ fontSize: totalSize(1.6), color: '#999', marginVertical: 1, textAlign: 'left' }}>{item.menu_desc}</Text>
                                </View>
                                <View style={{ width: width(15), marginVertical: 5, marginHorizontal: 5, alignItems: 'center' }}>
                                    <Text style={{ fontSize: totalSize(1.8), fontWeight: 'bold', color: COLOR_SECONDARY }}>{item.menu_price}</Text>
                                </View>
                            </Animatable.View>
                        );
                    })
                }
            </Animatable.View>
        );
    }
    render() {
        let { orderStore } = Store;
        let data = orderStore.home.FEATURE_DETAIL.data.listing_detial;
        var SECTION = data.menu.tab_list;
        return (
            <View style={styles.container}>
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        this.scrollView.scrollToEnd({ animated: true });
                    }}>
                    <FeatureDetail callModel={this.setModalVisible} />
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                        <Accordion
                            sections={this.state.SECTION}
                            underlayColor={null}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            disabled={!data.has_menu}
                        />
                    </View>
                </ScrollView>
                <Modal
                    animationInTiming={500}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                    avoidKeyboard={true}
                    // transparent={false}
                    isVisible={this.state.reportModel}
                    onBackdropPress={() => this.setState({ reportModel: false }) }
                    style={{ flex: 1 }}>
                    <Report hideModels={this.hideModels} />
                </Modal>
                <Modal
                    animationInTiming={500}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                    avoidKeyboard={true}
                    // transparent={false}
                    isVisible={this.state.isClaimVisible}
                    onBackdropPress={() => this.setState({ isClaimVisible: false }) }
                    style={{ flex: 1 }}>
                    <Claim hideModels={this.hideModels} />
                </Modal>
            </View>
        );
    }
}
 // <Animatable.Text
    //   duration={500}
    //   easing="ease-out"
    //   animation={isActive ? 'zoomIn' : 'zoomOut'}
    //   align='center'
    //   style={{ alignSelf: 'center', margin: 10, fontSize: totalSize(subHeadingTxt) }}
    // >
    //   {section.content}
    // </Animatable.Text