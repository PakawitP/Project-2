import React,{ useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {createDrawerNavigator,} from '@react-navigation/drawer';
import { AppLoading } from 'expo';
import * as Font from "expo-font";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Context} from '../screens/Customer/context'

import ListTechnicians from '../screens/Customer/ListTechnicians'
import HistoryShow from '../screens/Customer/HistoryShow'
import WorkPictureShow from '../screens/Customer/WorkPictureShow'
import ServiceWorkShow from '../screens/Customer/ServiceWorkShow'
import ScheduleShow from '../screens/Customer/ScheduleShow'
import EducationShow from '../screens/Customer/EducationShow'
import WorkShow from '../screens/Customer/WorkShow'
import JobAnnou from '../screens/Customer/JobAnnou'
import JobAnnouShow from '../screens/Customer/JobAnnouShow'
import JobAnnouShowT from '../screens/Customer/JobAnnouShowT'
import StatusWork from '../screens/Customer/StatusWork'
import StatusWorkT from '../screens/Customer/StatusWorkT'

const Drawer = createDrawerNavigator(); //Drawerหลักช่าง
const Stack = createStackNavigator() 
const Tab = createBottomTabNavigator();
const TabT = createMaterialTopTabNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
    "Roboto": require('native-base/Fonts/Roboto.ttf'),
    "Roboto_medium": require('native-base/Fonts/Roboto_medium.ttf'),
    "Helvetica Neue": require('native-base/Fonts/Roboto.ttf'),
    
  });
};






export default function TechicianNavigator(props) {
  const { navigation } = props
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={err => console.log(err)}
      />
    );
  }


function StackListT(){
  return(
    <Stack.Navigator initialRouteName="ListTechnicians" headerMode = "none">
      <Stack.Screen name="ListTechnicians" component={ListTechnicians} />
      <Stack.Screen name="MyTabs" component={MyTabs} />

    </Stack.Navigator>
  )
}

function StackAnnouncement(){
  return(
    <Stack.Navigator initialRouteName="JobAnnouShow" headerMode = "none">
      <Stack.Screen name="JobAnnou" component={JobAnnou} />
      <Stack.Screen name="JobAnnouShow" component={JobAnnouShow} />
      <Stack.Screen name="JobAnnouShowT" component={JobAnnouShowT} />
      <Stack.Screen name="MyTabs" component={MyTabs} />
    </Stack.Navigator>
  )
}


function StackStatusWork(){
  return(
    <Stack.Navigator initialRouteName="StatusWork" headerMode = "none">
      <Stack.Screen name="StatusWork" component={StatusWork} />
      <Stack.Screen name="StatusWorkT" component={StatusWorkT} />
    </Stack.Navigator>
  )
}
  
const   MyTabs =({ route }) => {
  return (
    <Context.Provider value={route.params}>
      <Tab.Navigator 
        initialRouteName="ServiceWorkShow" 
        headerMode = "none"
        backBehavior='initialRoute'>
        <Tab.Screen name="ประวัติ" component={story} />
        <Tab.Screen name="งาน" component={ServiceWorkShow} />
        <Tab.Screen name="รูปภาพ" component={WorkPictureShow} />
        <Tab.Screen name="ตารางงาน" component={ScheduleShow} />
        
      </Tab.Navigator>
    </Context.Provider>
  );
}


function story(){
  return(
    <TabT.Navigator tabBarPosition='bottom' 
      initialRouteName="HistoryShow"
      backBehavior='initialRoute'>
      <Tab.Screen name="ประวัติส่วนตัว" component={HistoryShow}  />
      <Tab.Screen name="การศึกษา" component={EducationShow} />
      <Tab.Screen name="การทำงาน" component={WorkShow} />
    </TabT.Navigator>
  )
}



  return (
    <NavigationContainer>
      <Drawer.Navigator 
      initialRouteName="StackListT" 
      headerMode = "none">
        <Drawer.Screen name="รายชื่อช่าง" component={StackListT} />
        <Drawer.Screen name="ประกาศงาน" component={StackAnnouncement} />
        <Drawer.Screen name="สถานะงาน" component={StackStatusWork} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}



