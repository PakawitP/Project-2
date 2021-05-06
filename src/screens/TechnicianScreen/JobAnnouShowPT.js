import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Image,StyleSheet, Text, View,Dimensions ,Alert, ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,  Button,Icon,Textarea} from 'native-base' 
//import { AntDesign } from '@expo/vector-icons'; 
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';;
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
  const { Ref,Name,Key,APKey } = route.params;
  //let Key = KeyRef.key
  console.log(APKey)
  const [refreshing, setRefreshing] = useState(false);
  const [Dis,setDis] = useState("")
  //const [modalVisible, setModalVisible] = useState(false);
  //const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(false);
  var docRef = firebase.firestore().collection("announce").doc(Ref)
  var docRefJ = firebase.firestore().collection("announce").doc(Ref).collection("Applicants").doc(APKey)
  var docRefPerson = firebase.firestore().collection("users").doc(KeyRef.key).collection("job")
  useEffect(() => {
    getData();
  }, []);

  const getData = () =>{
    let i = true;
    docRef.get().then(function(doc) {
      if (doc.exists) {
          setDataSource(doc.data())
          if(doc.data().announceStatus == true && i == true){
            Alert.alert(
              "ประกาศงาน",
              "งานนี้ถูกว่าจ้างไปเเล้ว",
              [
                { text: "ตกลง", onPress: () => {Del()} }
              ],
              { cancelable: false })
          }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }

      i == false;
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    docRefJ.get().then(function(doc) {
      if (doc.exists) {
          setDis(doc.data().explain)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  
  }

  const Del = () =>{
    docRefPerson.doc(Key).delete();
    navigation.navigate('JobAnnouP')
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


const Edit = () =>{
  docRefJ.set({
    explain : Dis
  }, { merge: true }).then(()=>{
    Alert.alert(
      "การดำเนินการ",
      "บันทึกการแก้ไขเสร็จสิ้น",)
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
                <Title>ประกาศงาน</Title>
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
              รูปภาพงาน <FontAwesome name="photo" size={24} color="#3F51B5" />
            </Text>
            {  photocheck()}
          </View>

          <View>
            <Text style={{fontSize:16,alignSelf:'center'}}>
              แผนที่งาน <FontAwesome name="map" size={24} color="#3F51B5" />
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
                    <MapView.Marker   provider={PROVIDER_GOOGLE}
                      coordinate={{latitude: dataSource.Location.latitude,
                            longitude: dataSource.Location.longitude,
                      }}    
                    />
                    </MapView>
                  </CardItem>
                  {/* <CardItem>

                  </CardItem> */}
                </Card>
              </View>
                      
              <View>            
            <Text style={{fontSize:16,alignSelf:'center',marginTop:20}}>
              ข้อมูลงาน <FontAwesome5 name="network-wired" size={24} color="#3F51B5" />
            </Text>        
            <Card>
              <CardItem>
                <Left>
                  <Text >
                    ชื่องาน {dataSource.announceName}
                  </Text>
                </Left>
                <Right >
                  <Text style={{alignSelf:'center'}}>
                    ประกาศเมื่อ
                  </Text>
                  <Text style={{alignSelf:'center'}}>
                    เวลา{"\t"}{dataSource.createdAt.toDate().toLocaleTimeString()}{"\n"}
                    วันที่{"\t"}{dataSource.createdAt.toDate().toLocaleDateString()}
                  </Text>
                </Right>
              </CardItem>
      
              <CardItem>
                <Text >
                  ลักษณะงาน/อธิบาย{"\t"}{dataSource.announceExplain} 
                </Text>
              </CardItem>

              <CardItem>
                <Text>
                  ว่าจ้าง{"\t"}{T()}
                </Text>
              </CardItem>
              
              <CardItem>
                
                  <Textarea rowSpan={4} style={{flex:1}} bordered placeholder="โฆษณา/อธิบาย" 
                  onChangeText={(g)=>setDis(g)}/>
              
              </CardItem>
            </Card>
          </View>
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
        <Title>ประกาศงาน</Title>
      </Body>
      <Right>
        {/* <Button transparent onPress={() => navigation.navigate('WorkPicture')}>
          < AntDesign name="edit" size={24} color="#FFFFFF" />
        </Button> */}
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

