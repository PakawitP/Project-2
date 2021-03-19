import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View ,Alert,Image ,SafeAreaView} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import {Container,Form, Input, Item, Button, Label} from 'native-base' 
import { firebaseConfig } from '../config/firebaseConfig.js';
import 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
import logo from '../img/logo.png'; 
require("firebase/firestore");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  
var db = firebase.firestore();



export default function Loginscreen (props) {

  const { navigation } = props
  const [Emails, setEmails] = useState("");
  const [Passwords, setPasswords] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null){

        db.collection("users").doc(user.uid).set({
          Key: user.uid,
        },{ merge: true })
        navigation.replace('SelectMods',{ key: user.uid })
      }
    })
  
  }, [])

  /*ฟังก์ชันเข้าสู่ระบบด้วย email*/
  const loginUser = (email,password) =>{
    setLoading(true)
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(function(user){
          console.log(user)
    }, (error) => {
        Alert.alert(error.message);
    });
    setLoading(false)
  }

  

  /*ฟังก์ชันเข้าสู่ระบบ facebook*/
  const login=async ()=>{
    await Facebook.initializeAsync({appId: '338955613739410',appName:'Project' })
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
          { permissions:['public_profile', 'email'] },
        );
        if(type == 'success'){
          const credential = firebase.auth.FacebookAuthProvider.credential(token)
    
          firebase.auth().signInWithCredential(credential).catch((error) => {
            console.log(error)
          })
        }
    }


  return (
    <Container style={styles.container}>
      <SafeAreaView>
      <View style={{alignItems: 'center'}}>
        <Image source={logo}  />
      </View>
    
    <Form> 
      <View style={{alignItems: 'center'}}><Text style={{fontSize:18}}>เข้าสู่ระบบ</Text></View>
      {/*กรอกอีเมลเข้าสู่ระบบ*/ }
      <Item floatingLabel>
        <Label>อีเมล</Label>
          <Input
            autoCorrect={false}
            autoCapitalize={"none"}
            onChangeText={(e)=>setEmails(e)}
          />
      </Item>

      <Item floatingLabel>  
        <Label>รหัสผ่าน</Label>
          <Input
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize={"none"}
            onChangeText={(p)=>setPasswords(p)}
          />
      </Item>
      <View style={{flexDirection: 'row',justifyContent: 'space-around'}}>
        <Button style={{marginTop :30 ,width: 250,backgroundColor:'#5008B2'}}
          full
          rounded
    
          onPress ={()=>loginUser(Emails,Passwords) }
        >
          <Text style={{color: 'white'}}>เข้าสู่ระบบ  </Text>
          <AntDesign name="login" size={24} color="#FFFFFF" />
        </Button>
      </View>  
        {/*  */}

      <View style ={{marginTop :40,flex: 1, flexDirection: 'row',justifyContent: 'space-around'}}>
        <Button style={{backgroundColor:'#5008B2',width: 190,height: 45}}
          full
          rounded
          onPress ={()=> navigation.navigate('Signup')}
        >
          <Text style={{color: 'white'}}>สมัคร  </Text>
          <FontAwesome name="registered" size={24} color="#FFFFFF" />
        </Button>
          

        <Button style={{backgroundColor:'#5008B2',width: 190,height: 45}}
          full
          rounded
          onPress ={()=> navigation.navigate('Forgot')}
        >
          <Text style={{color: 'white'}}>ลืมรหัสผ่าน  </Text>
          <MaterialCommunityIcons name="onepassword" size={24} color="#FFFFFF" />
        </Button>
      </View>
          



          {/*  */}
    


      <View style={{flexDirection: 'row',justifyContent: 'space-around'}}>
      <Button style={{marginTop :100 ,width: 250 }}
          full
          rounded
          primary
          onPress ={()=>login()}
        >
            <Text style={{color: 'white'}}>เข้าระบบด้วย facebook  </Text>
            <Entypo name="facebook" size={24} color="#FFFFFF" />
        </Button>
      </View>

    </Form>
    <Spinner
      visible={loading}
      textStyle={styles.spinnerTextStyle}
    />
    </SafeAreaView>
  </Container>
    );
  
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'space-around',
  },


});
