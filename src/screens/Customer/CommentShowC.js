import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View ,ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header ,  Button,Icon} from 'native-base' 
//import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
//import {Keyaut} from '../Keyaut'
import {Context} from './context'
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
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

  const KeyRef = React.useContext(Context);
  //const KeyRef = React.useContext(Keyaut);
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState(null);

  const [ACount, setACount] = useState(0);
  const [AQuality, setQuality] = useState(0);
  const [APunctual, setAPunctual] = useState(0);
  const [ACourtesy, setACourtesy] = useState(0);
  const [AScharge, setAScharge] = useState(0);
  const [AContact, setAContact] = useState(0);
  const [ATotle, setATotle] = useState(0);

  var docRef = firebase.firestore().collection("Comment");
  var docRefT = firebase.firestore().collection("users").doc(KeyRef.Tkey);

//console.log(KeyRef.key)

  useEffect(() => {
    getDataA();
  }, [dataSource != null]);


  const getDataA = () =>{
    var cities = [];
    var Count = 0
    let Quality = 0
    let Punctual = 0
    let Courtesy = 0
    let Scharge = 0
    let Contact = 0
    let Totle = 0

    docRef.where("TechicianKey","==", KeyRef.Tkey)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if(doc.data().status == true){
            Count = Count + 1
            Quality = Quality + doc.data().Quality
            Punctual = Punctual + doc.data().Punctual
            Courtesy = Courtesy + doc.data().Courtesy
            Scharge = Scharge + doc.data().Scharge
            Contact = Contact + doc.data().Contact
            Totle = Totle + doc.data().Totle
            cities.push(doc.data());
          }
        });
        setDataSource(cities)      
        setACount(Count)
        setQuality(Quality)
        setAPunctual(Punctual)
        setACourtesy(Courtesy)
        setAScharge(Scharge)
        setAContact(Contact)
        setATotle(Totle)
    }).then(()=>{ 
      if(Totle/Count >= 0){
        docRefT.set({
          TotalScore : Totle/Count
        }, { merge: true })
      }else{
        docRefT.set({
          TotalScore : 0
        }, { merge: true })
      }
      
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    // .get().then(function(doc) {
    //   if (doc.exists) {
    //       setDataSource(doc.data())
    //       //console.log(doc.data());
    //   } else {
    //       // doc.data() will be undefined in this case
    //       console.log("No such document!");
    //   }
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // });

  }

  const ItemView = (item, key) => {
    return (
      // Flat List Item
      <TouchableHighlight View key={key} style ={{margin:5}} 
        onPress = {() => navigation.navigate('CCommentC',{All: item})}>
        <Card>
          <CardItem>
            <Left>
              <Text style={styles.itemStyle}>
                {item.WorkName}
              </Text>
            </Left>
            <Right>
              <Text style={styles.itemStyle}>
                {item.Totle}{"\t"}<FontAwesome name="star" size={24} color="#efce4a" />
              </Text>
            </Right>
          </CardItem>
        </Card>
  
  
      </TouchableHighlight>
    );
  };



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDataA();
    wait(300).then(() => setRefreshing(false));
  }, []);

  const point = (a,b) =>{
    if(a/b >= 0){
      return (a/b).toFixed(1)
    }else{
      return 0
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
            <View style={{marginTop:12}}>
              <Title>????????????????????????????????????????????????</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
                  <Fontisto name="person" size={33} color="#FFFFFF" />
              </View>
          </View>
        </Body>
        <Right>
          {/* <Button transparent>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" />
          </Button> */}
        </Right>
      </Header>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style ={{margin:5}}>
            <Card>
              <Body>
                <CardItem>
                  <View>
                    <Right>
                      <Foundation name="graph-bar" size={50} color="#CA7004" />
                    </Right>
                    <Text style={{fontSize:18}}>
                      ???????????????????????????????????????????????????
                    </Text>
                  </View>
                </CardItem>
              </Body>
              <CardItem>
                <Left style={{marginLeft:30}}>
                  <Text >
                    ???????????????????????????????????? 
                  </Text>
                </Left>
                <Right style={{marginRight:30}}>
                  <Text >
                    {point(AQuality,ACount)}{"\t"}<FontAwesome name="star" size={24} color="#efce4a" />
                  </Text>
                </Right>
              </CardItem>
      
              <CardItem>
                <Left style={{marginLeft:30}}>
                  <Text >
                    ?????????????????????????????? 
                  </Text>
                </Left>
                <Right style={{marginRight:30}}>
                  <Text >
                    {point(APunctual,ACount)}{"\t"}<FontAwesome name="star" size={24} color="#efce4a" />
                  </Text>
                </Right>
                
              </CardItem>

              <CardItem>
                <Left style={{marginLeft:30}}>
                  <Text >
                    ??????????????????/??????????????????
                  </Text>
                </Left>
                <Right style={{marginRight:30}}>
                  <Text >
                    {point(ACourtesy,ACount)}{"\t"}<FontAwesome name="star" size={24} color="#efce4a" />
                  </Text>
                </Right>
              </CardItem>

              <CardItem>
                <Left style={{marginLeft:30}}>
                  <Text >
                    ???????????????????????????
                  </Text>
                </Left>
                <Right style={{marginRight:30}}>
                  <Text >
                    {point(AScharge,ACount)}{"\t"}<FontAwesome name="star" size={24} color="#efce4a" />
                  </Text>
                </Right>
              </CardItem>

              <CardItem>
                <Left style={{marginLeft:30}}>
                  <Text >
                    ????????????????????????????????????????????????????????????
                  </Text>
                </Left>
                <Right style={{marginRight:30}}>
                  <Text >
                    {point(AContact,ACount)}{"\t"}<FontAwesome name="star" size={24} color="#efce4a" />
                  </Text>
                </Right>
                
              </CardItem>

              <CardItem>
                <Left style={{marginLeft:30}}>
                  <Text >
                    ???????????????????????????
                  </Text>
                </Left>
                <Right style={{marginRight:30}}>
                  <Text >
                    {point(ATotle,ACount)}{"\t"}<FontAwesome name="star" size={24} color="#efce4a" />
                  </Text>
                </Right>
              </CardItem>
              
            </Card>

            <Card>
              {dataSource.map(ItemView)}
            </Card>
          </View>
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
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{marginTop:12}}>
              <Title>????????????????????????????????????????????????</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
                  <Fontisto name="person" size={33} color="#FFFFFF" />
              </View>
          </View>
        </Body>
        <Right>
          {/* <Button transparent>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" />
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
  swiper: {
    height: 200
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyleSmall: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 15,
  },
  buttonStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    padding: 15,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  starImageStyle: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
});

