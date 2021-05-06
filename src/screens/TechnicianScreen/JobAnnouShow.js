import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View ,ScrollView,RefreshControl,TouchableHighlight,Modal } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,  Button,Icon} from 'native-base' 
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import { FontAwesome5 } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
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
  const [Show,setShow] = useState(false)
  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceT, setDataSourceT] = useState([]);
  const [PersonO, setPersonO] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
   const [Point, setPoint] = useState(false);;
  const [search, setSearch] = useState('');
  const [Glocation, setGLocation] = useState(null);
  var docRefPerson = firebase.firestore().collection("users").doc(KeyRef.key)
  var docRef = firebase.firestore().collection("announce");

  

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setGLocation(location);
 
    })();
    setDataSource([])
    getDataP();
   // setShow(1)
  }, []);

  const getDataP = () =>{
    //setDataSource([])

    docRefPerson.get().then(function(doc) {
      if (doc.exists) {
          //console.log("Document data:", doc.data());
          if(doc.data().Occupations.Technician == true){
            setPoint(false)
            if(doc.data().Occupations.Electrician == true){
              getdataD("Electrician")
            }
            else if(doc.data().Occupations.Electricity == true){
              getdataD("Electricity")
            }
            else if(doc.data().Occupations.Motorcycle == true){
              getdataD("Motorcycle")
            }
          }else{
            setPoint(false)
          }
          setPersonO(doc.data())
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    // if(PersonO != null){
    //   getdataD();
    // }
    
  }

  const getdataD = (Occ) => {
    // var Occ = [];
    var cities = [];

        if(Show == false){ 
          docRef.where("announceStatus", "==", false).where(Occ, "==", true)
          .onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            
            //console.log(doc.data().createdAt.seconds)
            if(doc.data().nameID != KeyRef.key){
              cities.push(doc.data());
            }
            
          });
          //console.log("Current cities in CA: ", cities);
          setDataSource(cities)
          setDataSourceT(cities)
          cities=[];
        
          });
        }
        else if(Show == true){
          docRef.where("announceStatus", "==", false).where(Occ, "==", true)
          .onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            
            //console.log(doc.data().createdAt.seconds)
            if(doc.data().nameID != KeyRef.key){
              cities.push(doc.data());
            }
            
          });
          //console.log("Current cities in CA: ", cities);
          setDataSource(cities)
          setDataSourceT(cities)
          cities=[];
        
          });
        }
    // }else{
    //   setPoint(true)
    // }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDataP();
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

  const Work =()=>{
    if(Point != true){
      return(
      <View style={{flex:1,alignItems:'center'}}>
        <Text>ไม่มีประกาศงาน</Text>
      </View>)
    }else{
      return(
        <View style={{flex:1,alignItems:'center'}}>
          <Text>เพิ่มประเภทช่างในเมนูงานที่ประกาศ</Text>
        </View>
      )
    }
  }

  const SortDistance = (CC) =>{
    let SortD =  CC.sort((a, b) => 
    Distance(a.Location.latitude,a.Location.longitude)-Distance(b.Location.latitude,b.Location.longitude))
      // parseFloat(Math.sqrt(Math.pow( b.Location.latitude,2) + Math.pow( b.Location.longitude,2))) - 
      // parseFloat(Math.sqrt(Math.pow( a.Location.latitude,2) + Math.pow ( a.Location.longitude,2))));
    setDataSource(SortD)
  }
  
  const SortDate = (CC) =>{
    let SortP = CC.sort((b, a) =>  a.createdAt.seconds - b.createdAt.seconds);
    setDataSource(SortP)
  }

  const ItemView = (item, key) => {
    return (
      // Flat List Item
      <TouchableHighlight View key={key} style ={{margin:5}} 
        onPress = {() => navigation.navigate('JobAnnouShowT',{Ref : item.Key,Name:item.announceName,Per:PersonO.Name})}>
        <Card>
          <CardItem>
            <Left>
              <Text>
                {item.announceName}
              </Text>
            </Left>

            <Right>
                <View style ={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={{marginRight : 5}} >
                    {item.PCount}  
                  </Text>
                  <Fontisto name="person" size={24} color="#3F51B5" /> 
                </View>
            </Right>
          </CardItem>

          <CardItem>
            <Left>
              <Text>
              ประกาศเมื่อ{"\t"}{item.createdAt.toDate().toLocaleDateString()}

                {/* ประกาศเมื่อ{"\t"}{item.createdAt.toDate().toLocaleTimeString()}{"\t"}{item.createdAt.toDate().toLocaleDateString()} */}
              </Text>
            </Left>

            <Right >
              <View >
                  <Text>
                    ระยะ {Distance(item.Location.latitude,item.Location.longitude).toFixed(3)}{"\t"}ก.ม.
                  </Text>
                </View>
            </Right>
          </CardItem>
        </Card>


    </TouchableHighlight>
  );
};

const Distance = (latitude,longitude) =>{
  let Long = longitude - Glocation.coords.longitude
  let dist = Math.sin( latitude* Math.PI / 180) * Math.sin(Glocation.coords.latitude* Math.PI / 180)
            + Math.cos( latitude* Math.PI / 180) * Math.cos(Glocation.coords.latitude* Math.PI / 180)
            * Math.cos(Long* Math.PI / 180)
      dist = Math.acos(dist)
      dist = dist * Math.PI / 180   
      dist = dist * 60 * 1.1515
      dist = dist * 6371
  return dist
}


if(dataSource.length > 0 && Glocation != null){
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
              <Subtitle>งานที่ประกาศ</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>

        </Body> 
        <Right>
          <Button transparent onPress={() =>  navigation.navigate('JobAnnouP')}>
            <AntDesign name="book" size={24} color="#FFFFFF" />
          </Button>
        </Right>
      </Header>

      <View style={{flexDirection:'row'}}>
        <View style={{flex:9}}>
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
        <View style={{flex:1}}>
          <Button style={{height:66,borderWidth: 1,borderColor: '#e1e8ee'}} full onPress={()=>{
            setModalVisible(true)
          }}>
            <FontAwesome name="sort" size={24} color="#FFFFFF" />
          </Button>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          
          <View style={styles.container}>
            

            {
            //Loop of JS which is like foreach loop
              dataSource.map(ItemView)
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>การเรียงลำดับ</Text>
                    <TouchableHighlight
                      style={{ ...styles.openButton }}
                      onPress={() => {
                        SortDate(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>เรียงจากวันที่</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={{ ...styles.openButton }}
                      onPress={() => {
                        SortDistance(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>เรียงจากตำแหน่ง</Text>
                    </TouchableHighlight>
                    <Text style={styles.modalText}>ประเภทช่าง</Text>
                    <TouchableHighlight
                      style={{ ...styles.openButton}}
                      onPress={() => {
                        setShow(true)
                        getdataD("Motorcycle")
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>รถจักรยานยนต์</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{ ...styles.openButton}}
                      onPress={() => {
                        setShow(true)
                        getdataD("Electrician")
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>เครื่องใช้ไฟฟ้า</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{ ...styles.openButton}}
                      onPress={() => {
                        setShow(true)
                        getdataD("Electricity")
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>ไฟฟ้า</Text>
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
              <Subtitle>งานที่ประกาศ</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>
        </Body>
        <Right>
          <Button transparent onPress={() => {setModalVisible(true);}}>
            <FontAwesome name="sort" size={24} color="#FFFFFF" />
          </Button>
        </Right>
      </Header>

      <View style={{flexDirection:'row'}}>
        <View style={{flex:9}}>
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
        <View style={{flex:1}}>
          <Button style={{height:66,borderWidth: 1,borderColor: '#e1e8ee'}} full onPress={()=>{
            setModalVisible(true)
          }}>
            <FontAwesome name="sort" size={24} color="#FFFFFF" />
          </Button>
        </View>
      </View>

    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
          
            <View style ={{margin:5}}>

              <Card>
                <CardItem>
                  <View style={{flex:1,alignItems:'center'}}>
                    <AntDesign name="minuscircleo" size={50} color="#3F51B5" />
                  </View>
                </CardItem>
                <CardItem>
                  {Work()}
                </CardItem>
              </Card>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>การเรียงลำดับ</Text>
                    <TouchableHighlight
                      style={{ ...styles.openButton }}
                      onPress={() => {
                        SortDate(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>เรียงจากวันที่</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={{ ...styles.openButton }}
                      onPress={() => {
                        SortDistance(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>เรียงจากตำแหน่ง</Text>
                    </TouchableHighlight>
                    <Text style={styles.modalText}>ประเภทช่าง</Text>
                    <TouchableHighlight
                      style={{ ...styles.openButton}}
                      onPress={() => {
                        setShow(true)
                        getdataD("Motorcycle")
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>รถจักรยานยนต์</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{ ...styles.openButton}}
                      onPress={() => {
                        setShow(true)
                        getdataD("Electrician")
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>เครื่องใช้ไฟฟ้า</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{ ...styles.openButton}}
                      onPress={() => {
                        setShow(true)
                        getdataD("Electricity")
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>ไฟฟ้า</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
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
    backgroundColor: '#3F51B5',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom:10,
    width: 150
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
    fontSize: 16
  },
});

