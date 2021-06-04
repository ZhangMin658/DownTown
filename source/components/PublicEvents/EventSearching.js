import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image, PermissionsAndroid, PermissionsIos
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import Store from '../../Stores';
import Geolocation from 'react-native-geolocation-service';
import store from '../../Stores/orderStore';
import styles from '../../../styles/AdvanceSearch/AdvanceSearchStyleSheet';
let _this = null;

export default class EventSearching extends Component<Props> {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    _this = this;
    this.state = {
      loading: false,
      event_search: {},

      currentLoc: false,
      radius: 0,
      checked: false,
      seachText: '',
      locationModel: false,
      predictions: [],
      location: '',
      currentLocation: '',
      latitude: '',
      longitude: '',
      streetAddress: '',
      focus: false,
      streetLocation: false,
      isSliderActive: false,
    }
    this.props.navigation.setParams({ getCurrentPosition: this.getCurrentPosition });
    // navigation.state.params.func()
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: params.headerTitle,
      headerStyle: {
        backgroundColor: store.settings.data.navbar_clr,
      },
      headerTintColor: COLOR_PRIMARY,
      headerTitleStyle: {
        fontSize: totalSize(2.2),
      },
    //   headerRight: (
    //     <TouchableOpacity onPress={() => { _this.getCurrentPosition() }}>
    //       {
    //         params.loading ?
    //           <ActivityIndicator color={store.settings.data.navbar_clr} size='small' animating={true} />
    //           :
    //           <Image source={require('../../images/map-placeholder.png')} style={{ height: 20, width: 25, marginRight: 15, resizeMode: 'contain' }} />
    //       }
    //     </TouchableOpacity>
    //   )
    }
  };
  componentWillMount = async() => {
    await this.setState({ seachText: '' })
  }
  componentDidMount() {
    _this = this;
  }
  search = (key, value, list, state) => {
    let { params } = this.props.navigation.state;
    if (this.state.seachText.length !== 0) {
      store.SEARCH_OBJ_EVENT.by_title = this.state.seachText;
    } else {
      store.SEARCH_OBJ_EVENT.by_title = this.state.seachText;
    }
    if (this.state.location.length !== 0) {
      store.SEARCH_OBJ_EVENT.by_location = this.state.location;
    } else {
      store.SEARCH_OBJ_EVENT.by_location = this.state.location;
    }

    if (key === 'event_cat') {
      list.forEach(item => {
        if (item.value === value) {
          store.SEARCH_OBJ_EVENT.event_cat = item.key;
        }
      })
    }
    console.log('params==>>', store.SEARCH_OBJ_EVENT);
    if (state === 'search') {
      // this.props.navigation.push('SearchingScreen');
      //calling function from search screen
      params.getSearchList();
      // calling navigationScreen func for the purpose of moving to drawer's particular screen from outside of drawer by passing drawer route and header title
      params.navigateToScreen('PublicEvents','Public Events');
    }
  }
  placesComplete = async (text, state) => {
    if (text === '' && state === 'road') {
      this.setState({ predictions: [], focus: false })
    } 
    if (text.length > 0 && state === 'road') {
      this.setState({ location: text, focus: true })
    } 
    // const API_KEY = 'AIzaSyDVcpaziLn_9wTNCWIG6K09WKgzJQCW2tI'; // new
    const API_KEY = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';  //old play4team
    fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + text+'&types=address' + '&key=' + API_KEY)
      .then((response) => response.json())
      .then(func = async (responseJson) => {
        // console.log('result Places AutoComplete===>>', responseJson);
        if (responseJson.status === 'OK') {
          await this.setState({ predictions: responseJson.predictions })
        }
      }).catch((error) => {
        console.log('error', error);
      });
  }
  getCurrentPosition = async () => {
    this.setState({ currentLoc: true })
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(func = async (position) => {
          // console.log('getCurrentPosition=',position);
          await this.getAddress(position.coords.latitude, position.coords.longitude);
          await this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          this.setState({ currentLoc: false })
        },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
      }
      else {
        this.setState({ currentLoc: false })
      }
    }
    catch (err) {
      console.warn(err)
    }
  }
  getAddress = async (lat, long) => {
    let api_key = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + api_key)
      .then((response) => response.json())
      .then(func = async (responseJson) => {
        if (responseJson.status === 'OK') {
          var res = responseJson.results[0].address_components;
          await this.setState({ currentLocation: res[0].long_name + ', ' + res[2].long_name, streetLocation: false, isSliderActive: true })
        }
      })
  }
  getLatLong = async (address) => {
    let api_key = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + api_key)
      .then((response) => response.json())
      .then(func = async (responseJson) => {
        // console.warn('latLong', responseJson);
        if (responseJson.status === 'OK') {
          await this.setState({
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng
          })
        }
      })
  }
  render() {
    let data = store.LISTING_FILTER_EVENTS.data;    
    let settings = store.settings.data;
    return (
      <View style={styles.container}>
        {
          this.state.loading ?
            <ActivityIndicator color={ settings.navbar_clr } size='large' animating={true} />
            :
            <View style={styles.ImgSubCon}>
              <ScrollView
                showsVerticalScrollIndicator={ false }
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.scrollView.scrollToEnd({ animated: true });
                }}>
                <View style={styles.subConView}>
                  {
                    data.all_filters.map((item, key) => {
                      return (
                        item.type === 'input' ?
                          <View key={key} style={styles.textInputCon}>
                            {
                              item.type_name === 'by_location' ?
                                <View>
                                  <TextInput
                                    onChangeText={(value) => this.placesComplete(value, 'road')}
                                    underlineColorAndroid='transparent'
                                    label={item.title}
                                    labelStyle={{ color:'red' }}
                                    value={this.state.location}
                                    mode='flat'
                                    underlineColor='#c4c4c4'
                                    placeholder={item.placeholder}
                                    placeholderTextColor= '#c4c4c4'
                                    autoFocus={false}
                                    style={[styles.textInput,{ padding: 0,marginHorizontal: 0 }]}
                                  />
                                  {
                                    this.state.focus === true && this.state.predictions.length > 0 ?
                                      <View style={{ width: width(90), backgroundColor: 'white', marginVertical: 5, elevation: 3 }}>
                                        <ScrollView>
                                          {
                                            this.state.predictions.map((item, key) => {
                                              return (
                                                <TouchableOpacity key={key} style={{ height: height(6), width: width(90), justifyContent: 'center', marginBottom: 0.5, backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: COLOR_GRAY }}
                                                  onPress={() => this.setState({ location: item.description, focus: false })}
                                                >
                                                  <Text style={{ marginHorizontal: 10 }}>{item.description}</Text>
                                                </TouchableOpacity>
                                              );
                                            })
                                          }
                                        </ScrollView>
                                      </View>
                                      : null
                                  }
                                </View>
                                :
                                <TextInput
                                  onChangeText={(value) => this.setState({ seachText: value })}
                                  underlineColorAndroid='transparent'
                                  label={item.title}
                                  mode='flat' 
                                  placeholder={item.placeholder}
                                  placeholderTextColor='#c4c4c4'
                                  style={styles.textInput}
                                />
                            }
                          </View>
                          :
                          <View key={key} style={styles.pickerCon}>
                            <Dropdown
                              label={item.placeholder}
                              labelFontSize={14}
                              dropdownPosition={-5.5}
                              itemCount={5}
                              // value={item.type_name === 'event_cat' && store.moveToSearch ? store.CATEGORY.name : ''}
                              textColor={COLOR_SECONDARY}
                              itemColor='gray'
                              onChangeText={(value) => { this.search(item.type_name, value, item.option_dropdown) , store.moveToSearch? store.CATEGORY = {} : null , store.moveToSearch = false   }}
                              // focus={() => console.warn('hello')}
                              data={item.option_dropdown}
                            />
                          </View>
                      );
                    })
                  }
                </View>
              </ScrollView>
              <TouchableOpacity style={[styles.btnCon,{ backgroundColor: store.settings.data.navbar_clr }]} onPress={() => { this.search(null, null, null, 'search') }}>
                <Text style={styles.btnText}>{data.filter_btn}</Text>
              </TouchableOpacity>
            </View>
        }
      </View>
    );
  }
} 