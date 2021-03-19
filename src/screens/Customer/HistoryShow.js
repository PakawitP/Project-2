import React,{ useState, useEffect,useCallback } from 'react';
import { Image, Text,StyleSheet ,ScrollView,Dimensions,RefreshControl} from 'react-native';
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import {Container,Left, Body,Right, Title, Header , Subtitle, Button,Icon, Card,CardItem} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import {Context} from './context'
import 'firebase/firestore';
import { View } from 'react-native';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default function HistoryShow (props) {
  const KeyRef = React.useContext(Context);
  var docRef = firebase.firestore().collection("users").doc(KeyRef.Tkey);
  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  const [Data,setData] = useState(null)


  

  
  useEffect(() => {
    getdata()
      
  }, [Data != null])

  const getdata = () =>{
    docRef.get().then(function(doc) {
      if (doc.exists) {
          setData(doc.data());
          setT(doc.data().Occupations.Technician)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    console.log(Data);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getdata();
    wait(300).then(() => setRefreshing(false));
  }, []);


  if(Data != null){
    return (
      <Container style = {styles.container}>
        <Header style ={{backgroundColor: "#CA7004"}}>
          <Left>
            <Button transparent onPress={() => navigation.toggleDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <View style={{flex:1,flexDirection:'row'}}>
              <View >
                <Title>ประวัติ</Title>
                <Subtitle>ประวัติส่วนตัว</Subtitle>
                </View>
                <View style={{marginLeft:10,marginTop:7}}>
                    <Fontisto name="person" size={33} color="#FFFFFF" />
                </View>
            </View>

          </Body>
          <Right>
            {/* <Button transparent  onPress={() => navigation.navigate('History')}> 
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button> */}
          </Right>
        </Header>

        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style ={{margin:5}}>
           <Card style={{alignItems:'center'}}>
            <CardItem >
              <Image source={ {uri:Data.Photo} } style={styles.Image} ></Image>
            </CardItem>
          </Card>

          <Card>
            <CardItem >
              <AntDesign name="user" size={30} color="#CA7004" />
              <Text style ={{fontSize:16}}>ชื่อ</Text>
            </CardItem>
            <CardItem>
              <Text style={{marginLeft:30}}>{Data.Name}</Text>
            </CardItem>
          </Card>

          <Card>
            <CardItem >
              <FontAwesome5 name="address-card" size={24} color="#CA7004" />
              <Text style ={{fontSize:16}}>  ที่อยู่</Text>
            </CardItem>
            <CardItem >
              <Text style={{marginLeft:30}}>{Data.Address}</Text>
            </CardItem>
          </Card>

          <Card>
            <CardItem >
              <MaterialIcons name="contact-mail" size={27} color="#CA7004" />
              <Text style ={{fontSize:16}}>  ช่องทางการติดต่อ</Text>
            </CardItem>
            <CardItem >
              <Text style={{marginLeft:30}}>{Data.Contact}</Text>
            </CardItem>
          </Card>

          <Card>
            <CardItem >
              <FontAwesome5 name="store-alt" size={24} color="#CA7004" />
              <Text style ={{fontSize:16}}>  ที่อยู่ร้าน</Text>
            </CardItem>
            <CardItem >
              <Text style={{marginLeft:30}}>{Data.Addressstore}</Text>
            </CardItem>

            <CardItem >
              <MapView provider={PROVIDER_GOOGLE} style={styles.mapStyle} 
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              zoomTapEnabled={false}
              zoomControlEnabled={false}
              region={{
                latitude: Data.latlong.latitude,
                longitude: Data.latlong.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
              }}>
              <MapView.Marker   provider={PROVIDER_GOOGLE}
                coordinate={{latitude: Data.latlong.latitude,
                      longitude: Data.latlong.longitude,
                }}    
              />
              </MapView>
            </CardItem>
          </Card>
        </View>
          </ScrollView>
 

      </Container>
    );
  }else{
    return (
      <Container style = {styles.container}>
      <Header style ={{backgroundColor: "#CA7004"}}>
        <Left>
          <Button transparent onPress={() => navigation.toggleDrawer()}>
            <Icon name='menu' />
          </Button>
        </Left>
        <Body>
          <View style={{flex:1,flexDirection:'row'}}>
              <View >
                <Title>ประวัติ</Title>
                <Subtitle>ประวัติส่วนตัว</Subtitle>
                </View>
                <View style={{marginLeft:10,marginTop:7}}>
                    <Fontisto name="person" size={33} color="#FFFFFF" />
                </View>
            </View>
        </Body>
        <Right>
          {/* <Button transparent  onPress={() => navigation.navigate('History')}> 
            < AntDesign name="edit" size={24} color="#FFFFFF" />
          </Button> */}
        </Right>
      </Header>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
            
            <View style ={{margin:5}}>

              <Card>
                <CardItem>
                  <View style={{flex:1,alignItems:'center'}}>
                    <AntDesign name="minuscircleo" size={50} color="#CA7004" />
                  </View>
                </CardItem>
                <CardItem>
                  <View style={{flex:1,alignItems:'center'}}>
                    <Text>ไม่มีประวัติ</Text>
                  </View>
                </CardItem>
              </Card>
            </View>
        </View>
      </ScrollView>

    </Container>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  text:{
    marginLeft:15,
    fontSize: 14
  },
  text1:{
    margin : 5,
    fontSize: 14
  },
  Image:{
    width: 200, 
    height: 250,

  },
  TextPosition:{
    justifyContent:'center'
  },
  imgPosition:{
    alignItems:'center',
  },
  mapStyle: {
    width: (Dimensions.get('window').width)-50,
    height: 200,
  },
 
});