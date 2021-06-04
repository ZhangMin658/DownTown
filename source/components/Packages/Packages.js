import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Image, I18nManager, ScrollView, TouchableOpacity, Picker, ActivityIndicator, RefreshControl
} from 'react-native';
import stripe from 'tipsi-stripe';
import RNPaypal from 'react-native-paypal-lib';
import { width, height, totalSize } from 'react-native-dimension';
import Icon from 'react-native-vector-icons/AntDesign';
import IconDrop from 'react-native-vector-icons/Ionicons';
import Modal from "react-native-modal";
import Toast from 'react-native-simple-toast';
import * as RNIap from 'react-native-iap';
import ApiController from '../../ApiController/ApiController';
import { COLOR_PRIMARY, COLOR_SECONDARY, iconsSize } from '../../../styles/common';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Packages/PackagesStyleSheet';
import { createStackNavigator } from 'react-navigation';

import { AsyncStorage } from 'react-native';

const theme = {
  primaryBackgroundColor: 'white',
  secondaryBackgroundColor: 'white',
  primaryForegroundColor: 'blue',
  secondaryForegroundColor: 'orange',
  accentColor: 'green',
  errorColor: 'red'
};
let itemSkewsIos = ['dwt_business_plan', 'dwt_premium_plan'];
let itemSkewsAndroid = [];

