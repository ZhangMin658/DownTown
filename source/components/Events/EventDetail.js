import React, { Component } from 'react';
import {
  Text, View, Image, TouchableOpacity,FlatList, ActivityIndicator,ScrollView, TextInput, Modal, I18nManager} from 'react-native';
import { Avatar } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import MapView, { Polyline, Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import ApiController from '../../ApiController/ApiController';
import CountDown from 'react-native-countdown-component';
import ImageViewer from 'react-native-image-zoom-viewer';
import HTMLView from 'react-native-htmlview';
import { INDICATOR_SIZE, INDICATOR_VISIBILITY, OVERLAY_COLOR, TEXT_SIZE, TEXT_COLOR, ANIMATION, COLOR_GRAY, S2, S14, COLOR_PRIMARY, COLOR_SECONDARY} from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Events/EventDetailStyleSheet';
// import Slideshow from 'react-native-slideshow';
import Toast from 'react-native-simple-toast';
@observer export default class EventDetail extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible: false,
      is_comment: false,
      comment: '',
      index: 0,
      images: [],
      timer: 0,
      position: 0,
      interval: null,
      data: [{ name: "Hotels" }, { name: "Hotels" }, { name: "Hotels" }, { name: "Hotels" }, { name: "Hotels" }, { name: "Hotels" }, { name: "Hotels" }, { name: "Hotels" }],
    }
  }
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.title,
    headerTintColor: 'white',
    headerTitleStyle: {
      fontSize: totalSize(2),
      fontWeight: 'normal'
    },
    headerStyle: {
      backgroundColor: navigation.state.params.headerColor
    }
  });
  componentWillMount = async () => {
    // calling eventDetail func
    await this.eventDetail()

  }
  post_comment = async () => {
    this.setState({ is_comment: true })
    let { params } = this.props.navigation.state;
    let comments = store.home.eventDetail.data.comments.comments;
    // console.log('arrayBefore',comments);
    let parameter = {
      event_id: params.event_id,
      message_content: this.state.comment
    }
    let response = await ApiController.post('event-comments', parameter);
    // console.log('response===>>', response);

    if (response.success!=undefined && response.success && response.data.comments!=null) {
      store.EVENTS.has_comments = true;
      comments.push(response.data.comments);
      await this.setState({ is_comment: false, comment: '' })
      Toast.show(response.message)
      // console.log('arrayAfter',comments);
    } else {
      this.setState({ is_comment: false })
      Toast.show(response.message)
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  // Getting eventDetail data func 
  eventDetail = async () => {
    let { params } = this.props.navigation.state;

    try {
      this.setState({ loading: true })
      //API calling
      let param = {
        event_id: params.event_id,
      };
      console.log('params===>>',param);
      let response = await ApiController.post('event-detial', param);
      store.home.eventDetail = response;
      console.log('EventDetail=', response);
      if (response.success === true) {
        // await this.setState({
        //   interval: setInterval(() => {
        //     this.setState({
        //       position: this.state.position === response.data.event_detial.gallery_images.length ? 0 : this.state.position + 1
        //     });
        //   }, 5000)
        // });
        if (store.refresh) {
          store.MY_EVENTS.data.my_events.pending_events.events.push(response.data.event_detial);
          console.log('event added',store.MY_EVENTS.data.my_events.pending_events.events);
        }
        // CountDown func call
        await this.countDown(response.data.event_detial.event_timer_detial)
        for (var i = 0; i < response.data.event_detial.gallery_images.length; i++) {
          this.state.images.push({ url: response.data.event_detial.gallery_images[i].url })
        }
        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
    }
  }
  countDown(eventDate) {
    var eventDate = new Date(eventDate);
    var currentDate = new Date();
    var differenceTravel = eventDate.getTime() - currentDate.getTime();
    var seconds = Math.floor((differenceTravel) / (1000));
    this.setState({ timer: seconds })
  }
  render() {
    var data = store.settings.data;
    if (this.state.loading === true) {
      return (
        <View style={{ height: height(100), width: width(100), flex: 1 }}>
          <Spinner
            visible={INDICATOR_VISIBILITY}
            size={INDICATOR_SIZE}
            cancelable={true}
            color={data.main_clr}
            animation={ANIMATION}
            overlayColor={OVERLAY_COLOR}
            textStyle={{ fontSize: totalSize(TEXT_SIZE), color: TEXT_COLOR }}
          />
        </View>
      );
    }
    var titles = store.home.eventDetail.screen_text;
    var eventDetail = store.home.eventDetail.data;
    var images = eventDetail.event_detial.gallery_images;    
    var region = {
      latitude: parseFloat(eventDetail.event_detial.event_latitude),
      longitude: parseFloat(eventDetail.event_detial.event_longitude),
      latitudeDelta: 0.00922 * 1.5,
      longitudeDelta: 0.00421 * 1.5
    }
    return (
      <View style={styles.container}>
        {
          this.state.loading ?
            <ActivityIndicator size='large' color={data.main_clr} animating={true} />
            :
            <ScrollView>
              {
                store.home.eventDetail.data.event_detial.has_gallery ?
                  <View style={{ height: height(30), width: width(100) }}>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={eventDetail.event_detial.gallery_images}
                        renderItem={({ item }) =>
                          <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => { this.setState({ modalVisible: true }) }}>
                            <Image source={{ uri: item.url }} style={{ height:height(30),width:width(100) }} />
                          </TouchableOpacity>
                        }
                      />
                  </View>
                  :
                  null
              }
              <View style={styles.subCon}>
             
                <View style={styles.tableCon}>
                  <View style={styles.tableRowCon}>
                    <Text style={[styles.tableHeaderText, { fontSize: totalSize(S2), marginRight: 100 }]}>{eventDetail.event_detial.event_title}</Text>
                    <Text style={{ marginHorizontal: 10, fontSize: totalSize(1.3), marginVertical: 2 }}>{eventDetail.event_detial.event_posted_date}</Text>
                  </View>
                  <View style={styles.middleRowCon}>
                    <Image source={require('../../images/address.png')} style={styles.rowIcon} />
                    <Text style={styles.tableText}>{eventDetail.event_detial.event_location}</Text>
                  </View>
                  <View style={styles.middleRowCon}>
                    <Image source={require('../../images/categoryName.png')} style={styles.rowIcon} />
                    <Text style={styles.tableText}>{eventDetail.event_detial.event_category_name}</Text>
                  </View>
                  <View style={styles.middleRowCon}>
                    <Image source={require('../../images/calendar.png')} style={styles.rowIcon} />
                    <Text style={styles.tableText}>{eventDetail.event_detial.event_start_date} - {eventDetail.event_detial.event_end_date}</Text>
                  </View>
                  <View style={styles.timmerCon}>
                    <CountDown
                      until={this.state.timer}
                      digitTxtColor={COLOR_PRIMARY}
                      timeTxtColor='#000000'
                      digitBgColor={data.main_clr}
                      timeToShow={['D', 'H', 'M', 'S']}
                      label={`${titles.days}` / 'Hourx' / 'Minutex' / 'Seconds'}
                      onFinish={() => alert('finished')}
                      size={15}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, marginVertical: 15 }}>
                  <Text style={styles.disTitle}>{titles.desc}</Text>
                  <HTMLView
                    value={eventDetail.event_detial.event_desc}
                    stylesheet={{
                      width: width(90),
                      marginHorizontal: 15,
                      marginVertical: 3,
                      fontSize: totalSize(1.5),
                      textAlignVertical: 'center',
                      color:'gray'
                    }}
                  />
                </View>
                <View style={styles.mapCon}>
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
                    mapType={"standard"}
                    loadingEnabled={true}
                    loadingIndicatorColor={'#ffffff'}
                    moveOnMarkerPress={false}
                    style={styles.map}
                    region={region}
                  >
                    <MapView.Marker
                      coordinate={
                        region
                      }
                      title={'Current location'}
                      description={'I am here'}
                      pinColor={'#3edc6d'}
                    />
                  </MapView>
                </View>
                <View style={styles.profileCon}>
                  <View style={styles.imgCon}>
                    <Avatar
                      medium
                      rounded
                      source={{ uri: eventDetail.event_detial.event_author_img }}
                      activeOpacity={1}
                    />
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.autherText}>{eventDetail.event_detial.event_author_name}</Text>
                    <Text style={[styles.autherText, { fontSize: totalSize(S14) }]}>{eventDetail.event_detial.event_author_location}</Text>
                  </View>
                  <View style={styles.viewBtn}>
                    <TouchableOpacity style={[styles.viewBtnCon, { backgroundColor: data.main_clr }]} onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: eventDetail.event_detial.event_author_id ,user_name: eventDetail.event_detial.event_author_name })}>
                      <Text style={styles.viewBtnText}>{titles.profile_btn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {
                  eventDetail.comment_status ?
                    <View>
                      {
                        eventDetail.has_comments || store.EVENTS.has_comments ?
                          <View style={{ flex: 1, marginVertical: 10 }}>
                            <View style={{ height: height(5), justifyContent: 'center' }}>
                              <Text style={styles.commentTitle}>{eventDetail.total_comments}</Text>
                            </View>
                            {
                              eventDetail.comments.comments.map((item, key) => {
                                return (
                                  <View key={key} style={{ flex: 1, marginVertical: 5 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10 }}>
                                      <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                        <Avatar
                                          medium
                                          rounded
                                          source={{ uri: item.comment_author_img }}
                                          // onPress={() => console.warn("Works!")}
                                          activeOpacity={1}
                                        />
                                      </View>
                                      <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'flex-start' }}>
                                        <Text style={styles.commentAuthName}>{item.comment_author_name}</Text>
                                        <Text style={styles.commentDate}>{item.comment_date}</Text>
                                        <Text style={styles.commentContent}>{item.comment_content}</Text>
                                      </View>
                                    </View>
                                    {
                                      item.has_reply === true ?
                                        item.reply.map((item, key) => (
                                          <View key={key} style={{ flex: 1, flexDirection: 'row', marginBottom: 5, marginHorizontal: 20 }}>
                                            <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                              <Avatar
                                                medium
                                                rounded
                                                source={{ uri: item.comment_author_img }}
                                                // onPress={() => console.warn("Works!")}
                                                activeOpacity={1}
                                              />
                                            </View>
                                            <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'flex-start' }}>
                                              <Text style={styles.commentAuthName}>{item.comment_author_name}</Text>
                                              <Text style={styles.commentDate}>{item.comment_date}</Text>
                                              <Text style={styles.commentContent}>{item.comment_content}</Text>
                                            </View>
                                          </View>
                                        ))
                                        : null
                                    }
                                  </View>
                                )
                              })
                            }
                          </View>
                          :
                          <Text style={{ color: COLOR_SECONDARY, fontSize: totalSize(2), marginVertical: 10, fontWeight: 'bold' }}>{eventDetail.no_comments}</Text>
                      }
                      {
                        eventDetail.is_user_logged_in ?
                          <View>
                            <Text style={{ fontSize: totalSize(1.6), fontWeight: 'bold', color: COLOR_SECONDARY }}>{eventDetail.comment_form.txt}</Text>
                            <View style={styles.textInputCon}>
                              <TextInput
                                onChangeText={(value) => this.setState({ comment: value })}
                                underlineColorAndroid='transparent'
                                placeholder={eventDetail.comment_form.textarea}
                                placeholderTextColor={COLOR_GRAY}
                                value={this.state.comment}
                                underlineColorAndroid='transparent'
                                multiLine={true}
                                autoCorrect={false}
                                style={[styles.textInput,I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                              />
                            </View>
                            {
                              data.is_demo_mode ?
                                <View style={[styles.submitBtnCon, { backgroundColor: data.main_clr }]}>
                                  {
                                    this.state.is_comment ?
                                      <ActivityIndicator size='small' color={COLOR_PRIMARY} animating={true} />
                                      :
                                      <Text style={styles.submitBtnText}>{data.demo_mode_txt}</Text>
                                  }
                                </View>
                                :
                                <TouchableOpacity style={[styles.submitBtnCon, { backgroundColor: data.main_clr }]} onPress={() => this.post_comment()}>
                                  {
                                    this.state.is_comment ?
                                      <ActivityIndicator size='small' color={COLOR_PRIMARY} animating={true} />
                                      :
                                      <Text style={styles.submitBtnText}>{eventDetail.comment_form.btn_submit}</Text>
                                  }
                                </TouchableOpacity>
                            }
                          </View>
                          :
                          <Text style={{ color: COLOR_SECONDARY, fontSize: totalSize(2), marginVertical: 10, fontWeight: 'bold' }}>{eventDetail.not_logged_in_msg}</Text>
                      }
                    </View>
                    :
                    null
                }
              </View>
            </ScrollView>
        }
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          style={{ flex: 1 }}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <ImageViewer
            imageUrls={eventDetail.event_detial.gallery_images}
            index={this.state.index}
            pageAnimateTime={500}
            backgroundColor='black'
            onDoubleClick={() => {
              this.setState({ modalVisible: false })
            }}
            onSwipeDown={() => {
              this.setState({ modalVisible: false })
              // console.log('onSwipeDown');
            }}
            enableSwipeDown={true}
          />
        </Modal>
      </View>
    );
  }
}
