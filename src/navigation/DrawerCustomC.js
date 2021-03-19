import React,{ useState, useEffect } from 'react';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
    } from '@react-navigation/drawer';
import {Container, Header , Content,Thumbnail} from 'native-base'
import { View ,Text,Alert} from 'react-native';
//import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { firebaseConfig } from '../config/firebaseConfig.js';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
import {Keyaut} from '../screens/Keyaut'
function SidebarC ({...props}){
    const [Data,setData] = useState(null)
    const KeyRef = React.useContext(Keyaut);
    const { navigation } = props
    const [Pho,setPho] = useState(false)  
    useEffect(() => {
        
        var docRef = firebase.firestore().collection("users").doc(KeyRef.key);
        docRef.get().then(function(doc) {
            if (doc.exists) {
                setData(doc.data());
                if(doc.data().Photo){
                    setPho(true)
                }
            } 
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });
          console.log(Data);
          
      }, [Data != null])


    const Logout =()=>{
        Alert.alert(
            "ออกจากระบบ",
            "ต้องการออกจากระบบ",
            [
              {
                text: "ยกเลิก",
                //onPress: () => {navigation.goBack()},
              },
              { text: "ตกลง", onPress: () => {AfterLogoutt()} }
            ],
            { cancelable: false }
          );
    }

    const AfterLogoutt = () =>{
        firebase.auth().signOut().then(function() {
            navigation.replace('Login')
            {AfterLogout()}
          }).catch(function(error) {
            console.log(error)
          });
    }

    if(Pho == true){
    return(
        <Container>
            <Header style={{height:130,backgroundColor: "#CA7004"}}>        
                <View style={{marginTop:10,alignItems:'center'}}>
                    <Thumbnail style={{width: 70, height: 80}} 
                        source={{uri: Data.Photo}} />
                        {/* <MaterialCommunityIcons name="worker" size={80} color="#FFFFFF" /> */}
                        <View>
                            <Text  style={{color:"#FFFFFF"}}>{Data.Name}</Text>
                            <Text  style={{color:"#FFFFFF" ,marginLeft:8 }}>โหมดลูกค้า</Text>
                            
                        </View>
 
                </View>
            </Header>
                <Content>
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList{...props}/> 
                        <DrawerItem 
                        icon={()=>
                            <Entypo name="log-out" size={24} color="#CA7004" />
                        }
                        label="ออกจากระบบ"
                         onPress={() => Logout()} />
                    </DrawerContentScrollView>
                </Content>
        </Container>
    );}else{
        return(
        <Container>
            <Header style={{height:130,backgroundColor: "#CA7004"}}>        
                <View style={{marginTop:10,alignItems:'center'}}>
                    <Thumbnail style={{width: 70, height: 80}} 
                        source={{uri:'https://firebasestorage.googleapis.com/v0/b/ftynaja.appspot.com/o/scr%2Ftoppng.com-person-vector-512x512.png?alt=media&token=657b157e-2819-4257-98fc-fe11e5c4f0c5'}} />
                    {/* <MaterialCommunityIcons name="worker" size={80} color="#FFFFFF" /> */}
                    <Text  style={{color:"#FFFFFF"}}>ชื่อ - สกุล</Text>
                    <Text  style={{color:"#FFFFFF"}}>โหมดลูกค้า</Text>
                </View>
            </Header>
                <Content>
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList{...props}/> 
                        <DrawerItem 
                        icon={()=>
                            <Entypo name="log-out" size={24} color="#CA7004" />
                        }
                        label="ออกจากระบบ" 
                        onPress={() => Logout()} />
                    </DrawerContentScrollView>
                </Content>
        </Container>);
    }
}

export default SidebarC