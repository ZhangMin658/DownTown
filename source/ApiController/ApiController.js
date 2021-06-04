import store from '../Stores/orderStore';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import base64 from 'react-native-base64'
import { Base64 } from 'js-base64';
import Storage from '../LocalDB/storage'
// change your baseUrl and Domain

const base_url = 'https://www.findex.com.co/wp-json/downtown/app';
const PURCHASE_CODE = 'aaf2043c-9db6-4e00-8028-42ac2fb4fca5';
const CUSTOM_SECURITY = 'albert12';



class Api {
  static headers() {
    return {
      'Purchase-Code': PURCHASE_CODE,
      'Custom-Security': CUSTOM_SECURITY,
      'Content-Type': 'application/json',
      'Login-type': store.LOGIN_SOCIAL_TYPE,
      'Authorization': ''
    }
  }

  static postAxios(route, formData, config) {
    return this.axios(route, formData, config)
  }

  static postForm(route, formData) {
    return this.formDataPost(route, formData, 'POST')
  }
  static get(route) {
    return this.func(route, null, 'GET');
  }

  static put(route, params) {
    return this.func(route, params, 'PUT')
  }

  static post(route, params) {
    return this.func(route, params, 'POST')
  }

  static delete(route, params) {
    return this.func(route, params, 'DELETE')
  }

  static func = async (route, params, verb) => {

    const host = base_url;
    const url = `${host}/${route}`
    // console.log("url--->", url);
    let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null);
    options.headers = Api.headers()
   
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');
    // console.log('email and pass ',email+"-"+pass)
    if (email !== null && pass !== null) {
     
      const hash = new Buffer(`${email}:${pass}`).toString('base64');
      options.headers['Authorization'] = `Basic ${hash}`;
     
    }


    let nxxx = await Storage.getItem('language')
      options.headers['Downtown-Lang-Locale'] = nxxx;
    return fetch(url, options).then(resp => {
      // console.log('Api response is ------------->>>>>>', resp);

      let json = resp.json();

      if (resp.ok) {
        return json
      }
      return json.then(err => { throw err });
    }).then(json => {
      // console.log('Api response is ------------->>>>>>', json);

      return json;
    }).catch((erorr) => {
      console.log("error===> " + JSON.stringify(erorr));
    });;
  }

  static formDataPost = async (route, formData, verb) => {

    const host = base_url;
    const url = `${host}/${route}`
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        'Purchase-Code': PURCHASE_CODE,
        'Custom-Security': CUSTOM_SECURITY,
        'Content-Type': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      timeout: 180000
    }
    // getting value from asyncStorage  ***
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');

    //Authorization for login user using buffer ***
    if (email !== null && pass !== null) {

      const hash = new Buffer(`${email}:${pass}`).toString('base64');
      options.headers['Authorization'] = `Basic ${hash}`;
    }
    let nxxx = await Storage.getItem('language')
    console.log('kan is',nxxx)
    options.headers['Downtown-Lang-Locale'] = nxxx;

    return fetch(url, options).then(resp => {
      // console.log('Api response is ------------->>>>>>', resp);

      let json = resp.json();

      if (resp.ok) {
        return json
      }
      return json.then(err => { throw err });
    }).then(json => {
      // console.log('Api response is ------------->>>>>>', json);
      return json;
    }).catch((error) => {
      throw error
      console.log('API ERROR===>>>', error);
    })
  }
  static axios = async (route, formData, config) => {
    const host = base_url;
    const url = `${host}/${route}`

    let options = {
      headers: {
        'Purchase-Code': PURCHASE_CODE,
        'Custom-Security': CUSTOM_SECURITY,
        'Content-Type': 'application/json',
        'Login-type': store.LOGIN_SOCIAL_TYPE,
        'Content-Type': 'multipart/form-data',
      },
      //timeout: 100000, // default is `0` (no timeout)
    }
    // getting value from asyncStorage  ***
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');
    //  console.log('login detail===>>>',email , pass);

    //Authorization for login user using buffer ***
    if (email !== null && pass !== null) {
      const hash = new Buffer(`${email}:${pass}`).toString('base64');
      options.headers['Authorization'] = `Basic ${hash}`;
    }
    let nxxx=await Storage.getItem('language')
    options.headers['Downtown-Lang-Locale'] = nxxx;


    let configration = Object.assign(config, options)
    // console.log('before post formdata is',formData)
    // console.log('before post config is',config)

    return axios.post(url,
      formData,
      configration,
    );
    // .then((response)=>{
    //   console.log('SUCCESS!!',response);
    // })
    // .catch((error)=>{
    //   console.log('FAILURE!!',error);
    // });
  }
}

export default Api;
