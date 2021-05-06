import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View ,Alert } from 'react-native';
import {Container,Left, Body,Right,Content, Title, Header , Subtitle,Input, Item, Button,Icon,Textarea} from 'native-base'  
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import { FontAwesome5 } from '@expo/vector-icons';
import 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  
var db = firebase.firestore();

export default function Work (props) {
  const { navigation } = props
  const KeyRef = React.useContext(Keyaut);
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key).collection("HistoryWork");
  const uid = docRef.doc().id
  //const uid = firebase.firestore().collection("users").doc().id
  const [NameCom, setNameCom] = useState("");
  const [AddressCom, setAddressCom] = useState("");
  const [YearCom, setYearCom] = useState("");
  const [Position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  const SaveData = ()=>{
    setLoading(true)
    const uid = docRef.doc().id
    docRef.doc(uid).set({
      CompanyName: NameCom,
      CompanyAddress: AddressCom,
      YearsWorked: YearCom,
      WorkingPosition: Position,
      Key: uid
    },{ merge: true }).then(() => {
      setLoading(false)
      navigation.navigate('WorkShow')
    })
    .catch((error) => {
      Alert.alert(error);
    });
  }






  const Check = () =>{
    if(NameCom == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบชื่อบริษัท/ร้าน",)
    }
    
    else if(Position == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบตำแหน่งที่ทำ",)
    }
    else if(YearCom == "" ){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบช่วงปีที่ทำ",)
    }
    else if(AddressCom == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบที่อยู่บริษัท/ร้าน",)
    }
    else{
      SaveData()
    }
  }

  return (
    // <Container style={styles.container}>
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.toggleDrawer()}>
            <Icon name='menu'  />
          </Button>
        </Left>
        <Body>
          <View style={{flex:1,flexDirection:'row'}}>
            <View >
              <Title>ประวัติ</Title>
              <Subtitle>เพิ่มประวัติการทำงาน</Subtitle>
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

      <Content padder>
        {/* ชื่อ */}
        <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='ชื่อบริษัท/ร้าน' 
            onChangeText={(e)=>setNameCom(e)}/>
        </Item>
        <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='ตำแหน่ง' 
            onChangeText={(e)=>setPosition(e)}/>
        </Item>
        <Item regular >
            <Input placeholder='ปีที่ทำ' 
            onChangeText={(e)=>setYearCom(e)}/>
        </Item >
        <Textarea rowSpan={5} bordered placeholder="ที่อยู่บริษัท/ร้าน" style ={{marginBottom: 10,fontSize:18}}
        onChangeText={(g)=>setAddressCom(g)}/>

        <Button full rounded  style ={{marginTop: 10, margin:20}}
        // onPress ={()=>SaveData(Name,Contact,Address)}>
        onPress ={Check}>
          <Text style= {{ color:'#FFFFFF'}}>       บันทึก       </Text>
        </Button>

      </Content>
      <Spinner 
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
    </Container>
  );
      
}
const styles = StyleSheet.create({
 
  spinnerTextStyle: {
    color: '#FFF',
  },
});


