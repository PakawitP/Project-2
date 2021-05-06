import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View ,Alert } from 'react-native';
import {Container,Left, Body,Right,Label, Title, Header , Subtitle,Input, Item, Button,Icon,Textarea} from 'native-base' 
import {  Image,Modal, TouchableHighlight,ScrollView} from 'react-native';
import {Keyaut} from '../Keyaut'
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import { FontAwesome5 } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  
//var db = firebase.firestore();

export default function History (props) {
  const { navigation } = props
  const KeyRef = React.useContext(Keyaut);
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key);
  const [loading, setLoading] = useState(false);
  const [Name, setName] = useState("");
  const [Contact, setContact] = useState("");
  const [Address, setAddress] = useState("");
  const [Addressstore, setAddressstore] = useState("");



  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [URLPhoto,setURLPhoto] = useState(null); 

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

    var unsubscribe = docRef
    .onSnapshot(function(doc) {
        //console.log("Current data: ", doc.data().Address);
        setData(doc.data());
    });

    console.log(Data)
    if(Data != null){
      setName(Data.Name);
      setContact(Data.Contact);
      setAddress(Data.Address);
      setAddressstore(Data.Addressstore);
      setImage(Data.Photo);
      unsubscribe();
    }

   
  }, [Data != null]);

  

  const pickImageCamara = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };




  const pickImageFoder = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3,4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const urlPhoto = async (url) =>{

    setURLPhoto(url)
    console.log(URLPhoto)
    SaveData(Name,Contact,Address,url)
    setLoading(false)
  };

  const uploadImage = async () => {
    setLoading(true)
    var metadata = {
      contentType: 'image_profile',
    };
    const response = await fetch(image);
    const blob = await response.blob();
    let name = new Date().getTime() + ".jpg"
    var ref = firebase.storage().ref().child("profile/" + name);
    await ref.put(blob, metadata)
    await ref.getDownloadURL().then((Url) => 
    urlPhoto(Url)
    )
    .then(() => {
      navigation.navigate('HistoryShow')
      // Alert.alert("Success");
    })
    .catch((error) => {
      Alert.alert(error);
    });
  }


  const Camara = async () =>{
    setModalVisible(!modalVisible);
    pickImageCamara();
    
  }

  const Folder = async () =>{
    setModalVisible(!modalVisible);
    pickImageFoder();
    
  }



 

  const checks = () =>{
    if(Name == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบชื่อ",)
    }
    else if(Address == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบที่อยู่",)
    }
    else if(Contact == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบช่องทางการติดต่อ",)
    }
    else if(Addressstore == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบที่อยู่ร้าน",)
    }
    else if(image == null){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบรูปภาพ",)
    }
    else{
      uploadImage()
    }
  }



  const SaveData = (name,contact,address,UrlPhoto)=>{
    docRef.set({
      Name: name,
      Contact: contact,
      Address: address,
      Addressstore: Addressstore,
      Photo: UrlPhoto,
  }, { merge: true })
  }
 if(Data != null){
  return (

    <Container style={styles.container}>
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
            <Subtitle>แก้ไขประวัติส่วนตัว</Subtitle>
          </View>
          <View style={{marginLeft:10,marginTop:7}}>
            <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
          </View>
        </View>

        </Body>
        <Right>
          {/* <Button transparent>
            < AntDesign name="edit" size={24} color="#FFFFFF" />
          </Button> */}
        </Right>
      </Header>
    <ScrollView>
      <View style={{alignItems: 'center'}}>

      { <Image source={{ uri: image }} style={{ width: 200, height: 250 ,margin: 15,borderWidth: 1,borderColor: '#3F51B5'}} />}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>เลือกรูป</Text>

              <TouchableHighlight
                style={{ ...styles.openButton}}
                onPress={() => {
                  Camara();
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>กล้อง</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton}}
                onPress={() => {
                  Folder();
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>แฟ้มภาพ</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>ยกเลิก</Text>
              </TouchableHighlight>

            </View>
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.textStyle}>เลือกรูป</Text>
        </TouchableHighlight>

      </View>
        <View style = {styles.boxinput}>
          {/* ชื่อ */}
          <Label style={{marginTop:10}}>ชื่อ-สกุล</Label>
          <Item regular>
          
              <Input placeholder='ชื่อ - สกุล' style={{fontSize:14}}
              
              onChangeText={(e)=>setName(e)}
              value = {Name}/>
          </Item>

          <Label style={{marginTop:20}}>ช่องทางการติดต่อ</Label>
          <Textarea rowSpan={4} bordered placeholder="ช่องทางการติดต่อ"  style={{fontSize:14}}
          value = {Contact}
          onChangeText={(f)=>setContact(f)}/>

          <Label style={{marginTop:20}}>ที่อยู่</Label>
          <Textarea rowSpan={4} bordered placeholder="ที่อยู่"  style={{fontSize:14}}
          value = {Address}
          onChangeText={(g)=>setAddress(g)}/>

          <Label style={{marginTop:20}}>ที่อยู่ร้าน</Label>
          <Textarea rowSpan={4} bordered placeholder="ที่อยู่ร้าน"  style={{fontSize:14}}
          value = {Addressstore}
          onChangeText={(g)=>setAddressstore(g)}/>


          <View style={{alignSelf:'center'}}>
            <Button rounded style = {{flex:1,width : 120,marginTop: 10 }}
              onPress ={()=> navigation.navigate('Location')}>
                <Text style = {{color: '#FFFFFF',textAlign:'center'}}> ตำแหน่งร้าน</Text>
            </Button>
          </View>    
  
          <Button  full rounded    style ={{marginTop: 10, margin:20}}
            onPress ={checks}>
            <Text style = {{color: '#FFFFFF',textAlign:'center'}}> บันทึก </Text>
          </Button>
        </View>

        <Spinner
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
      </ScrollView>
    </Container>
  );
   }   else {
     return(<Text></Text>);
   }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#3F51B5',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom:10,
    width: 100
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
  textStyleT: {
    color: 'white',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 14
  },
  boxinput:{
    marginRight: 20,
    marginTop:15,
    marginLeft:20,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});


