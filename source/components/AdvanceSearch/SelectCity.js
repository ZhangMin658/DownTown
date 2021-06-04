import React, { Component } from 'react';
import {
  Platform, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image,I18nManager,TextInput,
  AsyncStorage
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';

import { Slider, CheckBox } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Geolocation from '@react-native-community/geolocation';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import styles from '../../../styles/AdvanceSearch/AdvanceSearchStyleSheet';
let _this = null;

class CustomHeader extends Component{
  constructor(props)
  {
    super(props);
    this.props = props;
    this.state = {
      searchtxt  :'',
    }
  }
  onBackPress = () => {
    console.log(this.props)
    this.props.onBackPress()
  } 
  onSearchPress = () => {
    this.props.onSearchPress(this.state.searchtxt)
  }
  render(){
    return(
      <View style = {{backgroundColor : '#000', flexDirection : 'row', height: 50, justifyContent : 'center', alignItems : 'center' }}>
        {
          this.props.signup_flag == true ?
          <TouchableOpacity style = {{marginLeft : 10, marginRight : 10, width : 20}}>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress= {this.onBackPress} style = {{marginLeft : 10, marginRight : 10, width : 20}}>
            <AntDesign
              size={22}
              name='arrowleft'
              color='#fff'
              containerStyle={{ marginLeft: 0, marginVertical: 3 }}
            />
          </TouchableOpacity>
        }
        
        <View style={{ flex : 1}}>
          <TextInput
            onChangeText={(value) => this.setState({ searchtxt: value })}
            underlineColorAndroid='transparent'
            value={this.state.searchtxt}
            placeholder={'search city'}
            placeholderTextColor='black'
            underlineColorAndroid='transparent'
            autoCorrect={false}
            style={[I18nManager.isRTL?{textAlign:'right'}:{},{padding: 8,height: 40, backgroundColor: '#fff', width: '100%', borderRadius: 8, fontSize: 16, }]}
          />
        </View>
        <TouchableOpacity onPress= {this.onSearchPress} style={{ backgroundColor: 'black', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginLeft: 5, height:30, width: 35, borderRadius: 15 }}>
            <AntDesign
              size={22}
              name='search1'
              color='#fff'
              containerStyle={{ marginLeft: 0, marginVertical: 3 }}
            />
        </TouchableOpacity>
      </View>
    );
  }
}

@observer
export default class SelectCity extends Component<Props> {
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
      checkamenties: false,
      list_state : [],
      selected_city : {}
    }
    this.props.navigation.setParams({ getCurrentPosition: this.getCurrentPosition });
    // navigation.state.params.func()

  }
  componentDidUpdate =  () => {
    if (this.state.recallRender) { this.setState({ recallRender: false }) }
  }

  onSearchPress =  async (searchtxt) => {
    this.setState({loading : true})
    await this.state.data.all_filters.map((item, key) => {
      if (item.type_name === 'l_location')
      {
        let cnt = 0;
        item.option_dropdown.map(async (element) => {
          cnt = cnt + 1;
          if(element.value != "select city")
          {
            if(element.value.toLowerCase().includes(searchtxt.toLowerCase()))
            {
              store.CUR_CITY = {id : element.key, name : element.value};
            }
            AsyncStorage.setItem('selected_city', JSON.stringify(store.CUR_CITY));
          }
          if(cnt == item.option_dropdown.length){
            console.log(this.state.loading);
            this.setState({loading: false});
          }
        })
      }
    })
  }

  static navigationOptions = ({ navigation }) => ({
    header: <CustomHeader 
                signup_flag = {navigation.getParam('signup_flag')}  
                onBackPress = {() =>{ navigation.pop(); }} 
                onSearchPress = {(searchtxt) =>{ _this.onSearchPress(searchtxt)}}
            />
  })
 
  componentDidMount = async() => {
    _this = this;

    let selected_city = await AsyncStorage.getItem('selected_city')
    if(selected_city != null)
    {
      store.CUR_CITY = JSON.parse(selected_city);
    }
   
    this.subs = this.props.navigation.addListener("didFocus", func = async () => {
      await this.getData();
    });
  }
  
  getData= async()=>{
    store.SEARCH_OBJ = {};
    let response = await ApiController.post('listing-filters');
    // console.log('Listing Filter response====>>>>', response);
    if (response.success) {
      store.SEARCHING.LISTING_FILTER = response;
      // creating new array named as options
      store.SEARCHING.LISTING_FILTER.data.all_filters.forEach(item => {
        if (item.type === 'dropdown') {
          item.options = [];
          item.option_dropdown.forEach(val => {
            item.options.push({ value: val.value })
          });
        }
      });
      this.setState({ data: store.SEARCHING.LISTING_FILTER.data })
    } else {
      this.setState({ data: store.SEARCHING.LISTING_FILTER.data})
    }
  }
  UNSAFE_componentWillMount = async () => {
    console.log("will mount")
    // calling homeData func
    await this.getData();
  }


  getItemOptions = (options) =>{
    if(options == null) return;
    let new_options = []
    options.forEach(element => {
      if(element.value == "Select Country")
      {
        element.value = "select city"
      }
      new_options.push(element);
    });
    return new_options
  }

  render() {
    if (this.state.recallRender)
      console.log("rerendered forcefully")
    // console.log('asdasdf');
    let data = store.SEARCHING.LISTING_FILTER.data;
    if(this.state.data == null){
      return ( <ActivityIndicator size='large' animating={true} />)
    }
    let settings = store.settings.data;
    // console.warn('filters=>>>', JSON.stringify(data.all_filters));
    // console.warn('store=>>>', JSON.stringify(store.SEARCHING.LISTING_FILTER));
    return (
      <View style={styles.container}>
        {
          this.state.loading == true ?
            <ActivityIndicator color={settings.navbar_clr} size='large' animating={true} />
            :
            <View style={styles.ImgSubCon}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {
                  data.all_filters.map((item, key) => {
                    switch (item.type) {
                      case 'dropdown':
                        return (
                            item.type_name === 'l_location'?
                          <View style={[styles.pickerCon, { alignSelf: 'center', marginTop : 50 }]}>
                            <Dropdown
                              label={"select city"}
                              labelFontSize={14}
                              dropdownPosition={-5.5}
                              itemCount={5}
                              value={
                                store.CUR_CITY == null ? 'select city' :
                                store.CUR_CITY.name == "Select Country" ? 'select city' : store.CUR_CITY.name}
                              textColor={COLOR_SECONDARY}
                              itemColor='gray'
                              onChangeText={(value, index) => {
                                console.log('val & key', value + "..." + item.option_dropdown[index].key)
                                store.CUR_CITY = {id : item.option_dropdown[index].key, name : value};
                                AsyncStorage.setItem('selected_city', JSON.stringify(store.CUR_CITY));
                              }}
                              data={this.getItemOptions(item.options)}
                            />
                          </View>
                          : <View />
                        )
                      
                      default:
                        return (

                          <View />
                        )
                    }
                  })
                }

                  <TouchableOpacity style = {{width : '100%', height : 45, borderRadius : 20, marginTop : 60, justifyContent: 'center', alignItems : 'center', backgroundColor : '#a800b7'}}
                    onPress={() => { this.props.navigation.replace('Drawer'); }}>
                    <Text style = {{color : '#fff', fontSize : 16}}>Go to Main Page</Text>
                  </TouchableOpacity>
              </ScrollView>
             
            </View>
        }
      </View>
    );
  }
} 