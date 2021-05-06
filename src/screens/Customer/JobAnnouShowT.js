import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Image,StyleSheet, Text, View ,Dimensions, Modal,ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,  Button,Icon} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
//import { Entypo } from '@expo/vector-icons';
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import Swiper from 'react-native-swiper'
import { Fontisto } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import * as firebase from 'firebase';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseConfig } from './firebaseConfig.js';
import Spinner from 'react-native-loading-spinner-overlay';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};


export default function JobAnnouShowT (props) {

  const {route} = props
  const { navigation } = props
  const { Ref,Name,User } = route.params;
  const KeyRef = React.useContext(Keyaut);
  const [refreshing, setRefreshing] = useState(false);
  const [ShowName,setShowName] = useState()
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [Point, setPoint] = useState(null);
  const [Applicants,setApplicants] = useState([])
  const [loading, setLoading] = useState(false);
  var docRef = firebase.firestore().collection("announce").doc(Ref)
  var docRefT = firebase.firestore().collection("announce").doc(Ref).collection("Applicants")
  var docRefJob = firebase.firestore().collection("JobStatus")
  var docRefUser = firebase.firestore().collection("users")


  // console.log(Ref)
  // console.log(Name)
  useEffect(() => {
    getData();
    Ap();
  }, [dataSource != null ,Applicants != null]);

  const getData = () =>{
    docRef.get().then(function(doc) {
      if (doc.exists) {
          setDataSource(doc.data())
          //console.log(doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }

  const Ap = () =>{
    let A = [];
    docRefT.onSnapshot(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        A.push(doc.data());
        // setApplicants([...Applicants,doc.data()])
      });
      console.log(A)
      setApplicants(A)
      A = [];
  });
  }



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(300).then(() => setRefreshing(false));
  }, []);


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

const ApplicantsView = (item, key) => {
  return (
    // Flat List Item
    
    <TouchableHighlight View key={key} style ={{margin:5}} 
     onPress = {() => getItem(item)}
    >
      <Card>
        <CardItem>
          <Text style={styles.itemStyle}>
            {item.Name}
            {checkexp(item.explain)}
          </Text>
        </CardItem>
      </Card>
    </TouchableHighlight>
    

  );
};

const checkexp = (e) =>{
  if(e != "" && e != null){
    return "\n"+e
  }
}




const getItem = (item) => {
  setPoint(item.Key)
  setShowName(item.Name)
  setModalVisible(true)
};

const Doc = () =>{    
  setLoading(true)
  const uid = docRefJob.doc().id
  docRefJob.doc(uid).set({
    CustommerKey : KeyRef.key,
    TechicianKey : Point,
    Custommerpetition: null,
    Techicianpetition: null,
    Key:uid,
    KeyAnnou: Ref,
    WorkName: Name,
    NameCustommer:User,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    status : "รอช่างยืนยัน",
    ConfirmKey:null

}, { merge: true }).then(function() {
  setLoading(false)
  navigation.navigate('JobAnnouShow')
  })
} 




const Showdoc = () => {
  //navigation.navigate('WorkPictureEdit',{Ref : Point})
  navigation.navigate('MyTabs',{ Tkey: Point })
}


