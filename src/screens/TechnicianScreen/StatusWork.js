import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View,ScrollView,RefreshControl,TouchableHighlight,Modal } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header, Button,Icon} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
//mport { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import { FontAwesome5 } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import { SearchBar } from 'react-native-elements';
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
  const KeyRef = React.useContext(Keyaut);
  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  //const [Show,setShow] = useState(0)
  //const [modalVisible, setModalVisible] = useState(false);
  //const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceT, setDataSourceT] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  //const [PersonO, setPersonO] = useState(null);
  //const [Point, setPoint] = useState(null);;
  //var docRefPerson = firebase.firestore().collection("users").doc(KeyRef.key)
  var docRef = firebase.firestore().collection("JobStatus");
  
  

  useEffect(() => {
    getData();

  }, []);

  const getData = () =>{
    var cities = [];
    docRef.where("TechicianKey", "==", KeyRef.key)
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if(doc.data().Techicianpetition == null || doc.data().Custommerpetition == null){
            cities.push(doc.data());
          }
            
        });
        //console.log("Current cities in CA: ", cities);
        setDataSource(cities)
        setDataSourceT(cities)
        cities = []
    });
    //setShow(1)
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


  const FilterR= (CC) =>{//คำร้องขอ
    let result = CC.filter((CC) => {
      return (CC.Techicianpetition != CC.Custommerpetition)
    })
    setDataSource(result)
  }

  const FilterW= (CC) =>{ //ยืนยันทำงาน
    let result = CC.filter((CC) => {
      return CC.status ==  "รอช่างยืนยัน"
    })
    setDataSource(result)
  }

  const FilterG= (CC) =>{ //กำลังทำ
    let result = CC.filter((CC) => {
      return CC.status ==  "กำลังดำเนินการ" && CC.Custommerpetition == null && CC.Techicianpetition == null
    })
    setDataSource(result)

  }

const ItemView = (item, key) => {
  if(item.Techicianpetition != item.Custommerpetition){
    return (
      <TouchableHighlight View key={key} style ={{margin:5}} 
        onPress = {() => navigation.navigate('StatusWorkT',{KeyJ : item.Key, KeyAnnou : item.KeyAnnou,Name :item.WorkName})}>
        <Card>
          <CardItem>
            <Left>
              <Text style={styles.itemStyle}>
                ชื่องาน {item.WorkName}{"\n"}ผู้ว่าจ้าง {item.NameCustommer}{"\n"}
              </Text>
            </Left>
            <Right>
              <View style={{alignItems:'flex-end'}}>
              <AntDesign name="exclamationcircle" size={24} color="#3F51B5" />
                <Text>
                  {item.stus}{"\n"}
                </Text>
              </View>
            </Right>
          </CardItem>
        </Card>
      </TouchableHighlight>
    );
  }
  else if(item.status == "รอช่างยืนยัน"){
    return (
      <TouchableHighlight View key={key} style ={{margin:5}} 
        onPress = {() => navigation.navigate('StatusWorkT',{KeyJ : item.Key, KeyAnnou : item.KeyAnnou,Name :item.WorkName})}
      >
        <Card>
          <CardItem >
            <Left>
              <Text style={styles.itemStyle}>
                ชื่องาน {item.WorkName}{"\n"}ผู้ว่าจ้าง {item.NameCustommer}{"\n"}
              </Text>
            </Left>
            {/* <Right>
              <View style ={{flexDirection:'row-reverse'}}>
                <Entypo name="briefcase" size={24} color="#3F51B5" />
                <Text>
                  {"\t"}รอช่างยืนยัน{"\n"}
                </Text>
              </View>
            </Right> */}
            <Right>
              <View style={{alignItems:'flex-end'}}>
              <Entypo name="briefcase" size={24} color="#3F51B5" />
                <Text>
                  รอช่างยืนยัน{"\n"}
                </Text>
              </View>
            </Right>
          </CardItem>
        </Card>
      </TouchableHighlight>
    );
  }
  else{
    return (
      <TouchableHighlight View key={key} style ={{margin:5}} 
        onPress = {() => navigation.navigate('StatusWorkT',{KeyJ : item.Key, KeyAnnou : item.KeyAnnou,Name :item.WorkName})}
      >
        <Card>
          <CardItem>
            <Left>
              <Text style={styles.itemStyle}>
                ชื่องาน {item.WorkName}{"\n"}ผู้ว่าจ้าง {item.NameCustommer}{"\n"}
              </Text>
            </Left>

            <Right>
              <View style={{alignItems:'flex-end'}}>
                <AntDesign name="tool" size={24} color="#3F51B5"/>
                
                <Text>
                  {item.stus}{"\n"}
                </Text>
              </View>
            </Right>
          </CardItem>
        </Card>
      </TouchableHighlight>
    );
  }
  

};


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
            <View style={{marginTop:12}}>
              <Title>สถานะงาน</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>
          
          {/* <Subtitle>งานที่ประกาศ</Subtitle> */}
        </Body>
        <Right>
          <Button transparent>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" 
            onPress={() => navigation.navigate('StatusAdd')}/>
          </Button>
        </Right>
      </Header>
      <View style={{flexDirection:'row'}}>
          <View style={{flex:9}}>
            <SearchBar
              searchIcon={{ size: 24 }}
              onChangeText={(text) => searchFilterFunction(text)}
              onClear={(text) => searchFilterFunction('')}
              placeholder="ค้นหารายชื่องาน"
              lightTheme = {true}
              // placeholderTextColor= "#CA7004"
              value={search}
            /></View>
            <View style={{flex:1}}>
            <Button style={{height:66,borderWidth: 1,borderColor: '#e1e8ee'}} full onPress={()=>{
              setModalVisible(true)
            }}>
            <FontAwesome name="filter" size={24} color="#FFFFFF" />
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
                <Text style={styles.modalText}>สถานะงาน</Text>
                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      FilterR(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>สถานะร้องขอ</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      FilterG(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>สถานะดำเนินการ</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      FilterW(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>คำตอบรับทำงาน</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      setDataSource(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>ทั้งหมด</Text>
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
            <View style={{marginTop:12}}>
              <Title>สถานะงาน</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>
        </Body>
        <Right>
          <Button transparent>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" 
            onPress={() => navigation.navigate('StatusAdd')}/>
          </Button>
        </Right>
      </Header>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.container}>
            <View style={{flexDirection:'row'}}>
                <View style={{flex:9}}>
                    <SearchBar
                      searchIcon={{ size: 24 }}
                      onChangeText={(text) => searchFilterFunction(text)}
                      onClear={(text) => searchFilterFunction('')}
                      placeholder="ค้นหารายชื่องาน"
                      lightTheme = {true}
                      // placeholderTextColor= "#CA7004"
                      value={search}
                    /></View>
                    <View style={{flex:1}}>
                    <Button style={{height:66,borderWidth: 1,borderColor: '#e1e8ee'}} full onPress={()=>{
                      setModalVisible(true)
                    }}>
                    <FontAwesome name="filter" size={24} color="#FFFFFF" />
                  </Button>
                </View>
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
                      <Text>ไม่มีสถานะงาน</Text>
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
                <Text style={styles.modalText}>สถานะงาน</Text>
                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      FilterR(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>สถานะร้องขอ</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      FilterG(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>สถานะดำเนินการ</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      FilterW(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>คำตอบรับทำงาน</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton}}
                    onPress={() => {
                      setDataSource(dataSourceT);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>ทั้งหมด</Text>
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

