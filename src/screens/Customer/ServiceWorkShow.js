import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View ,RefreshControl ,ScrollView,TouchableHighlight} from 'react-native';
import {Container,Left, Body,Right, Title, Header , Button,Icon,Card,CardItem} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import {Context} from './context'
import { Fontisto } from '@expo/vector-icons';

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


export default function ServiceWorkShow (props) {
  const KeyRef = React.useContext(Context);


  const { navigation } = props

  const [refreshing, setRefreshing] = useState(false);
  var docRefOccupation = firebase.firestore().collection("users").doc(KeyRef.Tkey);
  var docRefOnoff = firebase.firestore().collection("users").doc(KeyRef.Tkey).collection("onoff");
  var docRefService = firebase.firestore().collection("users").doc(KeyRef.Tkey).collection("ServiceWork");

  const [Show,setShow] = useState(0)
  const [Point, setPoint] = useState(null);
  const [Motorcycle, setMotorcycle] = useState(false);
  const [Electrician, setElectrician] = useState(false);
  const [Electricity, setElectricity] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCD, setModalVisibleCD] = useState(false);

  const [dataOnoff, setDataOnoff] = useState([]);
  const [dataService, setDataService] = useState([]);

  const [isSelect,setisSelect] = useState(null);




  useEffect(() => {
    getData();
  }, []);


  const getData = () =>{
    var Onoff = [];
    var Service = [];
    docRefOnoff
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          Onoff.push(doc.data());
        });
        setDataOnoff(Onoff)
    });

    docRefService
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          Service.push(doc.data());
        });
        setDataService(Service)
    });

    docRefOccupation
    .onSnapshot(function(doc) {
      if (doc.exists) {
        setMotorcycle(doc.data().Occupations.Motorcycle);
        setElectrician(doc.data().Occupations.Electrician);
        setElectricity(doc.data().Occupations.Electricity);}
    });
    setShow(1)
  }


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(300).then(() => setRefreshing(false));
  }, []);


const OnoffView = (item, key) => {
  return (
    // Flat List Item
    <TouchableHighlight View key={key} style ={{margin:5}} >

      <Text style={styles.itemStyle}>
        {item.on} - {item.off} 
        {item.Day.Sunday ? "  อา" : ""}
        {item.Day.Monday ? "  จ" : ""}
        {item.Day.Tuesday ? "  อ" : ""}
        {item.Day.Wednesday ? "  พ" : ""}
        {item.Day.Thursday ? "  พฤ" : ""}
        {item.Day.Friday ? "  ศ" : ""}
        {item.Day.Saturday ? "  ส" : ""}
      </Text>
      
    </TouchableHighlight>


  );
};

const ServicView = (item, key) => {
  return (
    // Flat List Item
    // <TouchableHighlight View key={key} style ={{margin:5}} onLongPress = {() => getItem(item,2)}>
    <TouchableHighlight  key={key} style ={{margin:5}} >
      <Card>
        <CardItem>
          <MaterialIcons name="work" size={24} color="#CA7004" />
          <Text style={styles.itemStyle2}>
            งาน {item.NameWork}
          </Text>
        </CardItem>

        <CardItem>
          <MaterialIcons name="attach-money" size={24} color="#CA7004" />
          <Text style={styles.itemStyle2}>
            ราตา {item.Rate}
          </Text>
        </CardItem>

        <CardItem>
          <FontAwesome5 name="hand-rock" size={24} color="#CA7004" />
          <Text style={styles.itemStyle2}>
            เทคนิควิธีการ {item.description}
          </Text>
        </CardItem>
      </Card>
      </TouchableHighlight>
  );
};


if(dataOnoff.length > 0 || dataService.length > 0){
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
                <Title>งานบริการ</Title>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
              </View>
            </View>
       
          </Body>
          <Right>
            {/* <Button transparent onPress={() => navigation.navigate('ServiceWork')}>
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button> */}
          </Right>
        </Header>

        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>


          <View style={{margin:5}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',margin:10}}>
              <View>
                <FontAwesome5 name="user-tie" size={95} color="#CA7004" />
              </View>

              <View>
                <Text style={{fontSize:16}}>{Motorcycle ? " ช่างซ่อมรถจักรยานยนต์\n" : null} 
                      {Electrician ? " ช่างซ่อมเครื่องใช้ไฟฟ้า\n" : null}
                      {Electricity ? " ช่างซ่อมไฟฟ้า\n" : null}
                </Text>
              </View>
            </View>

            <View style = {{margin:10}}>
              <Text>เวลาเปิด-ปิด </Text>
              {dataOnoff.map(OnoffView)}
            </View>
         
       
            <View style={styles.container}>
              
                {dataService.map(ServicView)}
              
            </View>
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
                <Title>งานบริการ</Title>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
              </View>
            </View>
          </Body>
          <Right>
            <Button transparent onPress={() => navigation.navigate('ServiceWork')}>
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button>
          </Right>
        </Header>

        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
          <View style={{margin:5}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',margin:10}}>
              <View>
                <FontAwesome5 name="user-tie" size={95} color="#3F51B5" />
              </View>
              <View>
                <Text style={{fontSize:16}}>
                  ประเภทงานบริการ
                </Text>
                <Text style={{fontSize:16}}>{Motorcycle ? " ช่างซ่อมรถจักรยานยนต์\n" : null} 
                      {Electrician ? " ช่างซ่อมเครื่องใช้ไฟฟ้า\n" : null}
                      {Electricity ? " ช่างซ่อมไฟฟ้า\n" : null}
                </Text>
              </View>
            </View>

            <View style = {{margin:10}}>
              <Text>เวลาเปิด-ปิด </Text>
              
            </View>
         
       
            <View style = {{margin:10}}>
              <Text>
                งานที่ให้บริการ
              </Text>
            </View>
          </View>
          </ScrollView>
        </SafeAreaView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
  itemStyle2: {
    padding: 5,
  },
  itemSeparatorStyle: {
    height: 0.5,
    marginLeft:10,
    width: '96%',
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
});

