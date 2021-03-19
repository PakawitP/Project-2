import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View , Modal,ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Content,Card,CardItem, Title, Header , Subtitle,  Button,Icon} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import { SearchBar } from 'react-native-elements';
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


export default function JobAnnouShow (props) {

  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  //const [Show,setShow] = useState(0)
  const [modalVisible, setModalVisible] = useState(false);
  //const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [PointT, setPointT] = useState(null);
  const [U, setU] = useState(null);;
  const KeyRef = React.useContext(Keyaut);
  const [dataSourceT, setDataSourceT] = useState([]);
  const [search, setSearch] = useState('');
  //var docRef = firebase.firestore().collection("users").doc("LA").collection("WorkingPicture");
  var docRef = firebase.firestore().collection("announce");
  var docRefU = firebase.firestore().collection("users").doc(KeyRef.key)
  useEffect(() => {
    getData();
  }, []);

  const getData = () =>{
    var cities = [];
    // docRef.where("announceStatus", "==", false).onSnapshot(function(querySnapshot) {
    //   querySnapshot.forEach(function(doc) 
    docRef.where("nameID", "==", KeyRef.key)
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if(doc.data().announceStatus != true){
            cities.push(doc.data());
            //console.log(doc.data().createdAt.toDate().toLocaleString())
          }
        });
        setDataSource(cities)
        setDataSourceT(cities)
        cities = []
    })
    docRefU.get().then(function(doc) {
      if (doc.exists) {
          setU(doc.data().Name)
          //console.log(doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    })
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(300).then(() => setRefreshing(false));
  }, []);


  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = dataSource.filter(function (item) {
        const itemData = item.announceName
          ? item.announceName.toUpperCase()
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

  const Time = (time) =>{
    if(time != null){
      return(time.toDate().toLocaleTimeString() +" "+ time.toDate().toLocaleDateString())
    }else{
      return ("อัพเดทเวลา")
    }
  }

const ItemView = (item, key) => {
  return (
    // Flat List Item
    <TouchableHighlight View key={key} style ={{margin:5}} 
    onPress = {() => navigation.navigate('JobAnnouShowT',{Ref : item.Key,Name:item.announceName,User:U})}
    onLongPress = {() => Point(item.Key)}>
      <Card>
        <CardItem>
          <Left>
            <Text>
              {item.announceName}
            </Text>
          </Left>
          
            
        
          <Right>
            <Text style={{fontSize:16}}>
              {item.PCount}  <Fontisto name="person" size={24} color="#CA7004" />
            </Text>
          </Right>
        </CardItem>
        <CardItem>
          <Left>
              <Text>
                ประกาศเมื่อ {Time(item.createdAt)}
              </Text>
            </Left>
        </CardItem>
      </Card>


    </TouchableHighlight>
  );
};

const Point = (T) =>{
  setModalVisible(true)
  setPointT(T)
}

const DeleteDoc = () =>{
  docRef.doc(PointT).delete()
}


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
                <Title>ประกาศงาน</Title>
                  <Subtitle>งานที่ประกาศ</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
            </View>
          </View>
          
        </Body>
        <Right>
          <Button transparent onPress={() => navigation.navigate('JobAnnou',{Location:null})}>
            <Ionicons name="md-add-circle-outline" size={24} color="#FFFFFF" />
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
                placeholder="ค้นหางาน"
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
                  <Text style={styles.modalText}>ต้องการลบ</Text>

                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      DeleteDoc();
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>ต้องการ</Text>
                  </TouchableHighlight>

                  
                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>ยกเลิก</Text>
                  </TouchableHighlight>

                </View>
              </View>
            </Modal>
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
                <Title>ประกาศงาน</Title>
                  <Subtitle>งานที่ประกาศ</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
            </View>
          </View>
      </Body>
      <Right>
            <Button transparent onPress={() => navigation.navigate('JobAnnou',{Location:null})}>
              <Ionicons name="md-add-circle-outline" size={24} color="#FFFFFF" />
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
                  placeholder="ค้นหางาน"
                  lightTheme = {true}
                  // placeholderTextColor= "#CA7004"
                  value={search}
                />
              </View>
              <View style ={{margin:5}}>

                <Card>
                  <CardItem>
                    <View style={{flex:1,alignItems:'center'}}>
                      <AntDesign name="minuscircleo" size={50} color="#CA7004" />
                    </View>
                  </CardItem>
                  <CardItem>
                    <View style={{flex:1,alignItems:'center'}}>
                      <Text>ไม่มีประกาศงาน</Text>
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
    backgroundColor: '#CA7004',
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

