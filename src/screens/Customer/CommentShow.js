import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View ,ScrollView,RefreshControl,TouchableHighlight ,Modal} from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header ,  Button,Icon} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
import {Keyaut} from '../Keyaut'
import { SearchBar } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
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


export default function StatusWork (props) {

  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  const KeyRef = React.useContext(Keyaut);
  const [Show,setShow] = useState(0)
  const [modalVisible, setModalVisible] = useState(false);
  // const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceT, setDataSourceT] = useState([]);
  
  const [search, setSearch] = useState('');
  // const [PersonO, setPersonO] = useState(null);
  const [Point, setPoint] = useState(null);;
  //var docRefPerson = firebase.firestore().collection("users").doc("LA")
  var docRef = firebase.firestore().collection("Comment");

  

  useEffect(() => {
    getData();

  }, []);

  const getData = () =>{
    var cities = [];
    docRef.where("CustommerKey", "==", KeyRef.key)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          cities.push(doc.data());
        });
      setDataSource(cities)
      setDataSourceT(cities)
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
   // setShow(1)
  }


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(300).then(() => setRefreshing(false));
  }, []);

  const CheckComment = (status) =>{
    if(status == true){
      return(
        <AntDesign name="checksquare" size={24} color="#CA7004" />
      );
    }
    else{
      return(
        <AntDesign name="closesquare" size={24} color="#CA7004" />
      );
    }
  }

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = dataSource.filter(function (item) {
        const itemData = item.WorkName
          ? item.WorkName.toUpperCase()
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

  const FilterW= (CC) =>{ //ยืนยันทำงาน
    let result = CC.filter((CC) => {
      return CC.status ==  "รอช่างยืนยัน"
    })
    setDataSource(result)
  }

  const FilterF= (CC) =>{ //กำลังทำ
    let result = CC.filter((CC) => {
      return CC.status ==  false
    })
    setDataSource(result)
  }

  const FilterT= (CC) =>{ //กำลังทำ
    let result = CC.filter((CC) => {
      return CC.status ==  true
    })
    setDataSource(result)
  }

  const SortDate = (CC) =>{
    let SortP = CC.sort((b, a) =>  a.createdAt.seconds - b.createdAt.seconds);
    setDataSource(SortP)
  }

const ItemView = (item, key) => {
    return (
      <TouchableHighlight View key={key} style ={{margin:5}} 
        onPress = {() => navigation.navigate('CCommentT',{Key : item.Key,TKey: item.TechicianKey,AKey : item.KeyAnnou,Name: item.WorkName,Tot : item})}
      >
        <Card>
          <CardItem>
            <Left>
              <Text style={styles.itemStyle}>
                {item.WorkName}{"\n"}คะเเนนรวม {item.Totle}
              </Text>
            </Left>
            <Right>
              {CheckComment(item.status)}
              <Text >{item.createdAt.toDate().toLocaleTimeString()} {item.createdAt.toDate().toLocaleDateString()}</Text>
            </Right>
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
            <View style={{marginTop:12}}>
              <Title>การประเมินช่าง</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <Fontisto name="person" size={33} color="#FFFFFF" />
            </View>
          </View>
          {/* <Subtitle>งานที่ประกาศ</Subtitle> */}
        </Body>
        <Right>
          <Button transparent onPress={() => setModalVisible(!modalVisible)}>
            <FontAwesome name="unsorted" size={24} color="#FFFFFF" />
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
                  placeholder="ค้นหารายชื่องาน"
                  lightTheme = {true}
                  // placeholderTextColor= "#CA7004"
                  value={search}
                />
            </View>
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
                      style={{ ...styles.openButton, }}
                      onPress={() => {
                        FilterT(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>ได้รับการประเมินเเล้ว</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={{ ...styles.openButton,}}
                      onPress={() => {
                        FilterF(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>ยังไม่ได้รับการประเมิน</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={{ ...styles.openButton,}}
                      onPress={() => {
                        SortDate(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>เรียงจากวันที่</Text>
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
            <View style={{marginTop:12}}>
              <Title>การประเมินช่าง</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <Fontisto name="person" size={33} color="#FFFFFF" />
            </View>
          </View>
        </Body>
        <Right>
          <Button transparent onPress={() => setModalVisible(!modalVisible)}>
            <FontAwesome name="unsorted" size={24} color="#FFFFFF" />
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
                placeholder="ค้นหารายชื่องาน"
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
                      <Text>ไม่มีการให้คะเเนนเเละความคิดเห็น</Text>
                    </View>
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
                      style={{ ...styles.openButton, }}
                      onPress={() => {
                        FilterT(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>ได้รับการประเมินเเล้ว</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={{ ...styles.openButton,}}
                      onPress={() => {
                        FilterF(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>ยังไม่ได้รับการประเมิน</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      style={{ ...styles.openButton,}}
                      onPress={() => {
                        SortDate(dataSourceT);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.textStyle}>เรียงจากวันที่</Text>
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
    backgroundColor: '#CA7004',
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

