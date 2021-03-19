import React,{ useState, useEffect } from 'react';
import { StyleSheet, View ,Alert, Image,Modal, TouchableHighlight,} from 'react-native';
import {Container,Left, Body,Right,Content, Title, Header,  Subtitle,Input, Item, Button,Icon,Text} from 'native-base' 
import * as ImagePicker from 'expo-image-picker';
import {Keyaut} from '../Keyaut'
import * as firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  


export default function Education (props) {

  const KeyRef = React.useContext(Keyaut);
  
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [URLPhoto,setURLPhoto] = useState(null); 
  const [LevelE,setLevelE] = useState("")
  const [NameS,setNameS] = useState("")
  const [Gpa,setGpa] = useState("")
  const [YearC,setYearC] = useState("")
  const [loading, setLoading] = useState(false);
  const { navigation } = props
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key).collection("Education");
  
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
    setLoading(false)
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
    var uid = docRef.doc().id
    docRef.doc(uid).set({
      EducationLevel: Level,
      School: School,
      GPA: Gpa,
      Year: Year,
      Photo: UrlPhoto,
      Key: uid
    },{ merge: true })
  }

  const Check = () =>{
    if(image != null && LevelE != "" && NameS != "" && Gpa != "" && YearC != ""){
      uploadImage()
    }else{
      Alert.alert(
        "การดำเนินการ",
        "ข้อมูลไม่ครบถ้วน",)
    }
    
  }


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
                <Subtitle>เพิ่มประวัติศึกษา</Subtitle>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
              </View>
            </View>
          </Body>
          <Right>
            {/* <Button transparent onPress={() => navigation.navigate('Education')}>
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button> */}
          </Right>
        </Header>

        <Content style = {styles.boxinput}>
          <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='ระดับการศึกษา' 
              onChangeText={(p)=>setLevelE(p)}
            />
          </Item>
          <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='สถานศึกษา' 
              onChangeText={(p)=>setNameS(p)}
            />
            </Item>
          <Item regular style ={{marginBottom: 5}}>
            <Input placeholder='เกรดเฉลี่ย' 
              onChangeText={(p)=>setGpa(p)}
          />
            </Item>
          <Item regular style ={{marginBottom: 10}}>
            <Input placeholder='ปีที่จบ' 
              onChangeText={(p)=>setYearC(p)}
            />
          </Item>


          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>ถ่ายรูป</Text>
      
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
    
    
            <Spinner
              visible={loading}
              textStyle={styles.spinnerTextStyle}
            />
    
         
            { <Image source={{ uri: image }} style={{ width: 300, height: 200}} />}
            <Button full rounded  style ={{marginTop: 10, margin:20}}
            // onPress ={()=>SaveData(Name,Contact,Address)}>
              onPress ={Check}>
              <Text>บันทึก</Text>
            </Button>
      
          </View>

        </Content>

      </Container>
  );
      
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyleT: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16
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

