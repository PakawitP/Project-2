import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View ,ScrollView,Modal ,RefreshControl,Alert,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,  Button,Icon} from 'native-base' 
import { AntDesign } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};


export default function JobAnnouShow (props) {
  const KeyRef = React.useContext(Keyaut);
  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  const [Show,setShow] = useState()
  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceT, setDataSourceT] = useState([]);
  const [Point, setPoint] = useState(null);;
  const [Request, setRequest] = useState(null);
  const [modalVisibleC, setModalVisibleC] = useState(false);
  var docRef = firebase.firestore().collection("CerTech")
  var docRefCer = firebase.firestore().collection("users")
  const [search, setSearch] = useState('');

  

  useEffect(() => {
    getData();
  }, []);

  const getData = () =>{
    var cities = [];
    docRef.where("TAnswer", "==", KeyRef.key)
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if(doc.data().status != true)
            cities.push(doc.data());
        })
        setDataSource(cities)
        setDataSourceT(cities)
        cities = []
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
    <TouchableHighlight View key={key} style ={{margin:5}} 
    onPress = {() => {setRequest(item.TRequest);setPoint(item.Key);setShow(item.Name);setModalVisibleC(true) }}>
      <Card>
        <CardItem>
          <Left>
            <Text style={styles.itemStyle}>
              {item.Name}
            </Text>
          </Left>
          
            <Text style={styles.itemStyle}>
              ขอเมื่อ {item.createdAt.toDate().toLocaleTimeString()} {item.createdAt.toDate().toLocaleDateString()}
            </Text>
          
        </CardItem>
      </Card>


    </TouchableHighlight>
  );
};


const searchFilterFunction = (text) => {
  // Check if searched text is not blank
  if (text) {
    // Inserted text is not blank
    // Filter the masterDataSource
    // Update FilteredDataSource
    const newData = dataSource.filter(function (item) {
      const itemData = item.Name
        ? item.Name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setDataSource(newData);
    setSearch(text);
  } else {
    // Inserted text is blank
    // Update FilteredDataSource with masterDataSource
    setDataSource(dataSourceT);
    setSearch(text);
  }
};
 
const  VerifyCer = () =>{
  docRef.doc(Point).set({
    status: true
  }, { merge: true }).then(()=>{
    let count = 0
    docRef.where("TRequest", "==", Request)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.data().status == true){      
            count = count + 1
          }   
        });
        CerCount(count)
        
    })
    
  })

}


const CerCount = (C) =>{
  docRefCer.doc(Request).set({
    CerTech: C,
  }, { merge: true }).then(()=>{
    Alert.alert(
      "การยืนยันช่าง",
      "ให้การยืนยัน "+Show+" สำเร็จ")
      
  })
    
}

const gettoken = () =>{
  docRefCer.doc(Request).get().then(function(doc) {
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
    title: 'การรับรองช่าง',
    body: 'การขอรับรองได้รับการยืนยันเเล้ว',
    
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

if(dataSource.length > 0){
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
              <Title>ขอรับรอง</Title>
              <Subtitle>ช่างที่ขอรับรอง</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>

        </Body> 
        <Right>
          <Button transparent onPress={()=> navigation.navigate('StackList')}>
            <AntDesign name="pluscircle" size={24} color="#FFFFFF" />
          </Button>
        </Right>
      </Header>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.container}>
            <View>
              <SearchBar
                searchIcon={{ size: 24 }}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                placeholder="ค้นหารายชื่อ"
                lightTheme = {true}
                // placeholderTextColor= "#CA7004"
                value={search}
              />
            </View>
            {
            //Loop of JS which is like foreach loop
              dataSource.map(ItemView)
            }
              
          </View>


          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleC}
            onRequestClose={() => {
              setModalVisibleC(false);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                  onPress={() => {
                    //SortPoint(dataSourceT);
                    setModalVisibleC(false);//{}Tkey: Request
                    navigation.navigate('StackList',{screen:'MyTabsT',params: { Tkey: Request }})
                  }}>
                  <Text style={styles.textStyle}>ดูรายละเอียด</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                  onPress={() => {
                    VerifyCer();
                    gettoken()
                    setModalVisibleC(false);
                  }}>
                  <Text style={styles.textStyle}>ให้การรับรอง</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>



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
          <View style={{flex:1,flexDirection:'row'}}>
            <View >
              <Title>ขอรับรอง</Title>
              <Subtitle>ช่างที่ขอรับรอง</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>
        </Body>
        <Right>
          <Button transparent onPress={()=> navigation.navigate('StackList')}>
            <AntDesign name="pluscircle" size={24} color="#FFFFFF" />
          </Button>
        </Right>
      </Header>

    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
          <View>
              <SearchBar
                searchIcon={{ size: 24 }}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                placeholder="ค้นหารายชื่อ"
                lightTheme = {true}
                // placeholderTextColor= "#CA7004"
                value={search}
              />
            </View>
            <View style ={{margin:5}}>

              <Card>
                <CardItem>
                  <View style={{flex:1,alignItems:'center'}}>
                    <AntDesign name="minuscircleo" size={50} color="#3F51B5" />
                  </View>
                </CardItem>
                <CardItem>
                  <View style={{flex:1,alignItems:'center'}}>
                    <Text>ไม่มีการขอรับรอง</Text>
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
    width: 200
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

