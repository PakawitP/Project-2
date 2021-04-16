import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View ,Alert } from 'react-native';
import {Container,Left, Body,Right,Content, Title, Header , Subtitle,Input, Item, Button,Icon,Textarea,Card,CardItem} from 'native-base' 
import {  CheckBox,Image,Modal, TouchableHighlight,ScrollView,Dimensions} from 'react-native';
import {Keyaut} from '../Keyaut'
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
// import * as Notifications from 'expo-notifications';
//import { AntDesign } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import { Fontisto } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

export default function JobAnnou (props) {
  

  const {route} = props
  const { Location } = route.params;


  var docRef = firebase.firestore().collection("announce");
  var docRefUser = firebase.firestore().collection("users")


  const { navigation } = props
  const KeyRef = React.useContext(Keyaut);
  let ID = KeyRef.key
  //const uid = firebase.firestore().collection("users").doc().id
  const [Explain, setExplain] = useState("");

  //อาชีพ
  const [Motorcycle, setMotorcycle] = useState(false);
  const [Electrician, setElectrician] = useState(false);
  const [Electricity, setElectricity] = useState(false);


  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleD, setModalVisibleD] = useState(false);
  const [Use,setUse] = useState([]);
  const [Name, setName] = useState(null); 
  const [APhoto, setAPhoto] = useState([]);
  const [SS, setSS] = useState(false);
  const [Point, setPoint] = useState();
  const [C, setC] = useState(false);
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
    //AArray = APhoto
    console.log("APhoto");
    console.log(APhoto);
  }, [SS]);


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

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const urlPhoto = (url) =>{
    setAPhoto([...APhoto,url])
    setSS(!SS)

  };

  

  const uploadImage = async () => {
    if(image != null){
     // setC(true)
      setLoading(true)
      var metadata = {
        contentType: 'image_Work',
      };
      const response = await fetch(image);
      const blob = await response.blob();
      let name = new Date().getTime() + ".jpg"
      var ref = firebase.storage().ref().child("announce/" + name);
      await ref.put(blob, metadata)
      await ref.getDownloadURL().then((Url) => 
        urlPhoto(Url)
      )
      .then(() => {
        setLoading(false)
        Alert.alert(
          'เพิ่มรูปภาพ',
          'อัพโหลดเสร็จสิ้น',
        )
      })
      .catch((error) => {
        Alert.alert(error);
      });
    }else{
      Alert.alert(
        "การดำเนินการ",
        "เลือกรูปภาพ",)
    
    }
  }


  const Camara = async () =>{
    setModalVisible(!modalVisible);
    pickImageCamara();
    
  }

  const Folder = async () =>{
    setModalVisible(!modalVisible);
    pickImageFoder();
    
  }


  const SaveData = ()=>{
    setLoading(true)
    const uid = docRef.doc().id
    docRef.doc(uid).set({
      announceExplain: Explain,
      announceName: Name,
      Key : uid,
      nameID : ID,
      announcePhoto : APhoto,
      Motorcycle : Motorcycle,
      Electrician : Electrician,
      Electricity : Electricity,
      PCount : 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      announceStatus : false,
      Location:Location
  }, { merge: true }).then(() => {
    setLoading(false)
    navigation.navigate('JobAnnouShow')
    Alert.alert(
      'ประกาศงาน',
      'ประกาศงานสำเร็จ',
  )
  })
  }

  const checks = () =>{
    if( Explain != "" && Name != null  && Location != null){
      if(Motorcycle == true || Electrician == true || Electricity == true){
        SaveData();
        gettoken();
      }else{
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ระบุอาชีพ",)
      }

    }else{
      if(Explain == ""){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ตรวจเช็คคำอธิบายรายละเอียดงาน",)
      }
      else if(Name == null){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ตรวจเช็คชื่องาน",)
      }
      else if(Location == null){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ตรวจเช็คสถานที่ตั้งของงาน",)
      }
      else{
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ตรวจเช็คข้อมูล",)
      }

    }
  }



  const ItemView = (item, key) => {
    if(APhoto.length > 0){
      return (
        // Flat List Item
        <TouchableHighlight View key={key} style ={{margin:5}} onLongPress = {() => {getItem(key)}}>
          <Card>
            <CardItem>
              <Image source={{uri:item}} style={{ width: 350, height: 200 }}/>
            </CardItem>
          </Card>
        </TouchableHighlight>
      );
    }
  };

  const getItem = (key) => {
    setPoint(key)
    setModalVisibleD(true);
  };

  const Delete = () =>{
    APhoto.splice(Point,1)
    
    setSS(!SS)
    console.log(APhoto)
  }
 // console.log(Location.latitude)


  const MapV = () =>{
    if(Location != null){
      return(
            <CardItem >
              <MapView provider={PROVIDER_GOOGLE} style={styles.mapStyle} 
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              zoomTapEnabled={false}
              zoomControlEnabled={false}
              region={{
                latitude: Location.latitude,
                longitude: Location.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
              }}>
              <MapView.Marker   provider={PROVIDER_GOOGLE}
                coordinate={{latitude: Location.latitude,
                      longitude: Location.longitude,
                }}    
              />
              </MapView>
            </CardItem>
            )
    
    }else{
      return(
        <Text></Text>
      );
    }
    
    //;
  }

  
  const gettoken = () =>{
    var cities = [];


    docRefUser.where("Occupations.Technician", "==", true)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(Motorcycle == true && doc.data().Occupations.Motorcycle == true){
            cities.push(doc.data().token);
          }
          else if(Electrician == true && doc.data().Occupations.Electrician == true){
            cities.push(doc.data().token);
          }
          else if(Electricity == true && doc.data().Occupations.Electricity == true){
            cities.push(doc.data().token);
          }
          //cities.push(doc.data().token);
        });
        boadcast(cities)
        cities = []
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }

  const boadcast = (cities) =>{
    cities.map(cities=>sendPushNotification(cities))
  }

  async function sendPushNotification(token) {
    const message = {
      to: token,
      sound: 'default',
      title: 'มีประกาศงานใหม่ในระบบ',
      body: 'ตรวจสอบประกาศงานของคุณ',
      
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  return (
    // <Container style={styles.container}>
    <Container style={styles.container}>
      <Header style ={{backgroundColor: "#CA7004"}}>
        <Left>
          <Button transparent onPress={() => navigation.toggleDrawer()}>
            <Icon name='menu'  />
          </Button>
        </Left>
        <Body>
          <View style={{flex:1,flexDirection:'row'}}>
            <View >
              <Title>ประกาศงาน</Title>
              <Subtitle>เพิ่มประกาศงาน</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
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

        <Item regular style = {{marginLeft:10,marginRight:10,marginTop:20}}>
  
          <Input placeholder='ชื่องาน' 
          
          onChangeText={(e)=>setName(e)}
          value = {Name}
          />
          </Item>


        <Content padder >

          <Textarea rowSpan={5} bordered placeholder="อธิบาย" 
          onChangeText={(g)=>setExplain(g)}/>

        </Content>
      

        <View style = {{marginLeft:15,marginTop:5}}>
          <View style={styles.checkboxInput}>
            <CheckBox
              value={Motorcycle}
              onChange={()=>{
                setElectricity(false)
                setElectrician(false)
                setMotorcycle(!Motorcycle)
              }}
              style={styles.checkbox}
            />
            <Text style={styles.label}>ช่างซ่อมรถจักรยานยนค์</Text>
          </View>


          <View style={styles.checkboxInput}>
            <CheckBox
              value={Electrician}
              onChange={()=>{
                setElectricity(false)
                setElectrician(!Electrician)
                setMotorcycle(false)
              }}
              style={styles.checkbox}
            />
            <Text style={styles.label}>ช่างซ่อมเครื่องใช้ไฟฟ้า</Text>
          </View>

          <View style={styles.checkboxInput}>
            <CheckBox
              value={Electricity}
              onChange={()=>{
                setElectricity(!Electricity)
                setElectrician(false)
                setMotorcycle(false)
              }}
              style={styles.checkbox}
            />
            <Text style={styles.label}>ช่างซ่อมไฟฟ้า</Text>
          </View>
        </View>
        

        <View style = {{alignItems:'center'}}>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              navigation.navigate('CLocation');
            }}>
            <Text style={styles.textStyle}>ที่ตั้งของงาน</Text>
          </TouchableHighlight>
        </View>
        <View>
          <Card>
            {MapV()}
          </Card>
          
        </View>



        <View style = {{alignItems:'center'}}>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              setModalVisible(true);
            }}>
            <Text style={styles.textStyle}>เลือกรูป</Text>
          </TouchableHighlight>
        </View>

        




        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

          { <Image source={{ uri: image }} style={{ width: 350, height: 200}} />}

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
                  style={{ ...styles.openButton,  }}
                  onPress={() => {
                    Camara();
                  }}>
                  <Text style={styles.textStyle}>กล้อง</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={{ ...styles.openButton,  }}
                  onPress={() => {
                    Folder();
                  }}>
                  <Text style={styles.textStyle}>แฟ้มภาพ</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>


          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleD}
            onRequestClose={() => {
              setModalVisibleD(!modalVisibleD);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>ต้องการลบหรือไม่</Text>

                <TouchableHighlight
                  style={{ ...styles.openButton, }}
                  onPress={() => {
                    Delete();
                    setModalVisibleD(!modalVisibleD);
                  }}>
                  <Text style={styles.textStyle}>ใช่</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={{ ...styles.openButton,  }}
                  onPress={() => {
                    setModalVisibleD(!modalVisibleD);
                  }}>
                  <Text style={styles.textStyle}>ยกเลิก</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>



        <View style = {{alignItems:'center',marginTop:20}}>
          <TouchableHighlight
            style={styles.openButton}
            onPress={uploadImage}>
            <Text style={styles.textStyle}>อัพโหลดรูป</Text>
          </TouchableHighlight>
        </View>



        <View style={styles.container}>
          {
          //Loop of JS which is like foreach loop
            APhoto.map(ItemView)
          }
            
        </View>

        <Content padder>



          <Button  full rounded    style ={{ margint:20, backgroundColor:"#CA7004"}}
            onPress ={checks}>
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
    backgroundColor: '#CA7004',
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
  checkboxInput: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    margin: 5,
  },
  mapStyle: {
    width: (Dimensions.get('window').width)-50,
    height: 200,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
