import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {createDrawerNavigator,
        DrawerContentScrollView,
        DrawerItemList,
        DrawerItem,} from '@react-navigation/drawer';



import TechicianNavigator from './TechicianNavigator'
import Login from '../screens/Loginscreen'
import Signup from '../screens/Signupscreen'
import Forgot from '../screens/ForgotPasswordscreen'
import SelectMods from '../screens/SelectModsscreen'
import History from '../screens/TechnicianScreen/History'
import Education from '../screens/TechnicianScreen/Education'

const Stack = createStackNavigator() //Stackเข้าสู่ระบบ
const StackMods = createStackNavigator() //Stackเลือกโหมด
const Drawer = createDrawerNavigator(); //Drawerหลักช่าง


//เลือกโหมด
// function ModesStackScreen() {
//   return (  
//     <StackMods.Navigator
//     headerMode = "none">
//       {/* เลือกโหมด */}
//       <StackMods.Screen
//         name='SelectMods'
//         component={SelectMods}
//         options={{ title: 'SelectMods' }}
//       />
//       {/* เข้า screen ช่าง */}
//       <StackMods.Screen
//         name='TechicianNavigator'
//         component={TechicianNavigator}
//         options={{ title: 'TechicianNavigator' }}
//       />

//     </StackMods.Navigator>

//   );
// }






export default function MainStackNavigator() {
  function ModesStackScreen() {
    return (  
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
          name='TechicianNavigator'
          component={TechicianNavigator}
          options={{ title: 'TechicianNavigator' }}
        />
  
      </StackMods.Navigator>
  
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



