import React, { Component } from 'react';
import {
  Platform, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image,

} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';

import { Slider, CheckBox } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Geolocation from '@react-native-community/geolocation';

import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import styles from '../../../styles/AdvanceSearch/AdvanceSearchStyleSheet';
let _this = null;

@observer
export default class AdvanceSearch extends Component<Props> {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    _this = this;
    this.state = {
      loading: false,
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
      data: null,
      recallRender: false,
      checkamenties: false
    }
    this.props.navigation.setParams({ getCurrentPosition: this.getCurrentPosition });
    // navigation.state.params.func()
  }
  componentDidUpdate = () => {
    if (this.state.recallRender) { this.setState({ recallRender: false }) }
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: store.settings.data.menu.adv_search,
      headerStyle: {
        backgroundColor: store.settings.data.navbar_clr,
      },
      headerTintColor: COLOR_PRIMARY,
      headerTitleStyle: {
        fontSize: totalSize(2.2),
      },
      headerRight: (
        <TouchableOpacity onPress={() => { _this.getCurrentPosition() }}>
        
        </TouchableOpacity>
      )
    }
  };
  componentDidMount() {
    _this = this;
  }
  search = async (key, value, list, action) => {
    let { params } = this.props.navigation.state;
    store.moveToSearchTXT = false
    if (this.state.seachText.length !== 0) {
      store.SEARCH_OBJ.by_title = this.state.seachText;
    } else {
      store.SEARCH_OBJ.by_title = this.state.seachText;
    }
    if (this.state.location.length !== 0) {
      store.SEARCH_OBJ.street_address = this.state.location;
    } else {
      store.SEARCH_OBJ.street_address = this.state.location;
    }
    if (this.state.currentLocation.length !== 0) {
      store.SEARCH_OBJ.e_lat = this.state.latitude;
      store.SEARCH_OBJ.e_long = this.state.longitude;
      store.SEARCH_OBJ.e_distance = this.state.radius;
    } else {
      store.SEARCH_OBJ.e_lat = this.state.latitude;
      store.SEARCH_OBJ.e_long = this.state.longitude;
      store.SEARCH_OBJ.e_distance = this.state.radius;
    }
   
    for (var j = 0; j < store.SEARCHING.LISTING_FILTER.data.all_filters.length; j++) {
      if (store.SEARCHING.LISTING_FILTER.data.all_filters[j].type == 'checkbox') {
        store.SEARCH_OBJ.amenties = []

        for (var x = 0; x < store.SEARCHING.LISTING_FILTER.data.all_filters[j].option_dropdown.length; x++) {
          if (store.SEARCHING.LISTING_FILTER.data.all_filters[j].option_dropdown[x].checked == true) {
            // if(store.SEARCH_OBJ.amenties==undefined){
            // }
            store.SEARCH_OBJ.amenties.push(store.SEARCHING.LISTING_FILTER.data.all_filters[j].option_dropdown[x].key)
          }
        }
      }
      // console.log('store.SEARCHING.LISTING_FILTER.data.all_filters',store.SEARCHING.LISTING_FILTER.data.all_filters[j])
    }
    // console.log('search obj', store.SEARCH_OBJ)
    if (key === 'l_category') {
      list.forEach(async item => {
        if (item.value === value) {
          store.SEARCH_OBJ.l_category = item.key;
        }
      })
    }

    if (key === 'l_location') {
      list.forEach(async item => {
        if (item.value === value) {
          store.SEARCH_OBJ.l_location = item.key;
        }
      })
    }

    if (key === 'l_price_type') {
      list.forEach(item => {
        if (item.value === value) {
          store.SEARCH_OBJ.l_price_type = item.key;
        }
      })
    }
    if (key === 'l_rating') {
      list.forEach(item => {
        if (item.value === value) {
          item.checkStatus = !item.checkStatus,
            store.SEARCH_OBJ.l_rating = item.key;
        } else {
          item.checkStatus = false;
        }
      })
      this.setState({ loading: false })
    }
    if (key === 'l_listing_status') {
      store.SEARCH_OBJ.l_listing_status = value.checkStatus ? 'opened' : "";
      this.setState({ loading: false })
    }
    
    // console.log('params==>>', store.SEARCH_OBJ);
    if (action == 'search') {
      // this.props.navigation.push('SearchingScreen');
      //calling function from search screen
      /*
      params.getSearchList();
      // calling navigationScreen func for the purpose of moving to drawer's particular screen from outside of drawer by passing drawer route and header title
      params.navigateToScreen('SearchingScreen', 'Advance Search');
      */
      // alert(action)
      this.props.navigation.navigate('SearchingScreen', 'Advance Search');
    }
  }


  placesComplete = async (text, state) => {
    // console.log('here')
    if (text === '' && state === 'road') {
      this.setState({ location:'',predictions: [], focus: false })
    } else {
      if (text === '' && state === 'street') {
        this.setState({ currentLocation:'',predictions: [], streetLocation: false, isSliderActive: false })
      }
    }
    if (text.length > 0 && state === 'road') {
      this.setState({ location: text, focus: true })
    } else {
      if (text.length > 0 && state === 'street') {
        this.setState({ currentLocation: text, streetLocation: true })
      }
    }

    if (text != '') {
      const API_KEY = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';  //old play4team
      fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + text + '&types=address' + '&key=' + API_KEY)
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
  }
  // const API_KEY = 'AIzaSyDVcpaziLn_9wTNCWIG6K09WKgzJQCW2tI'; // new

  getCurrentPosition = async () => {
    this.setState({ currentLoc: true })
    Geolocation.getCurrentPosition(async position => {
      await this.getAddress(position.coords.latitude, position.coords.longitude);
      await this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      this.setState({ currentLoc: false })
    });

    // try {
    //   if (Platform.OS === 'android') {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //     )
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       Geolocation.getCurrentPosition(func = async (position) => {
    //         // console.log('getCurrentPosition=', position);
    //         await this.getAddress(position.coords.latitude, position.coords.longitude);
    //         await this.setState({
    //           latitude: position.coords.latitude,
    //           longitude: position.coords.longitude,
    //         });
    //         this.setState({ currentLoc: false })
    //         console.log(this.state.latitude)
    //       },
    //         (error) => this.setState({ error: error.message }),
    //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
    //     }
    //     else {
    //       this.setState({ currentLoc: false })
    //     }
    //   } else {
    //     Geolocation.getCurrentPosition(func = async (position) => {
    //       // console.log('getCurrentPosition========>>>>>>', position);
    //       await this.getAddress(position.coords.latitude, position.coords.longitude);
    //       await this.setState({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       });
    //       this.setState({ currentLoc: false })
    //       console.log(this.state.latitude)
    //     },
    //       (error) => this.setState({ error: error.message }),
    //       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
    //   }
    // }
    // catch (err) {
    //   console.warn(err)
    // }
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

  checkamenties = async (item, key, type) => {
    // console.log('item',JSON.stringify(item))
    // console.log('key',key)
    // console.log('data',JSON.stringify(this.state.data))
    if (type === 'l_category') {
      this.setState({ loadingAmenties: true })
      // console.log('old data',JSON.stringify(this.state.data))

      if (key != "") {
        let response = await ApiController.post('listing-filters', { sel_categ: key });

        if (response.success) {
          // console.log('new data',JSON.stringify(response.data))
          store.SEARCHING.LISTING_FILTER = response;
          // creating new array named as options
          // console.log('all filter store before adding options array',JSON.stringify(store.SEARCHING.LISTING_FILTER.data.all_filters))


          store.SEARCHING.LISTING_FILTER.data.all_filters.forEach(item => {
            if (item.type === 'dropdown') {
              item.options = [];
              item.option_dropdown.forEach(val => {
                item.options.push({ value: val.value })
              });
            }
            if (item.type === 'checkbox') {
              item.options = [];
              item.option_dropdown.forEach(val => {
                item.options.push({ key: val.key, value: val.value, checked: false })
              });
              item.option_dropdown = item.options
            }
          });

          this.setState({ recallRender: true, loadingAmenties: false })
          // console.log('all filter store AFTER adding options array',JSON.stringify(store.SEARCHING.LISTING_FILTER.data.all_filters))




          // this.setState({ data: response.data })
          // let newdata={}
          // for(x=0;x<this.state.data.all_filters.length;x++){
          //   if(this.state.data.all_filters[x].type_name=='l_category'){
          //     if
          //   }
          // }
          //  store.SEARCHING.LISTING_FILTER = {...response};
        }
      }
    }
  }

  componentWillMount() {
    // let data = 
    this.setState({
      data: store.SEARCHING.LISTING_FILTER.data
    })
  }
  render() {
    if (this.state.recallRender)
      console.log("rerendered forcefully")
    // console.log('asdasdf');
    let data = store.SEARCHING.LISTING_FILTER.data;
    let settings = store.settings.data;
    // console.warn('filters=>>>', JSON.stringify(data.all_filters));
    // console.warn('store=>>>', JSON.stringify(store.SEARCHING.LISTING_FILTER));

    return (
      <View style={styles.container}>
        {
          this.state.loading ?
            <ActivityIndicator color={settings.navbar_clr} size='large' animating={true} />
            :
            <View style={styles.ImgSubCon}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
              // style={{height:'80%',width:'100%'}}
              // showsVerticalScrollIndicator={false}
              // ref={ref => this.scrollView = ref}
              // onContentSizeChange={(contentWidth, contentHeight) => {
              //   this.scrollView.scrollToEnd({ animated: true });
              // }}
              >
                {/* <View style={[styles.subConView]}> */}
                {
                  data.all_filters.map((item, key) => {
                    switch (item.type) {
                      case 'input':
                        return (
                          <View key={key} style={styles.textInputCon}>
                            {
                              item.type_name === 'street_address' ?
                                <View>
                                  <TextInput
                                    onChangeText={(value) => this.placesComplete(value, 'road')}
                                    underlineColorAndroid='transparent'
                                    label={item.title}
                                    labelStyle={{ color: 'red' }}
                                    value={this.state.location}
                                    mode='flat'
                                    underlineColor='#c4c4c4'
                                    placeholder={item.placeholder}
                                    placeholderTextColor='#c4c4c4'
                                    autoFocus={false}
                                    style={[styles.textInput, { padding: 0, marginHorizontal: 0 }]}
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
                                  value={this.state.seachText}
                                  theme={{colors:{primary:'#c4c4c4'}}}
                                  selectionColor='#000'
                                  placeholder={item.placeholder}
                                  placeholderTextColor='#c4c4c4'
                                  style={styles.textInput}
                                />
                            }
                          </View>
                        )
                      case 'dropdown':
                        return (
                          <View style={[styles.pickerCon, { alignSelf: 'center' }]}>
                            <Dropdown
                              label={item.placeholder}
                              labelFontSize={14}
                              dropdownPosition={-5.5}
                              itemCount={5}
                              value={item.type_name === 'l_category' && store.moveToSearch ? store.CATEGORY.name : item.type_name === 'l_location' && store.moveToSearch ? store.CATEGORY.name:''}
                              textColor={COLOR_SECONDARY}
                              itemColor='gray'
                              onChangeText={(value, index) => {
                                console.log('val & key', value + "..." + item.option_dropdown[index].key)
                                this.search(item.type_name, value, item.option_dropdown),
                                  store.moveToSearch ? store.CATEGORY = {} : null,
                                  store.moveToSearch = false
                                if(item.type_name!='l_location'){
                                  this.checkamenties(item, item.option_dropdown[index].key, item.type_name)
                                }


                              }}
                              data={item.options}
                            />
                            {
                              this.state.loadingAmenties && item.type_name === 'l_category' ?
                                <ActivityIndicator
                                  style={{ position: 'absolute', right: width(10) }}
                                  color={settings.navbar_clr} size='small' animating={true} />
                                : null
                            }


                          </View>
                        )
                      case 'checkbox':
                        return (
                          item.option_dropdown.length > 0 ?
                            <View style={{ alignSelf: 'center', marginTop: width(4) }}>
                              <Text style={{ fontSize: width(4) }}>{item.placeholder}</Text>

                              <View style={{
                                width: '90%',
                                // backgroundColor:'red',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignSelf: 'center'
                              }}>

                                {
                                  item.option_dropdown.map((itemx, key, index) => (

                                    <CheckBox
                                      checkedColor={store.settings.data.navbar_clr}
                                      uncheckedColor={COLOR_GRAY}
                                      title={itemx.value}
                                      key={key}
                                      // checked
                                      checked={itemx.checked}
                                      //false

                                      //false
                                      // }
                                      containerStyle={{
                                        width: '44%',
                                        padding: 0,
                                        margin: 0,
                                        borderWidth: 0,
                                        borderRadius: 0,
                                        backgroundColor: null,
                                        marginTop: 10,
                                        marginStart: -0.5,
                                      }}
                                      size={15}
                                      textStyle={{
                                        fontWeight: 'normal',
                                      }}
                                      key={key}
                                      onPress={() => {
                                        // let checkBoxClone = item.option_dropdown;
                                        // console.warn('index'+JSON.stringify(index) +" item"+JSON.stringify(itemx)+" key"+JSON.stringify(key));
                                        // checkBoxClone[index].values[key].is_checked = !item.is_checked;
                                        // checkBoxClone[index].showError = false;
                                        //  console.warn(JSON.stringify(this.state.pageThree[index].values[key].name)); 
                                        // checkBoxClone.values[key].isChecked = !item.isChecked;
                                        // this.setState({ recallRender: true });

                                        itemx.checked = !itemx.checked




                                      }}


                                    >
                                    </CheckBox>

                                  )
                                  )}
                              </View>
                            </View> : null
                          // <View style={{ marginTop: width(5),backgroundColor:'red', }}>
                          //   <Text style={{ fontSize: width(4) }}>{item.placeholder}</Text>
                          //   <FlatList
                          //     // numColumns={2}
                          //     horizontal
                          //     style={{ backgroundColor:'yellow'}}
                          //     data={[{key:1,value:'one'},{key:2,value:'two'}]}
                          //     renderItem={({ item, key }) =>
                          //     <View >
                          //       <CheckBox
                          //         checkedColor={store.settings.data.navbar_clr}
                          //         uncheckedColor={COLOR_GRAY}
                          //         title={item.value}
                          //         key={key}
                          //         checked={item.is_checked}
                          //         // containerStyle={{ width: width(40) }}
                          //         // size={16}

                          //         onPress={() => {
                          //           let checkBoxClone = [...this.state.pageThree];
                          //           // console.warn(JSON.stringify(item.name));
                          //           checkBoxClone[index].values[key].is_checked = !item.is_checked;
                          //           checkBoxClone[index].showError = false;
                          //           //  console.warn(JSON.stringify(this.state.pageThree[index].values[key].name)); 
                          //           // checkBoxClone.values[key].isChecked = !item.isChecked;
                          //           this.setState({ pageThree: checkBoxClone });

                          //         }}>
                          //       </CheckBox>
                          //       </View>
                          //     }
                          //   />

                          // </View>
                        )
                      default:
                        return (

                          <View />
                        )
                    }
                    // return (
                    //   item.type === 'input' ?

                    //     :
                    //     item.type === 'dropdown' ?
                    //      :
                    //       null
                    //     item.type === 'checkbox' ?
                    //     [
                    //     
                    //     ]
                    // :null
                    // );
                  })
                }
                {
                  data.is_status_enabled ?
                    <View style={{ alignSelf: 'center', flex: 1, width: width(90), alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                      <Text style={{ fontSize: totalSize(1.9), color: COLOR_SECONDARY, marginVertical: 5 }}>{data.status.title}</Text>
                      <TouchableOpacity style={{ borderRadius: 20, backgroundColor: data.status.checkStatus ? settings.main_clr : '#c4c4c4' }} onPress={() => { data.status.checkStatus = !data.status.checkStatus, this.search(data.status.type_name, data.status) }}>
                        <Text style={{ fontSize: totalSize(1.8), color: data.status.checkStatus ? COLOR_PRIMARY : COLOR_SECONDARY, marginVertical: 5, marginHorizontal: 10 }}>{data.status.placeholder}</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    null
                }
                {
                  data.is_rated_enabled ?
                    <View style={{ alignSelf: 'center', flex: 1, marginTop: 10, width: width(90), alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                      <Text style={{ fontSize: totalSize(1.9), color: COLOR_SECONDARY, marginVertical: 5 }}>{data.rated.title}</Text>
                      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                          data.rated.option_dropdown.length > 0 ?
                            data.rated.option_dropdown.map((item, key) => {
                              return (
                                <TouchableOpacity key={key} style={{ borderRadius: 20, backgroundColor: item.checkStatus ? settings.main_clr : '#ccc', marginRight: 5 }} onPress={() => { this.search(data.rated.type_name, item.value, data.rated.option_dropdown) }}>
                                  <Text style={{ fontSize: totalSize(1.8), color: item.checkStatus ? COLOR_PRIMARY : COLOR_SECONDARY, marginVertical: 5, marginHorizontal: 10 }}>{item.value}</Text>
                                </TouchableOpacity>
                              )
                            })
                            : null
                        }
                      </View>
                    </View>
                    :
                    null
                }
                {
                  data.is_current_loc_enabled ?
                    this.state.currentLoc ?
                      <View style={{ alignSelf: 'center', width: width(100), alignItems: 'center', marginVertical: 20 }}>
                        <ActivityIndicator color={settings.navbar_clr} size='large' animating={true} />
                      </View>
                      :
                      <View style={{ width: width(100), alignItems: 'center' }}>
                        <TextInput
                          onChangeText={(value) => this.placesComplete(value, 'street')}
                          underlineColorAndroid='transparent'
                          label={data.current_location}
                          value={this.state.currentLocation}
                          mode='flat'
                          underlineColor='#c4c4c4'
                          placeholder={data.current_location}
                          placeholderTextColor={COLOR_GRAY}
                          autoFocus={false}
                          style={styles.textInput}
                        />
                        {
                          this.state.streetLocation === true && this.state.predictions.length > 0 ?
                            <View style={{ width: width(90), backgroundColor: 'white', marginVertical: 5, elevation: 3 }}>
                              <ScrollView>
                                {
                                  this.state.predictions.map((item, key) => {
                                    return (
                                      <TouchableOpacity key={key} style={{ height: height(6), width: width(90), justifyContent: 'center', marginBottom: 0.5, backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: COLOR_GRAY }}
                                        onPress={() => {
                                          console.log('on[rxx called')
                                          this.setState({ currentLocation: item.description, streetLocation: false, isSliderActive: true }), this.getLatLong(item.description)
                                        }}
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
                        {
                          this.state.isSliderActive ?
                            <View style={styles.sliderTitle}>
                              <View style={styles.subConSliderTitle}>
                                <View style={{ height: height(3), width: width(45) }}>
                                  <Text style={styles.radiusLabel}>{data.current_radius} :</Text>
                                </View>
                                <View style={{ height: height(3), width: width(45), alignItems: 'flex-end' }}>
                                  <Text style={styles.numberLabel}>{Math.round(this.state.radius)}</Text>
                                </View>
                              </View>
                              <Slider
                                value={0}
                                // step={20,40,60,80,100}
                                onValueChange={(value) => this.setState({ radius: value })}
                                // onSlidingComplete={(value)=>console.warn(value)}
                                animateTransitions={true}
                                debugTouchArea={false}
                                minimumValue={0}
                                maximumValue={100}
                                minimumTrackTintColor={store.settings.data.navbar_clr}
                                maximumTrackTintColor='rgba(211,211,211,0.3)'
                                // maximumTrackImage={require('../../images/twitter.png')}
                                // minimumTrackImage={require('../../images/twitter.png')}
                                // thumbImage={require('../../images/twitter.png')}
                                // trackImage={require('../../images/twitter.png')}
                                trackStyle={{ backgroundColor: 'gray' }}
                                thumbStyle={{ backgroundColor: store.settings.data.navbar_clr }}
                                // thumbTintColor= {COLOR_ORANGE}
                                thumbTouchSize={{ width: width(4), height: height(4) }}
                                style={{ alignSelf: 'stretch' }}
                              />
                              <View style={{ height: height(3), width: width(90), flexDirection: 'row' }}>
                                <View style={{ height: height(3), width: width(45) }}>
                                  <Text style={{ fontSize: totalSize(1.5), paddingLeft: 5, color: settings.navbar_clr }}>0 {data.radius_unit}</Text>
                                </View>
                                <View style={{ height: height(3), width: width(45), alignItems: 'flex-end' }}>
                                  <Text style={{ fontSize: totalSize(1.5), color: settings.navbar_clr }}>100 {data.radius_unit}</Text>
                                </View>
                              </View>
                            </View>
                            : null
                        }
                      </View>
                    :
                    null
                }
                {/* </View> */}
              </ScrollView>
              <TouchableOpacity style={[styles.btnCon, { backgroundColor: store.settings.data.navbar_clr }]} onPress={() => { this.search(null, null, null, 'search') }}>
                <Text style={styles.btnText}>{data.filter_btn}</Text>
              </TouchableOpacity>
            </View>
        }
      </View>
    );
  }
} 