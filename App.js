import React,{ useState, useEffect } from 'react';
// import MainStackNavigator from './src/navigation/MainStackNavigator'
// import TechicianNavigator from './src/navigation/TechicianNavigator'
// import CustomerNavigator from './src/navigation/CustomerNavigator'
import MainSNavigator from './src/navigation/MainSNavigator'

import { LogBox } from 'react-native';
import _ from 'lodash';


LogBox.ignoreAllLogs(true)
// LogBox.ignoreLogs(['Setting a timer']); 
// const _console = _.clone(console);
// console.warn = message => {
//   if (message.indexOf('Setting a timer') <= -1) {
//     _console.warn(message);
//   }
// };






export default function App() {
  
 return <MainSNavigator />
  //return <MainStackNavigator />
  //return <TechicianNavigator/>
  //return <CustomerNavigator/>

}