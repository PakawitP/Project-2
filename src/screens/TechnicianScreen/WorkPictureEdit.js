import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View ,Alert } from 'react-native';
import {Container,Left, Body,Right,Content, Title, Header , Button,Icon,Textarea} from 'native-base' 
import {  Image,Modal, TouchableHighlight,ScrollView} from 'react-native';
//import { AntDesign } from '@expo/vector-icons'; 
import {Keyaut} from '../Keyaut'
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import { FontAwesome5 } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function WorkPictureEdit (props) {
  const KeyRef = React.useContext(Keyaut);
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key).collection("WorkingPicture");
  const {route} = props
  const { navigation } = props
  const { Ref } = route.params;
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [PhotoExplain,setPhotoExplain] = useState(""); 
  const [Data, setData] = useState(null);
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
          setImage(Data.Photo)
          setPhotoExplain(Data.PhotoExplain)

      }
  }, [Data != null]);


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

  const Check = () =>{
    if(image == null){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบรูปภาพ",)
    }
    else if(Explain == ""){
      Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "ตรวจสอบการอธิบายรูปภาพ",)
    }
    else{
      uploadImage()
    }
  }


  const uploadImage = async () => {
    setLoading(true)
    var metadata = {
      contentType: 'image_Work',
    };
    const response = await fetch(image);
    const blob = await response.blob();
    let name = new Date().getTime() + ".jpg"
    var ref = firebase.storage().ref().child("Work/" + name);
    await ref.put(blob, metadata)
    await ref.getDownloadURL().then((Url) => 
    SaveData(Url)
    )
    .then(() => {
      setLoading(false)
      navigation.navigate('WorkPictureShow')
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


  const SaveData = (UrlPhoto)=>{
    docRef.doc(Ref).set({
      PhotoExplain: PhotoExplain,
      Photo: UrlPhoto,
      Key : Ref
  }, { merge: true })
  }

  return (
    // <Container style={styles.container}>
    <Container style={styles.container}>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.toggleDrawer()}>
            <Icon name='menu'  />
          </Button>
        </Left>
        <Body>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{marginTop:12}}>
              <Title>รูปภาพการทำงาน</Title>
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        { <Image source={{ uri: image }} style={{ width: 350, height: 300}} />}

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
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={() => {
                  Camara();
                }}>
                <Text style={styles.textStyle}>กล้อง</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                onPress={() => {
                  Folder();
                }}>
                <Text style={styles.textStyle}>แฟ้มภาพ</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>


      <View style = {{alignItems:'center',marginTop:20}}>
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.textStyle}>เลือกรูป</Text>
        </TouchableHighlight>
      </View>
      


      <Content padder>

        <Textarea rowSpan={5} bordered placeholder="อธิบาย" 
        value = {PhotoExplain}
        onChangeText={(g)=>setPhotoExplain(g)}/>

        <Button  full rounded    style ={{marginTop: 10, margint:20,marginTop:50}}
          onPress ={Check}>
          <Text style={{color:'#ffffff'}}>       บันทึก       </Text>
        </Button>
      </Content>
      <Spinner
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
      </ScrollView>
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
