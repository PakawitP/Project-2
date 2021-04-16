import React,{ useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {createDrawerNavigator,} from '@react-navigation/drawer';
 import AppLoading from 'expo-app-loading'
import * as Font from "expo-font";
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Zocial } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Context} from '../screens/Customer/context'
import {ContextT} from '../screens/TechnicianScreen/context'
import {Keyaut} from '../screens/Keyaut'

import Login from '../screens/Loginscreen'
import Signup from '../screens/Signupscreen'
import Forgot from '../screens/ForgotPasswordscreen'
import SelectMods from '../screens/SelectModsscreen'

import SidebarT from './DrawerCustomT'
import SidebarC from './DrawerCustomC'


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
import CommentShow from '../screens/TechnicianScreen/CommentShow'
import CommentT from '../screens/TechnicianScreen/CommentT'
import QRCode from '../screens/TechnicianScreen/QRCode'
import StatusAdd from '../screens/TechnicianScreen/StatusAdd'
import CerTech from '../screens/TechnicianScreen/CerTech'
import TListTechnicians from '../screens/TechnicianScreen/ListTechnicians'

import CerEducationShow from '../screens/TechnicianScreen/CerEducationShow'
import CerHistoryShow from '../screens/TechnicianScreen/CerHistoryShow'
import CerServiceWorkShow from '../screens/TechnicianScreen/CerServiceWorkShow'
import CerWorkPictureShow from '../screens/TechnicianScreen/CerWorkPictureShow'
import CerWorkShow from '../screens/TechnicianScreen/CerWorkShow'
import CommentCer from '../screens/TechnicianScreen/CommentCer'
import CommentShowCer from '../screens/TechnicianScreen/CommentShowCer'
import JobAnnouP from '../screens/TechnicianScreen/JobAnnouP'
import JobAnnouShowPT from '../screens/TechnicianScreen/JobAnnouShowPT'


import CListService from '../screens/Customer/ListService'
import CListTechnicians from '../screens/Customer/ListTechnicians'
import CHistoryShow from '../screens/Customer/HistoryShow'
import CWorkPictureShow from '../screens/Customer/WorkPictureShow'
import CServiceWorkShow from '../screens/Customer/ServiceWorkShow'
import CScheduleShow from '../screens/Customer/ScheduleShow'
import CEducationShow from '../screens/Customer/EducationShow'
import CWorkShow from '../screens/Customer/WorkShow'
import CJobAnnou from '../screens/Customer/JobAnnou'
import CJobAnnouShow from '../screens/Customer/JobAnnouShow'
import CJobAnnouShowT from '../screens/Customer/JobAnnouShowT'
import CStatusWork from '../screens/Customer/StatusWork'
import CStatusWorkT from '../screens/Customer/StatusWorkT'
import CCommentShow from '../screens/Customer/CommentShow'
import CCommentT from '../screens/Customer/CommentT'
import CHistory from '../screens/Customer/History'
import CScanQR from '../screens/Customer/ScanQR'
import CStatusAdd from '../screens/Customer/StatusAdd'
import CCommentShowC from '../screens/Customer/CommentShowC'
import CCommentC from '../screens/Customer/CommentC'
import CLocation from '../screens/Customer/Location'

// import { View } from 'native-base';


const fetchFonts = () => {
  return Font.loadAsync({
    "Roboto": require('native-base/Fonts/Roboto.ttf'),
    "Roboto_medium": require('native-base/Fonts/Roboto_medium.ttf'),
    "Helvetica Neue": require('native-base/Fonts/Roboto.ttf'),
    
  });
};


const Stack = createStackNavigator() 
const StackMods = createStackNavigator() 
const Drawer = createDrawerNavigator(); 
const Tab = createBottomTabNavigator();
const TabT = createMaterialTopTabNavigator();


