import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Image,StyleSheet, Text, View,Dimensions ,Alert, ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,  Button,Icon,Textarea} from 'native-base' 
//import { AntDesign } from '@expo/vector-icons'; 
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
//import Spinner from 'react-native-loading-spinner-overlay';
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
              รูปภาพงาน
            </Text>
            <Swiper style={styles.swiper} height={250} auto>
              {
              //Loop of JS which is like foreach loop
                dataSource.announcePhoto.map(ItemView)
              }
            </Swiper>
          </View>

          <View>
            <Text style={{fontSize:16,alignSelf:'center'}}>
              แผนที่งาน
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
                      
          <Card>
            <CardItem style={{alignSelf:'center'}}>
              <Text style={{fontSize:16}}>
                  ข้อมูลงาน
              </Text>
            </CardItem>
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
                  {dataSource.createdAt.toDate().toLocaleTimeString()} {dataSource.createdAt.toDate().toLocaleDateString()}
                </Text>
              </Right>
            </CardItem>
            <CardItem>
              <Text > {dataSource.Motorcycle ? "ช่างซ่อมรถจักรยานยนต์\n\n" : null} 
                      {dataSource.Electrician ? " ช่างซ่อมเครื่องใช้ไฟฟ้า\n\n" : null}
                      {dataSource.Electricity ? " ช่างซ่อมไฟฟ้า\n\n" : null}
              </Text>
            </CardItem>
            <CardItem>
              <Text >
                ลักษณะงาน {dataSource.announceExplain} 
              </Text>
            </CardItem>
            <CardItem>
              <Textarea rowSpan={4} style={{flex:1}} bordered placeholder="โฆษณา/อธิบาย" 
                  value = {Dis} onChangeText={(g)=>setDis(g)}/>
            </CardItem>
            
            <View style = {{alignItems:'center',marginTop:15}}>
              <TouchableHighlight
                style={styles.openButton}
                onPress={() => {
                  Edit();
                }}
                >
                <Text style={styles.textStyle}>บันทึกการแก้ไข</Text>
              </TouchableHighlight>
            </View>
            
          </Card>
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

