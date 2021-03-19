import React,{ useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {createDrawerNavigator,
        DrawerContentScrollView,
        DrawerItemList,
        DrawerItem,} from '@react-navigation/drawer';
import { AppLoading } from 'expo';
import * as Font from "expo-font";




import History from '../screens/TechnicianScreen/History'
import HistoryShow from '../screens/TechnicianScreen/HistoryShow'
import Education from '../screens/TechnicianScreen/Education'
import EducationShow from '../screens/TechnicianScreen/EducationShow'
import Work from '../screens/TechnicianScreen/Work'
import WorkShow from '../screens/TechnicianScreen/WorkShow'
import WorkPicture from '../screens/TechnicianScreen/WorkPicture'
import WorkPictureShow from '../screens/TechnicianScreen/WorkPictureShow'
import ServiceWork from '../screens/TechnicianScreen/ServiceWork'
import ServiceWorkShow from '../screens/TechnicianScreen/ServiceWorkShow'
import Schedule from '../screens/TechnicianScreen/Schedule'
import Location from '../screens/TechnicianScreen/Location'
import EducationEdit from '../screens/TechnicianScreen/EducationEdit'
import WorkEdit from '../screens/TechnicianScreen/WorkEdit'
import WorkPictureEdit from '../screens/TechnicianScreen/WorkPictureEdit'
import ScheduleShow from '../screens/TechnicianScreen/ScheduleShow'
import ScheduleEdit from '../screens/TechnicianScreen/ScheduleEdit'
import JobAnnouShow from '../screens/TechnicianScreen/JobAnnouShow'
import JobAnnouShowT from '../screens/TechnicianScreen/JobAnnouShowT'
import StatusWork from '../screens/TechnicianScreen/StatusWork'
import StatusWorkT from '../screens/TechnicianScreen/StatusWorkT'

const Drawer = createDrawerNavigator(); //Drawerหลักช่าง
const Stack = createStackNavigator() 


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


  function HistoryStack() {
    return (  
      <Stack.Navigator
        initialRouteName='HistoryShow'
        headerMode = "none"
      
      >
        <Stack.Screen
          name='HistoryShow'
          component={HistoryShow}
        />

        <Stack.Screen
          name='History'
          component={History}
        />

        <Stack.Screen
          name='Location'
          component={Location}
        />
      </Stack.Navigator>
  
    );
  }


  function EducationStack() {
    return (  
      <Stack.Navigator
        initialRouteName='EducationShow'
        headerMode = "none"
      
      >
        <Stack.Screen
          name='EducationShow'
          component={EducationShow}
         
        />

        <Stack.Screen
          name='Education'
          component={Education}
        />

        <Stack.Screen
          name='EducationEdit'
          component={EducationEdit}
        />

      </Stack.Navigator>
  
    );
  }


  function WorkStack() {
    return (  
      <Stack.Navigator
        initialRouteName='WorkShow'
        headerMode = "none"
      
      >
        <Stack.Screen
          name='WorkShow'
          component={WorkShow}
        />

        <Stack.Screen
          name='Work'
          component={Work}
        />

        <Stack.Screen
          name='WorkEdit'
          component={WorkEdit}
        />
      </Stack.Navigator>
  
    );
  }

  function WorkPictureStack() {
    return (  
      <Stack.Navigator
        initialRouteName='WorkPictureShow'
        headerMode = "none"
      
      >
        <Stack.Screen
          name='WorkPicture'
          component={WorkPicture}
        />

        <Stack.Screen
          name='WorkPictureShow'
          component={WorkPictureShow}
        />

        <Stack.Screen
          name='WorkPictureEdit'
          component={WorkPictureEdit}
        />
      </Stack.Navigator>
  
    );
  }

  function ServiceStack() {
    return (  
      <Stack.Navigator
        initialRouteName='ServiceWorkShow'
        headerMode = "none"
      
      >
        <Stack.Screen
          name='ServiceWorkShow'
          component={ServiceWorkShow}
        />

        <Stack.Screen
          name='ServiceWork'
          component={ServiceWork}
        />
      </Stack.Navigator>
  
    );
  }

  function ScheduleStack() {
    return (  
      <Stack.Navigator
        initialRouteName='ScheduleShow'
        headerMode = "none"
      
      >
        <Stack.Screen
          name='ScheduleShow'
          component={ScheduleShow}
        />

        <Stack.Screen
          name='Schedule'
          component={Schedule}
        />

        <Stack.Screen
          name='ScheduleEdit'
          component={ScheduleEdit}
        />
      </Stack.Navigator>
  
    );
  }

  function StackAnnouncement(){
    return(
      <Stack.Navigator initialRouteName="JobAnnouShow" headerMode = "none">
        <Stack.Screen name="JobAnnouShow" component={JobAnnouShow} />
        <Stack.Screen name="JobAnnouShowT" component={JobAnnouShowT} />
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



  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="History">
        <Drawer.Screen name="ประวัติส่วนตัว" component={HistoryStack} />
        <Drawer.Screen name="ประวัติการศึกษา" component={EducationStack} />
        <Drawer.Screen name="ประวัติการทำงาน" component={WorkStack} />
        <Drawer.Screen name="รูปภาพการทำงาน" component={WorkPictureStack} />
        <Drawer.Screen name="งานที่บริการ" component={ServiceStack} />
        <Drawer.Screen name="ตารางการทำงาน" component={ScheduleStack} />
        <Drawer.Screen name="ประกาศงาน" component={StackAnnouncement} />
        <Drawer.Screen name="สถานะงาน" component={StackStatusWork} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}