export default function MainSNavigator() {

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

 


/////////////////////////////////////Techician/////////////////////////////////
function TechicianN(){
  return (
 
      <Drawer.Navigator  drawerContent={props => <SidebarT {...props}/>}
       initialRouteName="History" >
        <Drawer.Screen name="ประกาศงาน" component={StackAnnouncement} 
        options={{
          drawerIcon: () => (
            <AntDesign name="infocirlce" size={24} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="สถานะงาน" component={StackStatusWork} 
        options={{
          drawerIcon: () => (
            <Zocial name="statusnet" size={23} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="ประวัติส่วนตัว" component={HistoryStack} 
        options={{
          drawerIcon: () => (
            <Octicons name="person" size={24} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="ประวัติการศึกษา" component={EducationStack} 
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="ประวัติการทำงาน" component={WorkStack} 
        options={{
          drawerIcon: () => (
            <MaterialIcons name="work" size={24} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="รูปภาพการทำงาน" component={WorkPictureStack} 
        options={{
          drawerIcon: () => (
            <Entypo name="image-inverted" size={24} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="งานที่บริการ" component={ServiceStack} 
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons name="auto-fix" size={24} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="ตารางการทำงาน" component={ScheduleStack} 
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons name="chart-scatter-plot-hexbin" size={24} color="#3F51B5" />
          ),
        }}/>
        
        <Drawer.Screen name="รายงานการประเมิน" component={stackComment} 
        options={{
          drawerIcon: () => (
            <AntDesign name="areachart" size={24} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="ขอรับรองจากช่าง" component={Cer} 
        options={{
          drawerIcon: () => (
            <AntDesign name="checkcircle" size={24} color="#3F51B5" />
          ),
        }}/>
        <Drawer.Screen name="โหมดลูกค้า" component={CustomerN} 
        options={{
          drawerIcon: () => (
            <Entypo name="swap" size={24} color="#3F51B5" />
          ),
        }}/>
        {/* <Drawer.Screen name="ออกจากระบบ" component={AfterLogout} 
        options={{
          drawerIcon: () => (
            <Entypo name="log-out" size={24} color="#3F51B5" />
          ),
        }}/> */}
        
      </Drawer.Navigator>
   
  ) 
}



function Cer() {
  return(
  <Stack.Navigator
      initialRouteName='CerTech'
      headerMode = "none"
    
    >
      <Stack.Screen
        name='CerTech'
        component={CerTech}
      />

      <Stack.Screen
        name='StackList'
        component={StackList}
      />

    </Stack.Navigator>

  );
}

function stackComment(){
  return (  
    <Stack.Navigator
      initialRouteName='CommentShow'
      headerMode = "none"
    
    >
      <Stack.Screen
        name='CommentShow'
        component={CommentShow}
      />

      <Stack.Screen
        name='CommentT'
        component={CommentT}
      />

    </Stack.Navigator>

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
      <Stack.Screen name="JobAnnouShowPT" component={JobAnnouShowPT} />
      <Stack.Screen name="JobAnnouP" component={JobAnnouP} />
    </Stack.Navigator>
  )
}

function StackStatusWork(){
  return(
    <Stack.Navigator initialRouteName="StatusWork" headerMode = "none">
      <Stack.Screen name="StatusWork" component={StatusWork} />
      <Stack.Screen name="StatusWorkT" component={StatusWorkT} />
      <Stack.Screen name="QRCode" component={QRCode} />
      <Stack.Screen name="StatusAdd" component={StatusAdd} />
    </Stack.Navigator>
  )
}

function StackList(){
  return(
    <Stack.Navigator initialRouteName="TListTechnicians" headerMode = "none">
      <Stack.Screen name="TListTechnicians" component={TListTechnicians} />
      <Stack.Screen name="MyTabsT" component={MyTabsT} />

    </Stack.Navigator>
  )
}

const   MyTabsT =({ route }) => {
  return (
    <ContextT.Provider value={route.params}>
      <Tab.Navigator 
        initialRouteName="ServiceWorkShow" 
        headerMode = "none"
        backBehavior='initialRoute'>
        <Tab.Screen name="ประวัติ" component={storyT} options={{
          tabBarIcon: () => <AntDesign name="book" size={20} color="#3F51B5" />,
        }}/>
        <Tab.Screen name="งาน" component={CerServiceWorkShow} 
        options={{
          tabBarIcon: () => <AntDesign name="filetext1" size={20} color="#3F51B5" />,
        }}/>
        <Tab.Screen name="รูปภาพ" component={CerWorkPictureShow} 
        options={{
          tabBarIcon: () => <AntDesign name="picture" size={20} color="#3F51B5" />,
        }}/>
        <Tab.Screen name="ผลการประเมิน" component={Cercomment} 
        options={{
          tabBarIcon: () => <AntDesign name="barschart" size={24} color="#3F51B5" />,
        }}/>
      </Tab.Navigator>
    </ContextT.Provider>
  );
}


function storyT(){
  return(
    <TabT.Navigator tabBarPosition='bottom' 
      initialRouteName="CerHistoryShow"
      backBehavior='initialRoute'>
      <Tab.Screen name="ประวัติส่วนตัว" component={CerHistoryShow}  />
      <Tab.Screen name="การศึกษา" component={CerEducationShow} />
      <Tab.Screen name="การทำงาน" component={CerWorkShow} />
    </TabT.Navigator>
  )
}

function Cercomment() {
  return(
    <Stack.Navigator initialRouteName="CommentShowCer" headerMode = "none">
      <Stack.Screen name="CommentShowCer" component={CommentShowCer} />
      <Stack.Screen name="CommentCer" component={CommentCer} />
    </Stack.Navigator>
  )
}

//////////////////////////Custommmer////////////////////////////

function ListT(){
  return(
    <TabT.Navigator tabBarPosition='bottom' 
      backBehavior='initialRoute'>
      <Tab.Screen name="รายชื่อช่าง" component={StackListT}  />
      <Tab.Screen name="งาน/บริการ" component={StackListService} />
    </TabT.Navigator>
  )
}

function StackListT(){
  return(
    <Stack.Navigator initialRouteName="ListTechnicians" headerMode = "none">
      <Stack.Screen name="ListTechnicians" component={CListTechnicians} />
      <Stack.Screen name="MyTabs" component={MyTabs} />
    </Stack.Navigator>
  )
}

function StackListService(){
  return(
    <Stack.Navigator initialRouteName="ListTechnicians" headerMode = "none">
      <Stack.Screen name="ListTechnicians" component={CListService} />
      <Stack.Screen name="MyTabs" component={MyTabs} />

    </Stack.Navigator>
  )
}

function CStackAnnouncement(){
return(
  <Stack.Navigator initialRouteName="JobAnnouShow" headerMode = "none">
    <Stack.Screen name="JobAnnou" component={CJobAnnou} />
    <Stack.Screen name="JobAnnouShow" component={CJobAnnouShow} />
    <Stack.Screen name="JobAnnouShowT" component={CJobAnnouShowT} />
    <Stack.Screen name="CLocation" component={CLocation} />
    <Stack.Screen name="MyTabs" component={MyTabs} />
  </Stack.Navigator>
)
}


function CStackStatusWork(){
return(
  <Stack.Navigator initialRouteName="StatusWork" headerMode = "none">
    <Stack.Screen name="StatusWork" component={CStatusWork} />
    <Stack.Screen name="StatusWorkT" component={CStatusWorkT} />
    <Stack.Screen name="CScanQR" component={CScanQR} />
    <Stack.Screen name="CStatusAdd" component={CStatusAdd} />
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
      <Tab.Screen name="ประวัติ" component={story} options={{
        tabBarIcon: () => <AntDesign name="book" size={20} color="#CA7004" />,
      }}/>
      <Tab.Screen name="งาน" component={CServiceWorkShow} 
      options={{
        tabBarIcon: () => <AntDesign name="filetext1" size={20} color="#CA7004" />,
      }}/>
      <Tab.Screen name="รูปภาพ" component={CWorkPictureShow} 
      options={{
        tabBarIcon: () => <AntDesign name="picture" size={20} color="#CA7004" />,
      }}/>
      <Tab.Screen name="ผลการประเมิน" component={Tcomment} 
      options={{
        tabBarIcon: () => <AntDesign name="barschart" size={24} color="#CA7004" />,
      }}/>
      <Tab.Screen name="ตารางงาน" component={CScheduleShow} 
      options={{
        tabBarIcon: () => <AntDesign name="calendar" size={20} color="#CA7004" />,
      }}/>
      
    </Tab.Navigator>
  </Context.Provider>
);
}


function story(){
  return(
    <TabT.Navigator tabBarPosition='bottom' 
      initialRouteName="HistoryShow"
      backBehavior='initialRoute'>
      <Tab.Screen name="ประวัติส่วนตัว" component={CHistoryShow}  />
      <Tab.Screen name="การศึกษา" component={CEducationShow} />
      <Tab.Screen name="การทำงาน" component={CWorkShow} />
    </TabT.Navigator>
  )
}

function commentS(){
return(
  <Stack.Navigator initialRouteName="CCommentShow" headerMode = "none">
    <Stack.Screen name="CCommentShow" component={CCommentShow} />
    <Stack.Screen name="CCommentT" component={CCommentT} />
  </Stack.Navigator>
)
}

function Tcomment() {
return(
  <Stack.Navigator initialRouteName="CCommentShowC" headerMode = "none">
    <Stack.Screen name="CCommentShowC" component={CCommentShowC} />
    <Stack.Screen name="CCommentC" component={CCommentC} />
  </Stack.Navigator>
)
}


function CustomerN(){
return (
    <Drawer.Navigator  drawerContent={props => <SidebarC {...props}/>}
    initialRouteName="ListT" 
    headerMode = "none">
      <Drawer.Screen name="ช่างเเละบริการ" component={ListT} 
      options={{
        drawerIcon: () => (
          <Entypo name="clipboard" size={24} color="#CA7004" />
        ),
      }}/>
      <Drawer.Screen name="ประวัติส่วนตัว" component={CHistory} 
      options={{
        drawerIcon: () => (
          <Octicons name="person" size={24} color="#CA7004" />
        ),
      }}/>
      <Drawer.Screen name="ประกาศงาน" component={CStackAnnouncement} 
      options={{
        drawerIcon: () => (
          <AntDesign name="infocirlce" size={24} color="#CA7004" />
        ),
      }}/>
      <Drawer.Screen name="สถานะงาน" component={CStackStatusWork} 
      options={{
        drawerIcon: () => (
          <Zocial name="statusnet" size={23} color="#CA7004" />
        ),
      }}/>
      <Drawer.Screen name="การประเมินช่าง" component={commentS} 
      options={{
        drawerIcon: () => (
          <AntDesign name="areachart" size={24} color="#CA7004" />
        ),
      }}/>
      <Drawer.Screen name="โหมดช่าง" component={TechicianN} 
      options={{
        drawerIcon: () => (
          <Entypo name="swap" size={24} color="#CA7004" />
        ),
      }}/>
      {/* <Drawer.Screen name="ออกจากระบบ" component={AfterLogout} 
        options={{
          drawerIcon: () => (
            <Entypo name="log-out" size={24} color="#CA7004" />
          ),
        }}/> */}
    </Drawer.Navigator>
)
}

///////////////////////////////Login/////////////////////////////////

 function ModesStackScreen({route}) { //เลือกโหมดช่าง
  return (  
    <Keyaut.Provider value={route.params}>
      <StackMods.Navigator
        headerMode = "none">
          {/* เลือกโหมด */}
          <StackMods.Screen
            name='SelectMods'
            component={SelectMods}
            options={{ title: 'SelectMods' }}
          />
          {/* เข้า screen ช่าง */}
          <StackMods.Screen
            name='TechicianN'
            component={TechicianN}
            options={{ title: 'TechicianN' }}
          />
          <StackMods.Screen
            name='CustomerN'
            component={CustomerN}
            options={{ title: 'CustomerN' }}
          />
      </StackMods.Navigator>
    </Keyaut.Provider>

  );
}

return (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName='Login'
      headerMode = "none"
      screenOptions={{
        gestureEnabled: false,
      }}
     >
      <Stack.Screen
        name='Login'
        component={Login}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name='Signup'
        component={Signup}
        options={{ title: 'Signup' }}
      />
      <Stack.Screen
        name='Forgot'
        component={Forgot}
        options={{ title: 'Forgot' }}
      />
      <Stack.Screen
        name='SelectMods'
        component={ ModesStackScreen }

        //options={{ title: 'SelectMods' }}
      />
      
    </Stack.Navigator>

  
  </NavigationContainer>

  

)




}


