import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Button, Image, TouchableOpacity,
  ScrollView, TextInput, ActivityIndicator, I18nManager
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { width, height, totalSize } from 'react-native-dimension';
import { Avatar } from 'react-native-elements';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
import HTMLView from 'react-native-htmlview';
import store from '../../Stores/orderStore';
import styles from '../../../styles/AboutUsStyleSheet';
import { createStackNavigator } from 'react-navigation';
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
import Api from '../../ApiController/ApiController';

const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;

export default class BlogDetail extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      blog_detail: {},
      comment: '',
      is_comment: false
    }
  }
  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.state.params.item.blog_title,
    headerTintColor: 'white',
    headerTitleStyle: {
      fontSize: totalSize(2),
      fontWeight: 'normal'
    },
    headerStyle: {
      backgroundColor: store.settings.data.main_clr
    }
  });
  componentWillMount = async () => {
    let { params } = this.props.navigation.state;
    let item = params.item;
    this.setState({ loading: true })
    let parameter = {
      blog_id: item.blog_id
    };
    let response = await ApiController.post('blog-detail', parameter);
    if (response.success) {
      store.BLOG_DETAIL = response.data;
      await this.setState({ blog_detail: response.data, loading: false })
    } else {
      this.setState({ loading: false })
    }
  }
  post_comment = async () => {
    this.setState({ is_comment: true })
    let { params } = this.props.navigation.state;
    let item = params.item;
    let comments = store.BLOG_DETAIL.comments.comments;
    let parameter = {
      blog_id: item.blog_id,
      message_content: this.state.comment
    }
    let response = await ApiController.post('blog-comments', parameter);
    if (response.success) {
      // store.BLOG_DETAIL.has_comments = true;
      comments.push(response.data.comments);
      this.setState({ is_comment: false , comment: '' })
      Toast.show(response.message)
    } else {
      this.setState({ is_comment: false })
      Toast.show(response.message)
    }
  }
  render() {
    let settings = store.settings.data;
    let main_clr = store.settings.data.main_clr;
    var detail = store.BLOG_DETAIL;
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        {
          this.state.loading ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size='large' color={main_clr} animating={true} />
            </View>
            :
            <ScrollView
              showsVerticalScrollIndicator={false}>
              <View style={{ height: height(40), marginBottom: 10 }}>
                <Image source={{ uri: detail.blog_img }} style={{ height: height(40), width: width(100) }} />
              </View>
              <View style={{ marginHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: totalSize(1.4) }}>{detail.posted_date}</Text>
                  <Text style={{ fontSize: totalSize(1.4), marginLeft: 7 }}>{detail.total_comments}</Text>
                </View>
                <View style={{ justifyContent: 'center', width: width(90), alignItems:'flex-start' }}>
                  <Text style={{ fontSize: totalSize(2), marginBottom: 5, fontWeight: 'bold', color: COLOR_SECONDARY }}>{detail.blog_title}</Text>
                  <HTMLView
                    value={detail.desc}
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
                </View>
                {
                  !detail.comment_status ?
                    <View style={{ height: height(5),marginVertical: 10,justifyContent: 'center', alignItems:'flex-start' }}>
                      <Text style={{ flex: 3, fontSize: totalSize(titles), fontWeight: 'bold', color: COLOR_SECONDARY }}>{detail.status_msg}</Text>
                    </View>
                    :
                    <View>
                      {
                        store.BLOG_DETAIL.has_comments?
                          <View>
                            <View style={{ height: height(5), justifyContent: 'center',marginTop: 5, alignItems:'flex-start' }}>
                              <Text style={{ flex: 3, fontSize: totalSize(titles), fontWeight: 'bold', color: COLOR_SECONDARY }}>{detail.total_comments}</Text>
                            </View>
                            {
                              detail.comments.comments.map((item, key) => {
                                return (
                                  <View key={key} style={{ flex: 1, width: width(95), flexDirection: 'row', borderRadius: 5, marginVertical: 5 }}>
                                    <View style={{ height: height(15), alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                      <Avatar
                                        large
                                        rounded
                                        source={{ uri: item.comment_author_img }}
                                        activeOpacity={1}
                                      />
                                    </View>
                                    <View style={{ marginHorizontal: 10, width: width(60), alignItems:'flex-start' }}>
                                      <Text style={{ fontSize: totalSize(headingTxt), textAlign:'left',marginTop: 5, fontWeight: 'bold', color: COLOR_SECONDARY }}>{item.comment_author_name}</Text>
                                      <Text style={{ fontSize: totalSize(paragraphTxt), color: COLOR_SECONDARY }}>{item.comment_date}</Text>
                                      <Text style={{ marginVertical: 5, fontSize: totalSize(1.4),textAlign:'left' }}>{item.comment_content}</Text>
                                    </View>
                                  </View>
                                )
                              })
                            }
                          </View>
                          :
                          null
                      }
                      {
                        store.BLOG_DETAIL.is_user_logged_in || store.BLOG_DETAIL.comment_status ?
                          <View style={{ marginHorizontal: 0, alignItems:'flex-start' }}>
                            <Text style={{ flex: 3, marginVertical: 15, marginHorizontal:10,fontSize: totalSize(titles), fontWeight: 'bold', color: COLOR_SECONDARY }}>{detail.comment_form.heading}</Text>
                            <TextInput
                              onChangeText={(value) => this.setState({ comment: value })}
                              placeholder={detail.comment_form.textarea}
                              value={this.state.comment}
                              placeholderTextColor='black'
                              keyboardType='email-address'
                              multiline={true}
                              underlineColorAndroid='transparent'
                              autoCorrect={true}
                              style={[{ height: height(20), textAlignVertical: 'top',textAlign:'left',padding: 10,width: width(90), alignSelf: 'center', fontSize: totalSize(subHeadingTxt), borderColor: COLOR_GRAY, borderWidth: 0.5, borderRadius: 5 },I18nManager.isRTL?{textAlign:"right"}:{textAlign:'left'}]}
                            />
                            {
                              settings.is_demo_mode?
                                <View style={{ elevation: 10, height: height(5), width: width(90), marginVertical: 10, alignSelf: 'center', borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: main_clr }}>
                                  {
                                    this.state.is_comment ?
                                      <ActivityIndicator size='small' color={COLOR_PRIMARY} animating={true} />
                                      :
                                      <Text style={{ fontSize: totalSize(buttonTxt), fontWeight: 'bold', color: COLOR_PRIMARY }}>{settings.demo_mode_txt}</Text>
                                  }
                                </View>
                                :
                                <TouchableOpacity style={{ elevation: 10, height: height(5), width: width(90), marginVertical: 10, alignSelf: 'center', borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: main_clr }} onPress={() => { this.post_comment() }}>
                                  {
                                    this.state.is_comment ?
                                      <ActivityIndicator size='small' color={COLOR_PRIMARY} animating={true} />
                                      :
                                      <Text style={{ fontSize: totalSize(buttonTxt), fontWeight: 'bold', color: COLOR_PRIMARY }}>{detail.comment_form.btn_submit}</Text>
                                  }
                                </TouchableOpacity>
                            }
                          </View>
                          :
                          <View style={{ height: height(5),marginVertical: 10,justifyContent: 'center' }}>
                            <Text style={{ flex: 3, fontSize: totalSize(titles), fontWeight: 'bold', color: COLOR_SECONDARY }}>{detail.not_logged_in_msg}</Text>
                          </View>
                      }
                    </View>
                }
              </View>
            </ScrollView>
        }
      </View>
    );
  }
}
