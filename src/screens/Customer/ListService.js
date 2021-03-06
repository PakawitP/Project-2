import React,{ useState, useEffect,useCallback} from 'react';
import { SafeAreaView,Platform,Image,StyleSheet, Text, View ,Modal  ,ScrollView,RefreshControl,TouchableHighlight,CheckBox} from 'react-native';
import {Container,Left, Body,Right, Title, Header ,Card, CardItem, Button,Icon,} from 'native-base' 
import { FontAwesome } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { SearchBar } from 'react-native-elements';
import { firebaseConfig } from './firebaseConfig.js';
import { Fontisto } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
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

export default function ListTechnicians (props) {
  
  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  const [Show,setShow] = useState(0)
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceT, setDataSourceT] = useState([]);
  const [Glocation, setGLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  var docRef = firebase.firestore().collection("users");
 

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

    getdata();
  }, []);

  
  const getdata = () => {

    // docRef.where("Occupations.Technician", "==", true)
    // .onSnapshot(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         Udata = doc.data()
    //         //console.log(Udata)
    //         firebase.firestore().collection("users").doc(Udata.Key).collection("ServiceWork")
    //         .onSnapshot(function(querySnapshot) {
    //           querySnapshot.forEach(function(doc) {
                  
    //               Sdata = doc.data()
    //               Fdata = {...Sdata,...Udata}
    //               console.log(Fdata)
    //               cities.push(Fdata);
    //           })
    //         });
    //     })
    //     setDataSource(cities)
    //     setDataSourceT(cities)
    // });


    let cities = [];
    docRef.where("Occupations.Technician", "==", true)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let Udata = doc.data()
          firebase.firestore().collection("users").doc(Udata.Key).collection("ServiceWork")
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                let Sdata = doc.data()
                let Fdata = {...Sdata,...Udata}
                console.log(Fdata)
                cities.push(Fdata);
              });
            })
        });
        setDataSource(cities)
        setDataSourceT(cities)
        
    })
   
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getdata();
    wait(300).then(() => setRefreshing(false));
  }, []);


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


  const SortDistance = (CC) =>{
    let SortD =  CC.sort((a, b) => 
      Distance(a.latlong.latitude,a.latlong.longitude)-Distance(b.latlong.latitude,b.latlong.longitude))
      // parseFloat(Math.sqrt(Math.pow( b.latlong.latitude,2) + Math.pow( b.latlong.longitude,2))) - 
      // parseFloat(Math.sqrt(Math.pow( a.latlong.latitude,2) + Math.pow ( a.latlong.longitude,2))));
    setDataSource(SortD)
  }
  
  const SortPoint = (CC) =>{
    let SortP = CC.sort((a, b) => parseFloat(b.TotalScore) - parseFloat(a.TotalScore));
    setDataSource(SortP)

  }


  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = dataSource.filter(function (item) {
        const itemData = item.NameWork
          ? item.NameWork.toUpperCase()
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

  
  

const ItemView = (item, key) => {
  return (
    <TouchableHighlight  key={key} style ={{margin:5}} onPress = {() => navigation.navigate('MyTabs',{ Tkey: item.Key })}>
      <Card>
        <CardItem>
          
          <Text style={styles.itemStyle}>
            ?????????????????????{"\t"}{"\t"}{item.NameWork} {"\n"}
            ??????????????????????????????/??????????????????{"\t"}{"\t"}{item.description} {"\n"}
            ???????????????????????????{"\t"}{"\t"}{item.Rate} {"\n"}
            ????????????????????????????????????{"\t"}{"\t"}{item.Name} {"\n"}
          </Text>
        </CardItem>
        {ItemSeparatorView()}
        <CardItem>
          <Left>
            <Text style={styles.itemStyle}>
              ???????????????????????????????????? {item.WorkSuccess} {"\n"}
              ?????????????????????????????? {item.CerTech}
            </Text>
          </Left>
          
          <Right>
            <Text style={styles.itemStyle}>
              ??????????????????????????? {item.TotalScore.toFixed(1)} <FontAwesome name="star" size={20} color="#efce4a" /> {"\n"}
              ???????????? {Distance(item.latlong.latitude,item.latlong.longitude).toFixed(3)} ???.???.
            </Text>
          </Right>
        </CardItem>
          
      </Card>
    </TouchableHighlight>
  );
};

const ItemSeparatorView = () => {
  return (
    // Flat List Item Separator
    <View style={styles.itemSeparatorStyle} />
  );
};


if(Glocation != null){
  console.log(dataSource)
    return (
      <Container>
        <Header style ={{backgroundColor: "#CA7004"}}>
        <View style={{flex:1,flexDirection:'row'}}>
          <Left>
            <Button transparent onPress={() => navigation.toggleDrawer()}>
              <Icon name='menu'  />
            </Button>
          </Left>
          <Body>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{marginTop:12}}>
                <Title>???????????????????????????????????????</Title>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
              </View>
            </View>

            
          </Body>
          <Right>
            <Button transparent onPress={() => {setModalVisible(true);}}>
              <FontAwesome name="sort" size={24} color="#FFFFFF" />
            </Button>
          </Right> 
          </View>
        </Header>

        <View>
          <SearchBar
            searchIcon={{ size: 24 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="????????????????????????????????????????????????????????????"
            lightTheme = {true}
            // placeholderTextColor= "#CA7004"
            value={search}
          />
        </View>


        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <SafeAreaView style={{ flex: 1 }}>
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


                      <TouchableHighlight
                        style={{ ...styles.openButton, }}
                        onPress={() => {
                          SortPoint(dataSourceT);
                          setModalVisible(false);
                        }}>
                        <Text style={styles.textStyle}>??????????????????????????????????????????</Text>
                      </TouchableHighlight>

                      <TouchableHighlight
                        style={{ ...styles.openButton,}}
                        onPress={() => {
                          SortDistance(dataSourceT);
                          setModalVisible(false);
                          
                        }}>
                        <Text style={styles.textStyle}>?????????????????????????????????????????????</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>
                
            </View>
          </SafeAreaView>
        </ScrollView>
      </Container>
      
    );
  }else{
    return (
      <Container>
      <Header style ={{backgroundColor: "#CA7004"}}>
      <View style={{flex:1,flexDirection:'row'}}>
        <Left>
          <Button transparent onPress={() => navigation.toggleDrawer()}>
            <Icon name='menu'  />
          </Button>
        </Left>
        <Body>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{marginTop:12}}>
              <Title>???????????????????????????????????????</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <Fontisto name="person" size={33} color="#FFFFFF" />
            </View>
          </View>

          
        </Body>
        <Right>
          <Button transparent onPress={() => {setModalVisible(true);}}>
            <FontAwesome name="sort" size={24} color="#FFFFFF" />
          </Button>
        </Right> 
        </View>
      </Header>


      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
          
       
          <View>
            <SearchBar
              searchIcon={{ size: 24 }}
              onChangeText={(text) => searchFilterFunction(text)}
              onClear={(text) => searchFilterFunction('')}
              placeholder="????????????????????????????????????????????????????????????"
              lightTheme = {true}
              // placeholderTextColor= "#CA7004"
              value={search}
            />
         </View>
          {/* List Item as a function */}
          
            
            


            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>


                  <TouchableHighlight
                    style={{ ...styles.openButton,  }}
                    onPress={() => {
                      SortPoint(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>??????????????????????????????????????????</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton,}}
                    onPress={() => {
                      SortDistance(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>?????????????????????????????????????????????</Text>
                  </TouchableHighlight>

                  
                </View>
              </View>
            </Modal>




            
        </View></ScrollView>
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
    padding: 40,
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
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16
  },
  openButton: {
    backgroundColor: '#CA7004',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom:10,
    width: 200
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
  boxinput:{
    marginRight: 20,
    marginTop:15,
    marginLeft:20,
  },
  checkboxInput: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    margin: 5,
  },
});

