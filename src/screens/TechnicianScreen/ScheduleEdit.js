//import { AntDesign } from '@expo/vector-icons'; 
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  
import Spinner from 'react-native-loading-spinner-overlay';
import {Container,Left, Body,Right,Content, Title, Header ,Input, Item, Button,Icon,Textarea} from 'native-base' 
import React, { useState,useEffect } from "react";
import { CheckBox, Text, StyleSheet, View ,  Platform} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MyApp (props){

  const {route} = props
  const { navigation } = props
  const { Ref } = route.params;
  const KeyRef = React.useContext(Keyaut);
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key).collection("Schedule");

  const [onoff, setonoff] = useState();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  //เวลาเปิดปิด
  const [Timeon, setTimeon] = useState(null);
  const [Timeoff, setTimeoff] = useState(null);
  const [DateS, setDateS] = useState(null);
  const [DateE, setDateE] = useState(null);
  
  //const uid = docRef.doc().id
  const [loading, setLoading] = useState(false);



  //รายละเอียดการทำงาน
  const [Work, setWork] = useState(null);
  const [Des, setDes] = useState(null);



  const [Data, setData] = useState(null);

  useEffect(() => {

    docRef.doc(Ref).get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            setData(doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    if(Data != null){
        
        let DateS = Data.start
        let DateE = Data.end
        let DateSS = DateS.slice(1, 10)
        let DateEE = DateE.slice(1, 10)
        let Timeon = DateS.slice(12, 19)
        let Timeoff = DateE.slice(12, 19)
        console.log("GG:",Data);
        setWork(Data.title)
        setDes(Data.summary)
        setTimeon(Timeon)
        setTimeoff(Timeoff)
        setDateS(DateSS)
        setDateE(DateEE)
    }

  }, [Data != null]);

 

  const SaveData = () =>{
    setLoading(true)
    docRef.doc(Ref).set({
      start : DateS + " "+Timeon,
      end: DateE + " "+Timeoff,
      title:Work,
      summary:Des,
    },{ merge: true })
    setLoading(false)
    navigation.navigate('ScheduleShow')
  }

  
  const onChange = (event, selectedDate) => {

    let offtime
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');

    if(onoff == 1){
      let ontime = currentDate.toLocaleTimeString()
      setTimeon(ontime);
      console.log(ontime)
    }

    if(onoff == 2){
      let offtime = currentDate.toLocaleTimeString()
      setTimeoff(offtime); 
      console.log(offtime)
    }

    if(onoff == 3){
      let date = currentDate.toDateString()
      let Dat = currentDate.getDate()
      if(Dat < 10){
        Dat = "0"+String(Dat)
      }else{
        Dat = String(Dat)
      }
      
      let Month = currentDate.getMonth()
      if(Month < 10){
        Month = "0"+String(Month+1)
      }else{
        Month = String(Month+1)
      }
      let Year = currentDate.getFullYear()
      let Data =String(Year) +"-"+Month+"-"+Dat
      setDateS(Data); 
      console.log(Data)
    }

    if(onoff == 4){
      let date = currentDate.toDateString()
      let Dat = currentDate.getDate()
      if(Dat < 10){
        Dat = "0"+String(Dat)
      }else{
        Dat = String(Dat)
      }
      
      let Month = currentDate.getMonth()
      if(Month < 10){
        Month = "0"+String(Month+1)
      }else{
        Month = String(Month+1)
      }
      let Year = currentDate.getFullYear()
      let Data =String(Year) +"-"+Month+"-"+Dat
      setDateE(Data); 
      console.log(Data)
    }
  };



  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepickeron = () => {
    showMode('time');
    setonoff(1);
  };

  const showTimepickeroff = () => {
    showMode('time');
    setonoff(2);
  };

  const showDatepickerS = () => {
    showMode('date');
    setonoff(3);
  };


  const showDatepickerE = () => {
    showMode('date');
    setonoff(4);
  };
  

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.toggleDrawer()}>
            <Icon name='menu'  />
          </Button>
        </Left>
        <Body>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{marginTop:12}}>
              <Title>งานบริการ</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>
        </Body>
        <Right>
        {/* <Button transparent onPress={() => navigation.navigate('Work')}>
            < AntDesign name="edit" size={24} color="#FFFFFF" />
          </Button> */}
        </Right>
      </Header>

      <View style={styles.container}>
        <View style={{flexDirection:'row',margin:15,marginLeft:60}}>
          <View style={{flex:1}}>
            <View>
              <Button full rounded  style={{width:100}}
                onPress={showDatepickerS}  >
                <Text style={{color:'#ffffff'}}>
                  วันเริ่ม
                </Text>
              </Button>
            </View>

            <View style = {{ marginTop : 10}}>
              <Button full rounded style={{width:100,marginRight:10}}
              onPress={showTimepickeron}  >
                <Text style={{color:'#ffffff'}}>
                  เวลาเริ่ม
                </Text>
              </Button>
            </View>
          </View>

          <View style={{flex:1}}>
             <View>
              <Button full rounded  style={{width:100}}
                onPress={showDatepickerE}  >
                <Text style={{color:'#ffffff'}}>
                  วันสิ้นสุด
                </Text>
              </Button>
            </View>

            <View style = {{ marginTop : 10}}>
              <Button full rounded  style={{width:100,marginRight:10}}
                onPress={showTimepickeroff}  >
                <Text style={{color:'#ffffff'}}>
                  เวลาเสร็จสิ้น
                </Text>
              </Button>
            </View>

           
          </View>

          
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}

        <View style ={{flexDirection:'row' ,alignItems:'center',justifyContent:'center'}}>
          <View>
            <View>
              <Text style={{fontSize:16}}>เริ่มวันที่ {DateS} เวลา {Timeon}</Text>
            </View>
            <View>
              <Text style={{fontSize:16}}>
                สิ้นสุดวันที่ {DateE} เวลา {Timeoff}
              </Text>
            </View>
            {/* <View>
              <Text style={{fontSize:16}}>วันที่  {DateS}</Text>
            </View> */}
          </View>
          <View>
            <MaterialCommunityIcons name="timetable" size={80} color="#3F51B5" />
          </View>
        </View>
        
        <Content padder>
          {/* ชื่อ */}
          <Item regular>
              <Input placeholder='งาน' 
              value = {Work}
            onChangeText={(e)=>setWork(e)}
              />
          </Item>

          <Textarea rowSpan={5} bordered placeholder='รายละเอียด' 
            value = {Des}
            onChangeText={(e)=>setDes(e)}
          />
        
          <Button  full rounded    style ={{marginTop: 10, margin:20,marginTop:30}}onPress ={SaveData}>
            <Text style ={{color:'#ffffff'}}> บันทึก </Text>
          </Button>
        </Content>
        <Spinner
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    </Container>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
   
  },
  checkboxInput: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    margin: 5,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});