const gettoken = () =>{
  docRefUser.doc(Point).get().then(function(doc) {
    if (doc.exists) {
        sendPushNotification(doc.data().token)
    } else {
        console.log("No such document!");
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}

async function sendPushNotification(token) {
  const message = {
    to: token,
    sound: 'default',
    title: 'ตรวจสอบสถานะงานของคุณ',
    body: 'งาน '+dataSource.announceName+' ที่สมัครมีการตอบกลับ',
    
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

const photocheck = () =>{
  if(dataSource.announcePhoto.length > 0){
    return(
      <Swiper style={styles.swiper} height={250} auto>
        {
          dataSource.announcePhoto.map(ItemView)
        }
      </Swiper>
    )
  }
}

const T = () =>{
  if(dataSource.Motorcycle){
    return ("ช่างซ่อมรถจักรยานยนต์")
  }
  else if(dataSource.Electrician){
    return ("ช่างซ่อมเครื่องใช้ไฟฟ้า")
  }
  else if(dataSource.Electricity){
    return ("ช่างซ่อมรถจักรยานยนต์")
  }else{
    return ("ช่างซ่อมไฟฟ้า")
  }
}

const app = () =>{
  if(Applicants.length > 0){
    return(
      <Card>
      <Body style={{flexDirection:'row',marginTop:10}}>
        <MaterialIcons name="person" size={24} color="#CA7004" />
        <Text style={{fontSize:16}}>
          {"\t"}ผู้สมัคร
        </Text>
      </Body>
          {Applicants.map(ApplicantsView)} 
      </Card>
    )
  }
}

if(dataSource != null){
  return (
    <Container>
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
              <Subtitle>{Name}</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
            </View>
          </View>
          
        </Body>
        <Right>
          {/* <Button transparent onPress={() => navigation.navigate('WorkPicture')}>
            < AntDesign name="edit" size={24} color="#FFFFFF" />
          </Button> */}
        </Right>
      </Header>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.container}>
            {/* <Swiper style={styles.swiper} height={250} auto>
              {

                dataSource.announcePhoto.map(ItemView)
              }
            </Swiper> */}
            {  photocheck()}
          </View>

          <View>
          
            <Card>
              <Body style={{flexDirection:'row',marginTop:10}}>
                <MaterialIcons name="gps-fixed" size={24} color="#CA7004" />
                <Text style={{fontSize:16}}>
                  {"\t"}แผนที่
                </Text>
              </Body>
              <CardItem >
                <MapView provider={PROVIDER_GOOGLE} style={styles.mapStyle} 
                zoomEnabled={false}
                scrollEnabled={false}
                rotateEnabled={false}
                zoomTapEnabled={false}
                zoomControlEnabled={false}
                region={{
                  latitude: dataSource.Location.latitude,
                  longitude: dataSource.Location.longitude,
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.008,
                }}>
                <MapView.Marker  provider={PROVIDER_GOOGLE} 
                  coordinate={{latitude: dataSource.Location.latitude,
                        longitude: dataSource.Location.longitude,
                  }}    
                />
                </MapView>
              </CardItem>
            </Card>
          </View>

          <View style ={{margin:5}}>
            <Card>
              <Body style={{flexDirection:'row',marginTop:10}}>
                <MaterialIcons name="style" size={24} color="#CA7004" />
                <Text style={{fontSize:16}}>
                  {"\t"}อธิบาย/รายละเอียดงาน
                </Text>
              </Body>
              <CardItem>
                <View>
                  <Text >
                    ชื่องาน {dataSource.announceName}
                  </Text>
                </View>
              </CardItem>
      
              <CardItem>
                <Text >
                รายละเอียด {dataSource.announceExplain} 
                </Text>
              </CardItem>

              <CardItem>
                <Text > 
                  ต้องการว่าจ้าง{"\t"}{T()}
                </Text>
              </CardItem>
              
            </Card>

            {app()}

            
          </View>
          <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>ตัวเลือก</Text>

                <TouchableHighlight
                  style={{ ...styles.openButton,  }}
                  onPress={() => {
                    Showdoc();
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>ดูประวัติ</Text>
                </TouchableHighlight>

                
                <TouchableHighlight
                  style={{ ...styles.openButton, }}
                  onPress={() => {
                    setModalVisibleCD(true);
                    //DeleteDoc();
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>จ้างงาน</Text>
                </TouchableHighlight>


                <TouchableHighlight
                  style={{ ...styles.openButton, }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>ยกเลิก</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
              

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleCD}
            onRequestClose={() => {
              setModalVisibleCD(!modalVisibleCD);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>ต้องการจ้างงาน {ShowName}</Text>
                <TouchableHighlight
                  style={{ ...styles.openButton}}
                  onPress={() => {
                    Doc();
                    gettoken();
                    setModalVisibleCD(!modalVisibleCD);
                  }}>
                  <Text style={styles.textStyle}>ตกลง</Text>
                </TouchableHighlight>


                <TouchableHighlight
                  style={{ ...styles.openButton }}
                  onPress={() => {
                    setModalVisibleCD(!modalVisibleCD);
                  }}>
                  <Text style={styles.textStyle}>ยกเลิก</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>


        </View>
        <Spinner
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
        </ScrollView>
      </SafeAreaView>
    </Container>
    
  );
 }else{
  return (



  <Container>
    <Header style ={{backgroundColor: "#CA7004"}}>
      <Left>
        <Button transparent onPress={() => navigation.toggleDrawer()}>
          <Icon name='menu'  />
        </Button>
      </Left>
      <Body>
        <Title></Title>
      </Body>
      <Right>
        <Button transparent onPress={() => navigation.navigate('WorkPicture')}>
          < AntDesign name="edit" size={24} color="#FFFFFF" />
        </Button>
      </Right>
    </Header>

  </Container>

  
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
  itemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
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
    backgroundColor: '#FE9D09',
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
  swiper: {
    height: 200
  },
  mapStyle: {
    width: (Dimensions.get('window').width)-50,
    height: 200,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

