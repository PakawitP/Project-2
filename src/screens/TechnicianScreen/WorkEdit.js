import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View ,Alert, } from 'react-native';
import {Container,Left,Label, Body,Right,Content, Title, Header , Subtitle,Input, Item, Button,Icon,Textarea} from 'native-base'  
import * as ImagePicker from 'expo-image-picker';
import {Keyaut} from '../Keyaut'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseConfig } from './firebaseConfig.js';
import { FontAwesome5 } from '@expo/vector-icons';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  
var db = firebase.firestore();

export default function WorkEdit (props) {

  const {route} = props
  const { navigation } = props
  const { Ref } = route.params;
  const KeyRef = React.useContext(Keyaut);
  const [loading, setLoading] = useState(false);
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key).collection("HistoryWork");
  const [NameCom, setNameCom] = useState("");
  const [AddressCom, setAddressCom] = useState("");
  const [YearCom, setYearCom] = useState("");
  const [Position, setPosition] = useState("");
  const [Data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();

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
          console.log("GG:",Data);
          setNameCom(Data.CompanyName)
          setAddressCom(Data.CompanyAddress)
          setYearCom(Data.YearsWorked)
          setPosition(Data.WorkingPosition)
      }
  }, [Data != null]);


  const SaveData = ()=>{
    setLoading(true)
    docRef.doc(Ref).set({
      CompanyName: NameCom,
      CompanyAddress: AddressCom,
      YearsWorked: YearCom,
      WorkingPosition: Position,
      Key: Ref
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
              <Subtitle>แก้ไขประวัติการทำงาน</Subtitle>
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
        <Label style={{marginTop:10}}>ชื่อบริษัท/ร้าน</Label>
        <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='ชื่อบริษัท/ร้าน' 
            value = {NameCom}
            onChangeText={(e)=>setNameCom(e)}/>
        </Item>

        <Label style={{marginTop:10}}>ตำแหน่ง</Label>
        <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='ตำแหน่ง' 
            value = {Position}
            onChangeText={(e)=>setPosition(e)}/>
        </Item>

        <Label style={{marginTop:10}}>ปีที่ทำ</Label>
        <Item regular >
            <Input placeholder='ปีที่ทำ' 
            value = {YearCom}
            onChangeText={(e)=>setYearCom(e)}/>
        </Item >

        <Label style={{marginTop:10}}>ที่อยู่บริษัท/ร้าน</Label>
        <Textarea rowSpan={5} bordered placeholder="ที่อยู่บริษัท/ร้าน" style ={{marginBottom: 10,fontSize:18}}
          value = {AddressCom} 
          onChangeText={(g)=>setAddressCom(g)}
        />

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


