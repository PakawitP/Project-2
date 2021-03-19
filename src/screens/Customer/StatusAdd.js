import React,{ useState, useEffect } from 'react';
import {Container,Left, Body,Right, Title, Header , Subtitle, Button,Icon,Card,CardItem} from 'native-base' 
import {  CheckBox,Image, StyleSheet, Text, View ,Alert ,ScrollView} from 'react-native';
import Swiper from 'react-native-swiper'
import {Keyaut} from '../Keyaut'
import { Fontisto } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

export default function JobAnnou (props) {
  
  

  const { navigation } = props
  const {route} = props
  const { Key } = route.params;

  const KeyRef = React.useContext(Keyaut);
  let ID = KeyRef.key
  var docRef = firebase.firestore().collection("CatchWork").doc(Key);
  var docRefA = firebase.firestore().collection("announce");
  var docRefJ = firebase.firestore().collection("JobStatus")
  var docRefC = firebase.firestore().collection("Comment")
  var docRefU = firebase.firestore().collection("users")

  const [loading, setLoading] = useState(false);
  const [WorkSuccess, setWorkSuccess] = useState(false);
  const [WorkProgress, setWorkProgress] = useState(false);
  const [Data, setData] = useState(null);
  const [DataU, setDataU] = useState(null);






  useEffect(() => {
    docRef.get().then((doc) => {
      if (doc.exists) {
          setData(doc.data())
          console.log(doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).then(()=>{
      docRefU.doc(ID).get().then((doc) => {
      if (doc.exists) {
          //console.log("Document data:", doc.data().Name);
          setDataU(doc.data().Name)
      } 
    })
    })
    

    
 
  }, [Data != null && DataU != null ]);




  const SaveData = ()=>{
    setLoading(true)
    const uid = docRefA.doc().id
    docRefA.doc(uid).set({
      nameID : ID,
      announceExplain: Data.announceExplain,
      announceName: Data.announceName,
      Key : uid,
      announcePhoto :Data.announcePhoto,
      announceStatus : true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }).then(()=>{
      if(WorkSuccess == true){
      Success(uid)
      console.log(uid)
    }
      if(WorkProgress == true){
        Progress(uid)
        console.log(uid)
      }
    })

    
   
  }

  const Success = (Annou) =>{
    
    const uid = docRefC.doc().id
    docRefC.doc(uid).set({
      Workstatus: "งานสำเร็จ",
      CustommerKey:ID,
      TechicianKey:Data.TechicianKey,
      WorkName:Data.announceName,
      KeyAnnou: Annou,
      Quality: 0,
      Punctual: 0,
      Courtesy: 0,
      Scharge: 0,
      Contact:0,
      Totle:0,
      status:false,
      Key: uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true }).then(
      docRefU.doc(Data.TechicianKey).set({
      WorkSuccess: firebase.firestore.FieldValue.increment(1),
    }, { merge: true })).then(()=>{
      docRef.delete().then(()=>{
        setLoading(false)
        Alert.alert(
          "การเพิ่มงาน",
          "งานสำเร็จ"
        );
      })
    })
    .then(()=>{
      navigation.navigate('StatusWork')
    })
  }

  const Progress = (Annou) =>{
    
    const uid = docRefJ.doc().id
    docRefJ.doc(uid).set({
      CustommerKey : ID,
      TechicianKey : Data.TechicianKey,
      Custommerpetition: null,
      Techicianpetition: null,
      Key:uid,
      KeyAnnou: Annou,
      WorkName: Data.announceName,
      ConfirmKey : null,
      status : "กำลังดำเนินการ",
      NameCustommer : DataU,
      ConfirmKey : null ,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })
    .then(()=>{
      docRef.delete().then(()=>{
        setLoading(false)
        Alert.alert(
          "การเพิ่มงาน",
          "งานกำลังดำเนินการ"
        );
      })
    })
    .then(()=>{
      
      navigation.navigate('StatusWork')
    }) 
  }

  const checks = () =>{
    if(WorkSuccess == true || WorkProgress == true){

    }else{
      Alert.alert(
        "การดำเนินการ",
        "เลือกประเภทของงาน",)
    }
    
  }

const ItemView = (item, key) => {
  return (
    // Flat List Item
    
    < View key={key} style ={{margin:5 ,alignItems:'center'}} >
        <View >
          <Image source={{uri:item}} style={{ width: 370, height: 220 }}/>
        </View>
      
    </View>
  );
};
  
if(Data != null && DataU != null){
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
              <Title>ข้อมูลงาน</Title>
              <Subtitle>ยืนยันข้อมูลงาน</Subtitle>
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

        <View>
          <Card>
            <CardItem>
              <Swiper style={styles.swiper} height={250} auto>
                {
                //Loop of JS which is like foreach loop
                  Data.announcePhoto.map(ItemView)
                }
              </Swiper>
            </CardItem>
            <CardItem>
              <Text>
                {Data.announceName}
              </Text>
            </CardItem>
            <CardItem>
              <Text>
                {Data.announceExplain}
              </Text>
            </CardItem>

          </Card>

        </View>


        <View style = {{marginLeft:15,marginTop:20,marginBottom:40}}>
          <View style={styles.checkboxInput}>
            <CheckBox
              value={WorkProgress}
              onChange={()=>{
                setWorkSuccess(false)
                setWorkProgress(true)
              }}
              style={styles.checkbox}
            />
            <Text style={styles.label}>กำลังดำเนินการ</Text>
          </View>


          <View style={styles.checkboxInput}>
            <CheckBox
              value={WorkSuccess}
              onChange={()=>{
                setWorkSuccess(true)
                setWorkProgress(false)
              }}
              style={styles.checkbox}
            />
            <Text style={styles.label}>งานเสร็จสิ้น</Text>
          </View>
        </View>


          <Button  full rounded    style ={{ margint:20, backgroundColor:"#CA7004"}}
            onPress ={SaveData}>
            <Text style={{color:'#ffffff'}}>       บันทึก       </Text>
          </Button>
          <Spinner
            visible={loading}
            textStyle={styles.spinnerTextStyle}
          />
      </ScrollView>
    </Container>
  );
}else
  return(
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
              <Title>ข้อมูลงาน</Title>
              <Subtitle>ยืนยันข้อมูลงาน</Subtitle>
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
    backgroundColor: '#FE9D09',
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
  spinnerTextStyle: {
    color: '#FFF',
  },
});