let packgeIdIap = '';
let packageTypeIap = '';
export default class Packages extends Component<Props> {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      loading: false,
      name: '',
      favColor: 'red',
      is_picker: false,
      payment_methodes: [],
      payment_type: '',
      pkg_id: '',
      pkg_type: '',
      amount: '',
      currency: '',
      receipt: null,
      breaker: 0
    }
  }
  static navigationOptions = {
    header: null,
  };
  inAppPurchase = async (pkgId, pkgType, item, model) => {
    isLogged = await this.isLoggedIn()
    if (isLogged) {
      packageTypeIap = pkgType;
      packgeIdIap = pkgId;
      let code = '';
      if (Platform.OS == 'ios') {
        code = model.ios.code;
      }
      else
        code = model.android.code;
      this.requestSubscription(code, pkgId, pkgType);
    } else {
      Toast.show('You need to login')
    }


    // this.setState({ breaker: 0 })
    // try {
    //   console.warn(code);
    //   RNIap.requestPurchase(code,true); //ios: com.scriptsbundle.DWT.business , android: 12 ,item.android.code

    //   console.warn(re);
    //   await RNIap.purchaseUpdatedListener(async (purchase) => {
    //     if (Platform.OS === 'ios') {
    //       await RNIap.finishTransactionIOS(code);
    //     } 
    //     console.warn('purchase======>>>>', purchase);
    //     this.setState({ breaker: this.state.breaker + 1 })
    //     if (this.state.breaker === 1) {
    //       RNIap.consumePurchaseAndroid(purchase.purchaseToken);
    //       await this.freePackage(pkgId, pkgType, 'in_app');
    //       RNIap.consumeAllItemsAndroid();
    //     }
    //   })
    // } catch (err) {
    //   this.setState({ breaker: 0 })
    //   console.log('inAppPurchase ERROR===>>>', err.code, err.message);
    // }
  }

  purchaseUpdateSubscription;
  purchaseErrorSubscription;
  async componentDidMount() {
    await this.getPackages()

    try {
      const itemSkus = Platform.select({
        ios:
          itemSkewsIos
        ,
        android:
          itemSkewsAndroid

      });
      // console.warn(itemSkewsIos);
      const products: Product[] = await RNIap.getSubscriptions(itemSkus);
      console.log("PRoducts===>", products);
      const result = await RNIap.initConnection();
      console.log('result', result);
    } catch (err) {
      console.log(err.code, err.message);
    }
    if (products.length > 0) {
      this.purchaseUpdateSubscription =
        RNIap.purchaseUpdatedListener(
          (purchase: ProductPurchase) => {
            console.log('purchase is', purchase)
            if (Platform.OS === 'ios') {
              RNIap.finishTransactionIOS(purchase.transactionId);
            }
            else
              RNIap.consumePurchaseAndroid(purchase.purchaseToken);

            this.freePackage(packgeIdIap, packageTypeIap, 'in_app');
          });
      this.purchaseErrorSubscription = RNIap.purchaseErrorListener(
        (error: PurchaseError) => {
          console.log('purchaseErrorListener', error);
          alert('purchase cancelled', JSON.stringify(error));
        });
    }


  }
  componentWillMount = async () => {


  }
  requestPurchase = async (sku) => {
    try {
      RNIap.requestPurchase(sku);
    } catch (err) {
      console.log(err.code, err.message);
    }
  }
  requestSubscription = async (sku, id, type) => {
    try {
      const resxxx = await RNIap.requestSubscription(sku);


      console.log('result is ', resxxx)
      packx = {
        id: id,
        type: type
      }
      this.iapSave(packx)
      // RNIap.requestSubscription(sku);
    } catch (err) {
      console.log(err.message);
    }
  }
  iapSave = async (packagexx) => {
    let params = {
      package_id: packagexx.id,
      package_type: packagexx.type,
      source: 'in_app'
    }
    try {
      let response = await ApiController.post('payment', params);
      // console.log('before payment params', JSON.stringify(params))

      if (response.success) {
        // console.log('after payment success', JSON.stringify(response))
        store.settings.data.package = response.data.package;
        Toast.show(response.message, Toast.LONG);

        this.props.navigation.push('ListingPostTabCon')
      } else {
        this.setState({ loading: false })
        Toast.show(response.message, Toast.LONG);
      }
    } catch (error) {
      console.log('error====>>>', error);
      this.setState({ loading: false })
      Toast.show(error.message);
    }
  }

  isLoggedIn = async () => {
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');

    if (email != null && pass != null) {
      return true
    }
    return false
  }
  getPackages = async () => {
    this.setState({ loading: true });
    try {
      var response = await ApiController.post('packages');
      // console.log('packages are====>>>', response);

      if (response.success) {
        store.PACKAGES_OBJ = response.data;
        store.PACKAGES_OBJ.packages.forEach(item => {
          item.selectedMethod = '';
          if (item.ios.code.length != 0)
            itemSkewsIos.push(item.ios.code);
          if (item.android.code.length != 0)
            itemSkewsAndroid.push(item.android.code);
        });

        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      console.log('error: ', error);
      this.setState({ loading: false })
    }
  }
  callerPaymentMethodes = async (itemValue, pkgId, pkgType, amount, currency, item) => {
    store.PACKAGES_OBJ.packages.forEach(item => {
      if (item.package_id === pkgId) {
        item.selectedMethod = itemValue;
      }
    })
    if (itemValue === 'stripe') {
      if (store.PACKAGES_OBJ.stripe.pub_key !== '') {
        await this.stripPayment(itemValue, pkgId, pkgType, amount, currency)
      } else {
        Toast.show(store.PACKAGES_OBJ.generic_msg)
      }
    } else {
      if (itemValue === 'paypal') {
        if (store.PACKAGES_OBJ.paypal.pub_key !== '') {
          await this.payPal(itemValue, pkgId, pkgType, amount, currency)
        } else {
          Toast.show(store.PACKAGES_OBJ.generic_msg)
        }
      } else {
        if (itemValue === 'in_app') {
          if (item.android.key && item.ios.key) {
            await this.inAppPurchase(pkgId, pkgType, item, item);
          } else {
            Toast.show(store.PACKAGES_OBJ.generic_msg)
          }
        }
      }
    }
  }
  stripPayment(itemValue, pkgId, pkgType, amount, currency) {
    this.setState({ loading: false })
    stripe.setOptions({
      publishableKey: store.PACKAGES_OBJ.stripe.pub_key,
    });
    const options = {
      smsAutofillDisabled: true,
      requiredBillingAddressFields: 'zip', // or 'full'
      theme
    };
    stripe.paymentRequestWithCardForm(options)
      .then(response => {
        // Get the token from the response, and send to your server
        this.paidPackage(response.tokenId, 'stripe', itemValue, pkgId, pkgType, amount, currency)
        console.log('token:', response);
      })
      .catch(error => {
        this.setState({ loading: false })
        // Handle error
      });
  }
  payPal = async (itemValue, pkgId, pkgType, amount, currency) => {
    this.setState({ loading: true })
    if (store.PACKAGES_OBJ.paypal.mode === 'sandbox') {
      var env = RNPaypal.ENVIRONMENT.SANDBOX;
    } else {
      var env = RNPaypal.ENVIRONMENT.PRODUCTION;
    }
    RNPaypal.paymentRequest({
      clientId: store.PACKAGES_OBJ.paypal.pub_key,
      environment: env,
      intent: RNPaypal.INTENT.SALE,
      price: parseInt(amount),
      currency: currency,
      description: pkgType,
      acceptCreditCards: true
    }).then(response => {
      this.paidPackage(response.response.id, 'paypal', itemValue, pkgId, pkgType, amount, currency)
      console.log(response)
    }).catch(err => {
      this.setState({ loading: false })
      console.log(err.message)
    })
  }
  freePackage = async (pkg_id, pkg_type, type) => {
    this.setState({ loading: true })
    if (type === 'free') {
      var params = {
        package_id: pkg_id,
        package_type: pkg_type
      }
    } else {
      var params = {
        package_id: pkg_id,
        package_type: pkg_type,
        source: type
      }
    }
    let response = await ApiController.post('payment', params);
    if (response.success) {
      store.settings.data.package = response.data.package;
      await this.getPackages()
      Toast.show(response.message, Toast.LONG);
      this.props.navigation.push('ListingPostTabCon')
    } else {
      this.setState({ loading: false })
      Toast.show(response.message, Toast.LONG);
    }
  }
  paidPackage = async (token, method, itemValue, pkgId, pkgType, amount, currency) => {
    let params = {
      package_id: pkgId,
      package_type: pkgType,
      currency: currency,
      price: amount,
      token: token,
      source: method
    }
    try {
      let response = await ApiController.post('payment', params);
      if (response.success) {
        store.settings.data.package = response.data.package;
        this.setState({ payment_type: itemValue, loading: false })
        Toast.show(response.message, Toast.LONG);
        this.props.navigation.push('ListingPostTabCon')
      } else {
        this.setState({ loading: false })
        Toast.show(response.message, Toast.LONG);
      }
    } catch (error) {
      console.log('error====>>>', error);
      this.setState({ loading: false })
      Toast.show(error.message);
    }
  }
  _blog = (item, key) => {
    let main_clr = store.settings.data.main_clr;
    let data = store.PACKAGES_OBJ;
    return (
      <View key={key} style={styles.blogCon}>
        <View style={{ width: width(70), alignItems: 'center', borderBottomColor: '#c4c4c4', borderBottomWidth: 0.5 }}>
          <Text style={{ marginVertical: 20, color: '#6E768B', fontSize: 22 }}>{item.package_info.title}</Text>
        </View>
        <View style={{ width: width(70), alignItems: 'center', borderBottomColor: '#c4c4c4', borderBottomWidth: 0.5 }}>
          <Text style={{ marginVertical: 20, color: '#6E768B', fontSize: 30 }}><Text style={{ fontSize: 14 }}>{item.package_info.symbol}</Text>{item.package_info.price}</Text>
        </View>
        <View style={{ width: width(70), alignItems: 'center', borderBottomColor: '#c4c4c4', borderBottomWidth: 0.5 }}>
          <View style={{ marginVertical: 20 }}>
            {
              'expiry' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.expiry.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.expiry.title}: {item.expiry.value}</Text>
                </View>
                :
                null
            }
            {
              'listings' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.listings.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.listings.title}: {item.listings.value}</Text>
                </View>
                :
                null
            }
            {
              'listings_expiry' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.listings_expiry.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.listings_expiry.title}: {item.listings_expiry.value}</Text>
                </View>
                :
                null
            }
            {
              'featured' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.featured.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.featured.title}: {item.featured.value}</Text>
                </View>
                :
                null
            }
            {
              'featured_expiry' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.featured_expiry.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.featured_expiry.title}: {item.featured_expiry.value}</Text>
                </View>
                :
                null
            }
            {
              'video' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.video.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.video.title}: {item.video.value}</Text>
                </View>
                :
                null
            }
            {
              'weblink' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.weblink.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.weblink.title}: {item.weblink.value}</Text>
                </View>
                :
                null
            }
            {
              'images' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.images.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.images.title}: {item.images.value}</Text>
                </View>
                :
                null
            }
            {
              'price_range' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.price_range.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.price_range.title}: {item.price_range.value}</Text>
                </View>
                :
                null
            }
            {
              'business_hours' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.business_hours.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.business_hours.title}: {item.business_hours.value}</Text>
                </View>
                :
                null
            }
            {
              'tags' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.tags.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.tags.title}: {item.tags.value}</Text>
                </View>
                :
                null
            }
            {
              'bump' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.bump.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.bump.title}: {item.bump.value}</Text>
                </View>
                :
                null
            }
            {
              'coupon' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.coupon.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.coupon.title}: {item.coupon.value}</Text>
                </View>
                :
                null
            }
            {
              'event' in item ?
                <View key={key} style={styles.stripCon}>
                  {
                    item.event.status ?
                      <Icon name="checkcircle" size={iconsSize} color='#70CD73' />
                      :
                      <Icon name="closecircle" size={iconsSize} color={'red'} />
                  }
                  <Text style={styles.text}>{item.event.title}: {item.event.value}</Text>
                </View>
                :
                null
            }
          </View>
        </View>
        <View style={{ width: width(70), alignItems: 'center' }}>
          {
            item.package_type === 'free' ?
              <TouchableOpacity style={{ marginVertical: 20, width: width(70), borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: main_clr, opacity: item.already_purchased ? 0.5 : 1 }} onPress={() => {
                if (!item.already_purchased) {
                  this.freePackage(item.package_id, item.package_type, 'free')
                }
              }}>
                <Text style={{ marginVertical: 15, fontSize: 16, color: COLOR_PRIMARY }}>{item.already_purchased ? data.user_btn : data.btn_txt}</Text>
              </TouchableOpacity>
              :
              <View style={{ marginVertical: 20, width: width(70), borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: main_clr }}>
                {
                  Platform.OS === 'android' ?
                    <View style={{ height: height(6), width: width(70), flexDirection: 'row', alignItems: 'center' }}>
                      <Picker
                        selectedValue={item.selectedMethod}

                        // itemStyle={[I18nManager.isRTL?{textAlign:'left'}:{}]}
                        style={{ height: height(6), width: width(70), color: 'white' }}
                        onValueChange={async (itemValue, itemIndex) => {
                          // await this.setState({ payment_methodes: item.payments_methods, pkg_id: item.package_id, pkg_type: item.package_type, amount: item.package_info.price, currency: item.package_info.currency }),
                          await this.callerPaymentMethodes(itemValue, item.package_id, item.package_type, item.package_info.price, item.package_info.currency, item)
                        }}>
                        {
                          item.payments_methods.map((item, key) => {
                            return (
                              <Picker.Item key={key} label={item.value} value={item.key} />
                            );
                          })
                        }
                      </Picker>
                    </View>
                    :
                    <TouchableOpacity style={{ marginVertical: 0, width: width(70), borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: main_clr, opacity: item.already_purchased ? 0.5 : 1 }} onPress={() => {
                      this.inAppPurchase(item.package_id, item.package_type, 'free', item)
                    }}>
                      <Text style={{ marginVertical: 15, fontSize: 16, color: COLOR_PRIMARY }}>{item.already_purchased ? data.user_btn : data.btn_txt}</Text>
                    </TouchableOpacity>
                }
              </View>
          }
        </View>
      </View>
    );
  }
  render() {
    let main_clr = store.settings.data.main_clr;
    let data = store.PACKAGES_OBJ;
    return (
      <View style={styles.container}>
        {
          this.state.loading ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={main_clr} size='large' animating={true} />
            </View>
            :
            <ScrollView
              backgroundColor='#f9f9f9'
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  colors={['white']}
                  progressBackgroundColor={store.settings.data.main_clr}
                  tintColor={store.settings.data.main_clr}
                  refreshing={this.state.refreshing}
                  onRefresh={this.getPackages}
                />
              }
            >
              {
                data.has_package ?
                  data.packages.map((item, key) => {
                    // console.warn('loop');
                    return (
                      this._blog(item, key)
                    )
                  })
                  :
                  <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                    <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                    <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.message}</Text>
                  </View>
              }
            </ScrollView>
        }
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
            <View style={{ height: height(4), alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_picker: false }) }}>
                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Picker

                selectedValue={this.state.payment_type}
                // itemStyle={[I18nManager.isRTL?{textAlign:'right'}:{textAlign:'right'},{backgroundColor:'red'}]}
                style={[{ height: height(6), width: width(100) }]}
                onValueChange={async (itemValue, itemIndex) => {
                  this.callerPaymentMethodes(itemValue)
                }}>
                {
                  this.state.payment_methodes.map((item, key) => {
                    return (
                      <Picker.Item key={key} label={item.value} value={item.key} />
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
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: totalSize(1.8),
    paddingLeft: 15,
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 12,
    color: COLOR_PRIMARY,
  },
  inputAndroid: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    color: COLOR_SECONDARY,
  }
});
{/* <View key={key} style={styles.blogCon}>
        <View style={styles.ImgViewCon}>
          <Image source={require('../../images/food.jpg')} style={{height:height(35),width:width(80)}} />
        </View>
        <View style={{flex:1,alignItems:'center'}}>
          {
            this.state.content.map((item,key)=>{
              return(
                <View key={key} style={styles.stripCon}>
                  <Image source={require('../../images/check-box.png')} style={styles.checkImg} />
                  <Text style={styles.text}>Package Expry: 400Days</Text>
                </View>
              )
            })
          }
        </View>
        <View style={{height:height(12),justifyContent:'center',alignItems:'center'}}>
          <View style={{height:height(6),width:width(35),borderRadius:5,justifyContent:'center',alignItems:'center',backgroundColor: COLOR_ORANGE}}>
             <RNPickerSelect
                    placeholder={{
                        // label: 'Select a color...',
                        // value: null,
                    }}
                    mode = "dialog"
                    hideIcon = {false}
                    iconColor={COLOR_PRIMARY}
                    hideDoneBar = {false}
                    value={this.state.favColor}
                    items={this.state.items}
                    onValueChange={(value) => {
                        this.setState({
                            favColor: value,
                        });
                    }}
                    onUpArrow={() => {
                        this.inputRefs.name.focus();
                    }}
                    onDownArrow={() => {
                        this.inputRefs.picker2.togglePicker();
                    }}
                    // viewContainer={{height:height(6),width:width(30),backgroundColor:'red'}}
                    style={{...pickerSelectStyles}}
                    ref={(el) => {
                        this.inputRefs.picker = el;
                    }}
                />

          </View>
        </View>
      </View> */}