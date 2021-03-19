import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View ,ScrollView,RefreshControl,TouchableHighlight,Modal } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,  Button,Icon} from 'native-base' 
import { AntDesign } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import { SearchBar } from 'react-native-elements';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  
import { FontAwesome5 } from '@expo/vector-icons';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};


export default function JobAnnouShow (props) {
  const KeyRef = React.useContext(Keyaut);
  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  //const [Show,setShow] = useState(0)
  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceT, setDataSourceT] = useState([]);
  const [PersonO, setPersonO] = useState(null);
  //const [modalVisible, setModalVisible] = useState(false);
   const [Point, setPoint] = useState(false);;
  const [search, setSearch] = useState('');
  var docRefPerson = firebase.firestore().collection("users").doc(KeyRef.key).collection("job")
  //var docRef = firebase.firestore().collection("announce");

  
  useEffect(() => {
    getDataP();
  }, [PersonO != null]);

  const getDataP = () =>{
    var cities = [];
    docRefPerson.onSnapshot(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            cities.push(doc.data());

        });
        setDataSource(cities)
        setDataSourceT(cities)
        cities = [];
    })
    
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
        const itemData = item.Namejob
          ? item.Namejob.toUpperCase()
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
      // Flat List Item
      <TouchableHighlight View key={key} style ={{margin:5}} 
        onPress = {() => navigation.navigate('JobAnnouShowPT',{Ref : item.keyjob,Name:item.Namejob,Key:item.Key,APKey:item.ApKey})}>
        <Card>
          <CardItem>
            <Left>
              <Text>
                {item.Namejob}
              </Text>
            </Left>
            {/* <Right>
              <Text>
                สมัครเมื่อ {item.createdAt.toDate().toLocaleTimeString()} {item.createdAt.toDate().toLocaleDateString()}
              </Text>
            </Right> */}
          </CardItem>
          <CardItem>
            <Text>
                สมัครเมื่อ {item.createdAt.toDate().toLocaleTimeString()} {item.createdAt.toDate().toLocaleDateString()}
              </Text>
          </CardItem>
        </Card>
    </TouchableHighlight>
  );
};




if(dataSource.length > 0 ){
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
              <Subtitle>งานที่สมัคร</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>

        </Body> 
        <Right>
          {/* <Button transparent onPress={() => {setModalVisible(true);}}>
            <FontAwesome name="sort" size={24} color="#FFFFFF" />
          </Button> */}
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
              <Subtitle>งานที่สมัคร</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>
        </Body>
        <Right>
          {/* <Button transparent onPress={() => {setModalVisible(true);}}>
            <FontAwesome name="sort" size={24} color="#FFFFFF" />
          </Button> */}
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
                    <AntDesign name="minuscircleo" size={50} color="#3F51B5" />
                  </View>
                </CardItem>
                <CardItem>
                  <View style={{flex:1,alignItems:'center'}}>
                    <Text>ไม่มีงานที่สมัคร</Text>
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
    width: 150
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

