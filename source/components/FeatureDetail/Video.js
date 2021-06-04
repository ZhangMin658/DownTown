import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import Modal from "react-native-modal";
import { observer } from 'mobx-react';
import { height, width, totalSize } from 'react-native-dimension';
import Store from '../../Stores';
import Claim from './Claim'
import Report from './Report'
import styles from '../../../styles/LocationStyleSheet';
import FeatureDetail from './FeatureDetail';
import { YOUTUBE_API_KEY } from '../../../styles/common';
import { WebView } from 'react-native-webview';



@observer export default class Location extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            reportModel: false,
            isClaimVisible: false,
            height: 38
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
    static navigationOptions = {
        header: null,
    };
    render() {
        let { orderStore } = Store;
        let data = orderStore.home.FEATURE_DETAIL.data.listing_detial;
        return (
            <View style={styles.container}>
                <FeatureDetail callModel={this.setModalVisible} />
                <WebView
                    useWebKit={false}
                    source={{ uri: 'https://www.youtube.com/embed/' + data.video.video_id + '?rel=0&autoplay=0&showinfo=0&controls=0' }}
                    style={{ height: height(40), width: width(90), marginTop: 20 }}
                    javaScriptEnabled={true}
                />
                <Modal
                    animationInTiming={500}
                    animationIn="slideInLeft"
                    animationOut="slideOutRight"
                    avoidKeyboard={true}
                    // transparent={false}
                    isVisible={this.state.reportModel}
                    onBackdropPress={() => this.setState({ reportModel: false })}
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
                    onBackdropPress={() => this.setState({ isClaimVisible: false })}
                    style={{ flex: 1 }}>
                    <Claim hideModels={this.hideModels} />
                </Modal>
            </View>
        );
    }
}
