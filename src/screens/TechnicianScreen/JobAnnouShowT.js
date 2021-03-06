import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Image,StyleSheet, Text, View,Dimensions ,Alert, Modal,ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,  Button,Icon,Textarea} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import Swiper from 'react-native-swiper'
import {Keyaut} from '../Keyaut'
import { FontAwesome5 } from '@expo/vector-icons';  
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
//import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  const KeyRef = React.useContext(Keyaut);
  const {route} = props
  const { navigation } = props
  const { Ref,Name,Per } = route.params;
  let Key = KeyRef.key
  const [refreshing, setRefreshing] = useState(false);
  const [Dis,setDis] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  //const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const increment = firebase.firestore.FieldValue.increment(1);


  var docRef = firebase.firestore().collection("announce").doc(Ref)
  var docRefPerson = firebase.firestore().collection("users").doc(KeyRef.key).collection("job")
  var docRefU = firebase.firestore().collection("users")
  var docRefT = firebase.firestore().collection("announce").doc(Ref).collection("Applicants")



  useEffect(() => {
    getData();
  }, [dataSource != null]);

  const getData = () =>{
    docRef.get().then(function(doc) {
      if (doc.exists) {
          setDataSource(doc.data())
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }

  
  useEffect(() => {
    let checkS = false;
    docRefT.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.data().Key == KeyRef.key){
            checkS = true
          }
            
        });
        if(checkS == true){
          Alert.alert(
            "???????????????????????????",
            "???????????????????????????????????????????????????????????????",
            [
              { text: "????????????", onPress: () => {
                navigation.navigate('JobAnnouShow')
              } }
            ],
            { cancelable: false }
          );
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }, []);


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



const gettoken = () =>{
  docRefU.doc(dataSource.nameID).get().then(function(doc) {
    if (doc.exists) {
        sendPushNotificationT(doc.data().token,doc.data().Name)
    } else {
        console.log("No such document!");
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}

async function sendPushNotificationT(token,name) {
  const message = {
    to: token,
    sound: 'default',
    title: '??????????????????????????????????????? '+dataSource.announceName,
    body: ' ????????????????????????????????????????????????',
    
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


const SaveData = ()=>{
  setLoading(true)
  gettoken()
  const uid = docRef.collection("Applicants").doc().id
  docRef.collection("Applicants").doc(uid).set({
    Name: Per,
    Key: Key,
    explain : Dis
}, { merge: true }).then(()=>{
  docRef.set({
    PCount : increment
}, { merge: true })
}).then(()=>{
  const id = docRefPerson.doc().id
  docRefPerson.doc(id).set({
    keyjob:Ref,
    Namejob:Name,
    Key:id,
    ApKey:uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
}, { merge: true })
}).then(() => {
  // navigation.navigate('WorkPictureShow')
  // console.log("111"+Array)
  setLoading(false)
  Alert.alert(
    '??????????????????????????????',
    '?????????????????????????????????',
    [
      {
        text: '????????????',
        onPress: () => navigation.navigate('JobAnnouShow')
      },
    ]
  )
})
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
    return ("???????????????????????????????????????????????????????????????")
  }
  else if(dataSource.Electrician){
    return ("?????????????????????????????????????????????????????????????????????")
  }
  else if(dataSource.Electricity){
    return ("???????????????????????????????????????????????????????????????")
  }else{
    return ("???????????????????????????????????????")
  }
}



if(dataSource != null){
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
                <Title>???????????????????????????</Title>
                <Subtitle>{Name}</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
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
            <Text style={{fontSize:16,margin:10,alignSelf:'center'}}>
              ??????????????????????????? <FontAwesome name="photo" size={24} color="#3F51B5" />
            </Text>
            {  photocheck()}
          </View>

          <View>
            <Text style={{fontSize:16,alignSelf:'center'}}>
              ??????????????????????????? <FontAwesome name="map" size={24} color="#3F51B5" />
            </Text>
                <Card>
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
                    <MapView.Marker ????provider={PROVIDER_GOOGLE}
                      coordinate={{latitude: dataSource.Location.latitude,
                            longitude: dataSource.Location.longitude,
                      }}????????
                    />
                    </MapView>
                  </CardItem>
                  {/* <CardItem>

                  </CardItem> */}
                </Card>
              </View>
          <View>            
            <Text style={{fontSize:16,alignSelf:'center',marginTop:20}}>
              ??????????????????????????? <FontAwesome5 name="network-wired" size={24} color="#3F51B5" />
            </Text>        
            <Card>
              <CardItem>
                <Left>
                  <Text >
                    ????????????????????? {dataSource.announceName}
                  </Text>
                </Left>
                <Right >
                  <Text style={{alignSelf:'center'}}>
                    ?????????????????????????????????
                  </Text>
                  <Text style={{alignSelf:'center'}}>
                    ????????????{"\t"}{dataSource.createdAt.toDate().toLocaleTimeString()}{"\n"}
                    ??????????????????{"\t"}{dataSource.createdAt.toDate().toLocaleDateString()}
                  </Text>
                </Right>
              </CardItem>
      
              <CardItem>
                <Text >
                  ???????????????????????????/??????????????????{"\t"}{dataSource.announceExplain} 
                </Text>
              </CardItem>

              <CardItem>
                <Text>
                  ?????????????????????{"\t"}{T()}
                </Text>
              </CardItem>
              
              <CardItem>
                
                  <Textarea rowSpan={4} style={{flex:1}} bordered placeholder="???????????????/??????????????????" 
                  onChangeText={(g)=>setDis(g)}/>
              
              </CardItem>
            </Card>
          </View>
          <View style = {{alignItems:'center',marginTop:15}}>
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              setModalVisible(true);
            }}
            >
            <Text style={styles.textStyle}>?????????????????????????????????</Text>
          </TouchableHighlight>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>?????????????????????????????????</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setModalVisible(!modalVisible)
                  SaveData()
                }}>
                <Text style={styles.textStyle}>????????????????????????????????????</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton,}}
                onPress={() => {
                  setModalVisible(!modalVisible)
                }}>
                <Text style={styles.textStyle}>??????????????????</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        

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
    <Header>
      <Left>
        <Button transparent onPress={() => navigation.toggleDrawer()}>
          <Icon name='menu'  />
        </Button>
      </Left>
      <Body>
        <Title>???????????????????????????</Title>
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
    backgroundColor: '#3F51B5',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom:10,
    width: 130
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

