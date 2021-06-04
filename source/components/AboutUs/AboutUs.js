import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Button, ActivityIndicator, Image, ImageBackground, TouchableOpacity, I18nManager,
  ScrollView, TextInput, FlatList
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { width, height, totalSize } from 'react-native-dimension';
import { FONT_NORMAL, FONT_BOLD, COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
// import Store from '../../Stores';
import store from '../../Stores/orderStore'
import styles from '../../../styles/AboutUsStyleSheet';
import HTMLView from 'react-native-htmlview';

import ApiController from '../../ApiController/ApiController';

const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
const SECTIONS = [
  {
    title: 'Who are you',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond',
  },
  {
    title: 'How are you',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond'
  },
  {
    title: 'What are our Services',
    content: 'heloo ahaohd ashdoh ashdoih aosihdo nasoihdasod hasoido ashdoihoas dhasod asdjo ashdoh ashdoh ashldo ashdoih asdohasd oasdho hsd asndo ahsdo ashd aosdih sdoi ashdi hdao dahods ashdo daoshdo oasdo nosnd noasdo oosdk nasond'
  },
];


@observer
export default class AboutUs extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      loading: true
    }
    // I18nManager.forceRTL(false);
  }
  static navigationOptions = {
    header: null,
  };
  _renderHeader(section, content, isActive) {
    return (
      <Animatable.View
        duration={500}
        transition="backgroundColor"
        transition="source"
        transition="style"
        style={{ height: height(6), marginHorizontal: 15, marginVertical: 5, borderRadius: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: (isActive ? COLOR_ORANGE : 'rgba(128,128,128,0.2)') }}>
        <Text style={{ width: width(80), fontSize: totalSize(headingTxt), marginLeft: 15, color: COLOR_SECONDARY }}>{section.title}</Text>
        <Image source={(isActive ? require('../../images/dropDown.png') : require('../../images/next.png'))} style={{ height: height(2), width: width(4), resizeMode: 'contain' }} />
      </Animatable.View>
    );
  }
  _renderContent(section, content, isActive) {
    return (
      <Animatable.View
        duration={500}
        transition="backgroundColor"
        style={{ elevation: 10, alignItems: 'center', borderRadius: 3, marginHorizontal: 15, marginVertical: 10, backgroundColor: (isActive ? 'white' : 'white') }}>
        <Animatable.Text
          duration={500}
          easing="ease-out"
          animation={isActive ? 'zoomIn' : 'zoomOut'}
          align='center'
          style={{ alignSelf: 'center', margin: 10, fontSize: totalSize(subHeadingTxt), fontFamily: FONT_NORMAL }}
        >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  }


  componentDidMount = async () => {
    // let data = store.SEARCHING.LISTING_FILTER.data;
    // let settings = store.settings.data;
    // console.warn('filters=>>>', data.all_filters);
    this.setState({ loading: true })
    let response = await ApiController.post('aboutus');
    if (response.success) {
      store.AboutUs = response.data;
      this.setState({ loading: false })
    } else {
      this.setState({ loading: false })
    }

  }
  render() {
    let main_clr = store.settings.data.main_clr;

    return (

      this.state.loading ? [
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={main_clr} animating={true} />
        </View>
      ] :
        <View style={styles.container}>
          <ScrollView
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.scrollView.scrollToEnd({ animated: true });
            }}>
            <Text style={{ fontSize: totalSize(titles), marginTop: 15, marginHorizontal: 15, color: COLOR_SECONDARY, fontWeight: 'bold' }}>{store.AboutUs.about_us.title}</Text>
            <View style={{ elevation: 0, marginVertical: 10, flex: 1,  marginHorizontal: 15 }}>
             
              <HTMLView
                value={store.AboutUs.about_us.desc}
                stylesheet={{
                  width: width(100),
                  marginHorizontal: 15,
                  marginVertical: 3,
                  fontSize: totalSize(paragraphTxt),
                  // fontFamily: FONT_NORMAL,
                  // color: COLOR_GRAY,
                  textAlignVertical: 'center'
                }}
              />

              {/* <Text style={{ fontSize: totalSize(subHeadingTxt), margin: 10, marginBottom: 5, color: COLOR_SECONDARY }}>{store.AboutUs.about_us.desc}
          </Text> */}
              {/* <Text style={{ fontSize: totalSize(subHeadingTxt), padding: 10, borderLeftWidth: 2, borderColor: COLOR_ORANGE, margin: 20, color: COLOR_SECONDARY, fontFamily: FONT_NORMAL }}>
              Advertising image of a man shopping for Christmas presents, United States, 1918
              ct information and place product orders across different regions while online retailers deliver their products directly to the consumers home, offices or wherever they want
          </Text> */}
            </View>
            {/* <Accordion
            sections={SECTIONS}
            underlayColor={null}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            disabled={false}
          /> */}
          </ScrollView>
        </View>
    );
  }
}
