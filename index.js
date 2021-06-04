/** @format */
import 'react-native-gesture-handler'

import {AppRegistry} from 'react-native';

import App from './App';
import {name as appName} from './app.json';
import bgMessaging from './bgMessaging';
console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); 

// RN 0.56 Release version crashes
// import App from './App';
// import {name as appName} from './app.json';
// AppRegistry.registerComponent('DWT', () => App)

// Workaround: RN 0.56 Release version crashes
// Sources:
//      https://github.com/facebook/react-native/issues/19827
//      https://github.com/facebook/react-native/issues/20150]
//      https://stackoverflow.com/questions/51212618/how-to-use-mobx-in-react-native-0-56-babel-7-with-decorators#comment91432946_51234815      
//      https://github.com/oblador/react-native-vector-icons/issues/801
//
// import applyDecoratedDescriptor from '@babel/runtime/helpers/es6/applyDecoratedDescriptor'
// import initializerDefineProperty from '@babel/runtime/helpers/es6/initializerDefineProperty'

// Object.assign(babelHelpers, {applyDecoratedDescriptor, initializerDefineProperty})


// AppRegistry.registerComponent('DWT', () => require('./App').default);
