import React,{ useState, useEffect ,useCallback} from 'react';
import { SafeAreaView,Modal,StyleSheet, Text, View ,Alert  ,ScrollView,RefreshControl,TouchableHighlight} from 'react-native';
import {Container,Left, Body,Right,Card, CardItem, Title, Header , Subtitle, Item, Button,Icon,Textarea} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  
import {Context} from './context'

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};



export default function History (props) {

  const { navigation } = props
  const KeyRef = React.useContext(Context);

  
  const [dataSource, setDataSource] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  var docRef = firebase.firestore().collection("users").doc(KeyRef.Tkey).collection("HistoryWork");


  useEffect(() => {
    getData();

  }, []);

  const getData = () =>{
    var cities = [];
    docRef.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            cities.push(doc.data());
        });
        setDataSource(cities)
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
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
    <TouchableHighlight View key={key} style ={{margin:5}}>

      <Card>

        <CardItem>
          <FontAwesome5 name="store-alt" size={24} color= '#CA7004' />
          <Text style={styles.itemStyle}>
            ชื่อบริษัท/ร้าน {item.CompanyName}
          </Text>
        </CardItem>

        <CardItem>
          <MaterialCommunityIcons name="human-male-height" size={24} color= '#CA7004' />
          <Text style={styles.itemStyle}>
            ตำแหน่ง {item.WorkingPosition}
          </Text>
        </CardItem>

        <CardItem>
          <Fontisto name="date" size={24} color= '#CA7004' />
          <Text style={styles.itemStyle}>
            ช่วงปีที่ทำ {item.YearsWorked}
          </Text>
        </CardItem>

        <CardItem>
          <FontAwesome5 name="address-card" size={24} color= '#CA7004' />
          <Text style={styles.itemStyle}>
            ที่อยู่บริษัท/ร้าน {item.CompanyAddress}
          </Text>
        </CardItem>

      </Card>

    </TouchableHighlight>
  );
};



if(dataSource.length > 0){
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
              <Title>ประวัติ</Title>
                      <Subtitle>ประวัติการทำงาน</Subtitle>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                  <Fontisto name="person" size={33} color="#FFFFFF" />
              </View>
            </View>
            
          </Body>
          <Right>
            {/* <Button transparent onPress={() => navigation.navigate('Work')}>
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button> */}
          </Right>
        </Header>

        <SafeAreaView style={{ flex: 1 }}> 
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>


            <View style={styles.container}>
              {
              //Loop of JS which is like foreach loop
                dataSource.map(ItemView)
              }
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
              <View >
              <Title>ประวัติ</Title>
                      <Subtitle>ประวัติการทำงาน</Subtitle>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                  <Fontisto name="person" size={33} color="#FFFFFF" />
              </View>
            </View>
            
          </Body>
          <Right>
            {/* <Button transparent onPress={() => navigation.navigate('Work')}>
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button> */}
          </Right>
        </Header>

        <SafeAreaView style={{ flex: 1 }}>
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
    padding: 5,
   
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
});

