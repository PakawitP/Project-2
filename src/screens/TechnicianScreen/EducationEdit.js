import React,{ useState, useEffect } from 'react';
import { StyleSheet, View ,Alert, Image,Modal, TouchableHighlight,} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import {Container,Left, Body,Right,Content, Title, Header,  Subtitle,Input, Item, Button, Label,Icon,Text} from 'native-base' 
import * as ImagePicker from 'expo-image-picker';
import {Keyaut} from '../Keyaut'
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import Spinner from 'react-native-loading-spinner-overlay';
import { FontAwesome5 } from '@expo/vector-icons';
import 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  


export default function History (props) {
  const KeyRef = React.useContext(Keyaut);
  const {route} = props
  const { navigation } = props
  const { Ref } = route.params;
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key).collection("Education");
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [URLPhoto,setURLPhoto] = useState(null); 
  const [loading, setLoading] = useState(false);

  const [LevelE,setLevelE] = useState("")
  const [NameS,setNameS] = useState("")
  const [Gpa,setGpa] = useState("")
  const [YearC,setYearC] = useState("")
  const [Data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    });



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
        setLevelE(Data.EducationLevel)
        setNameS(Data.School)
        setGpa(Data.GPA)
        setYearC(Data.Year)
        setImage(Data.Photo)
    }

  }, [Data != null]);

  console.log(Ref);


  const pickImageCamara = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
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
      aspect: [4,3],
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
    SaveData(LevelE,NameS,Gpa,YearC,url)
  };

  const uploadImage = async () => {
    setLoading(true)
    var metadata = {
      contentType: 'image_Education',
    };
    const response = await fetch(image);
    const blob = await response.blob();
    let name = new Date().getTime() + ".jpg"
    var ref = firebase.storage().ref().child("Education/" + name);
    await ref.put(blob, metadata)
    await ref.getDownloadURL().then((Url) => 
    urlPhoto(Url)
    )
    .then(() => {
      setLoading(false)
      navigation.navigate('EducationShow')
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


  const SaveData = (Level,School,Gpa,Year,UrlPhoto)=>{
    docRef.doc(Ref).set({
      EducationLevel: Level,
      School: School,
      GPA: Gpa,
      Year: Year,
      Photo: UrlPhoto,
      Key: Ref
    },{ merge: true })
  }

  const Check = () =>{
    if(image == null){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบรูปภาพ",)
    }
    else if(LevelE == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบระดับการศึกษา",)
    }
    else if(NameS == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบสถานศึกษา",)
    }
    else if(Gpa == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบเกรดเฉลี่ย",)
    }
    else if(YearC == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบปีการศึกษาที่จบ",)
    }else{
      uploadImage()
    }
    
  }

 if(Data != null){
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
              <View >
                <Title>ประวัติ</Title>
                <Subtitle>แก้ไขประวัติศึกษา</Subtitle>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
              </View>
            </View>
            
          </Body>
          <Right>
            <Button transparent onPress={() => navigation.navigate('Education')}>
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button>
          </Right>
        </Header>

        <Content style = {styles.boxinput}>

          <Label style={{marginTop:10}}>ระดับการศึกษา</Label>
          <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='ระดับการศึกษา' 
              value = {LevelE}
              onChangeText={(p)=>setLevelE(p)}
            />
          </Item>

          <Label style={{marginTop:10}}>สถานศึกษา</Label>
          <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='สถานศึกษา' 
              value = {NameS}
              onChangeText={(p)=>setNameS(p)}
            />
          </Item>

          <Label style={{marginTop:10}}>เกรดเฉลี่ย</Label>
          <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='เกรดเฉลี่ย' 
              value = {Gpa}
              onChangeText={(p)=>setGpa(p)}
            />
          </Item>

          <Label style={{marginTop:10}}>ปีที่จบ</Label>
          <Item regular style ={{marginBottom: 10}}>
            <Input placeholder='ปีที่จบ' 
              value = {YearC}
              onChangeText={(p)=>setYearC(p)}
            />
          </Item>


          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible)
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>ถ่ายรูป</Text>
      
                  <TouchableHighlight
                    style={{ ...styles.openButton }}
                    onPress={() => {
                      Camara();
                    }}>
                    <Text style={styles.textStyle}>กล้อง</Text>
                  </TouchableHighlight>
      
                  <TouchableHighlight
                    style={{ ...styles.openButton }}
                    onPress={() => {
                      Folder();
                    }}>
                    <Text style={styles.textStyle}>แฟ้มภาพ</Text>
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
    
    
    
    
         
            { <Image source={{ uri: image }} style={{ width: 300, height: 200}} />}
            <Button full rounded  style ={{marginTop: 10, margin:20}}
            // onPress ={()=>SaveData(Name,Contact,Address)}>
              onPress ={Check}>
              <Text>บันทึก</Text>
            </Button>
      
          </View>

        </Content>
        <Spinner
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
      </Container>
  );
}else{
    return(
        <Text></Text>
    )
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
    padding: 35,
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

