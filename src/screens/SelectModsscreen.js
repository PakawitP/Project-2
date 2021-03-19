import React,{ useState ,useEffect, useRef } from 'react';
import { StyleSheet, Text, Image,Alert } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {Container ,Form, Button,} from 'native-base' 
import * as firebase from 'firebase';
import { firebaseConfig } from '../config/firebaseConfig.js';
import {Keyaut} from './Keyaut'
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
//import TechnicianStackNavigator from './src/navigation/TechnicianStackNavigator'
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}  
import logo from '../img/logo.png'; 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});





export default function SelectMods (props) {
  



  const KeyRef = React.useContext(Keyaut);
  const { navigation } = props
  var docRefCU = firebase.firestore().collection("users").doc(KeyRef.key);
  var docRefCE = firebase.firestore().collection("users").doc(KeyRef.key).collection("Education");
  var docRefCW = firebase.firestore().collection("users").doc(KeyRef.key).collection("HistoryWork");
  var docRefOnoff = firebase.firestore().collection("users").doc(KeyRef.key).collection("onoff");
  var docRefService = firebase.firestore().collection("users").doc(KeyRef.key).collection("ServiceWork")

  const [His, setHis] = useState("ตรวจสอบ");
  const [Edu, setEdu] = useState("ตรวจสอบ");
  const [Wor, setWor] = useState("ตรวจสอบ");
  const [Ono, setOno] = useState("ตรวจสอบ");
  const [Ser, setSer] = useState("ตรวจสอบ");
  const [Ale, setAle] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    firebase.firestore().collection("users").doc(KeyRef.key).set({token},{ merge: true})
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
  


  useEffect(() => {
    let History = [];
    let Education = [];
    let HistoryWork = [];
    let onoff = [];
    let ServiceWork = [];

    docRefCU.get().then(function(doc) {
      if (doc.exists) {
          History.push(doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }setHis(History)
    })

    docRefCE.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        Education.push(doc.data());
      });
      setEdu(Education)
    });

    docRefCW.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        HistoryWork.push(doc.data());
      });
      setWor(HistoryWork)
    });

    docRefOnoff.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        onoff.push(doc.data());
      });
      setOno(onoff)
    });

    docRefService.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        ServiceWork.push(doc.data());
      });
      setSer(ServiceWork)
    });


  
   
  }, []);



  const Tec = () =>{
    let D = "ตรวจสอบ"
    let H = His.length
    let E = Edu.length
    let W = Wor.length
    let O = Ono.length
    let S = Ser.length
    let A = false
    console.log("H" + H)
    console.log("E" + E)
    console.log("W" + W)
    console.log("W" + O)
    console.log("S" + S)
    if(H == 0){
      D = D + "ข้อมูลส่วนตัว "
      A = true
    }
    if(E == 0) {
      D = D + "ข้อมูลการศึกษา "
      A = true
    }
    if(W == 0){
      D = D + "ข้อมูลการทำงาน "
      A = true
    }
    if(O == 0){
      D = D + "ข้อมูลเวลาเปิด-ปิด "
      A = true
    }
    if(S == 0){
      D = D + "ข้อมูลงานบริการ"
      A = true
    }

    

    if(A != false){
      docRefCU.set({
        Verify : false
      }, { merge: true })
      .then(Alert.alert(
        'คำเตือน',
        D + "เพื่อให้ข้อมูลครบถ้วน",
      ))
    }

    if( A != true){
      docRefCU.set({
        Verify : true
      }, { merge: true })
    }

    navigation.replace('TechicianN')
  }
  


  return (
    <Container style={styles.container}>
      <Image source={logo}  />
      <Form>
        {/*ช่างผู้ให้บริการ*/ }
        <Button style={{margin:20 , backgroundColor: "#3F51B5",width:200}}  
          onPress ={()=> Tec()}
          full
          rounded 
        >
        <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
        <Text style={{color: 'white'}}> ช่างผู้ให้บริการ</Text>
        </Button>



        {/*ลูกค้า*/ }
        <Button style={{margin :20 , backgroundColor: "#CA7004",width:200}}  
          onPress ={()=> navigation.replace('CustomerN')}
          full
          rounded 
        >
          <Fontisto name="person" size={33} color="#FFFFFF" />
          <Text style={{color: 'white'}}> ลูกค้าผู้รับบริการ</Text>
        </Button>
      </Form>
    </Container>
  );
      
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
