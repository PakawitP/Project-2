import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Modal,StyleSheet, Text, View ,RefreshControl,Alert  ,ScrollView,TouchableHighlight} from 'react-native';
import {Container,Left, Body,Right,Title, Header , Button,Icon,Card,CardItem} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import {Keyaut} from '../Keyaut'
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

  const { navigation } = props
  const KeyRef = React.useContext(Keyaut);
  const [refreshing, setRefreshing] = useState(false);
  var docRefOccupation = firebase.firestore().collection("users").doc(KeyRef.key);
  var docRefOnoff = firebase.firestore().collection("users").doc(KeyRef.key).collection("onoff");
  var docRefService = firebase.firestore().collection("users").doc(KeyRef.key).collection("ServiceWork");
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
    docRefOnoff.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          Onoff.push(doc.data());
        });
        setDataOnoff(Onoff)
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    // .onSnapshot(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //       Onoff.push(doc.data());
    //     });
    //     setDataOnoff(Onoff)
    // });

    docRefService.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          Service.push(doc.data());
        });
        setDataService(Service)
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    // .onSnapshot(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //       Service.push(doc.data());
    //     });
    //     setDataService(Service)
    // });

    docRefOccupation.get()
    .then(function(doc) {
      if (doc.exists) {
        setMotorcycle(doc.data().Occupations.Motorcycle);
        setElectrician(doc.data().Occupations.Electrician);
        setElectricity(doc.data().Occupations.Electricity);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    // .onSnapshot(function(doc) {
    //   if (doc.exists) {
    //     setMotorcycle(doc.data().Occupations.Motorcycle);
    //     setElectrician(doc.data().Occupations.Electrician);
    //     setElectricity(doc.data().Occupations.Electricity);}
    // });
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
    <TouchableHighlight View key={key} style ={{margin:5}} onLongPress = {() => getItem(item,1)}>

      <Text style={styles.itemStyle}>
        {mi(item.on)} - {mi(item.off)}
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
    <TouchableHighlight  key={key} style ={{margin:5}} onLongPress = {() => getItem(item,2)}>
      <Card>
        <CardItem>
          <MaterialIcons name="work" size={24} color="#3F51B5" />
          <Text style={styles.itemStyle2}>
            งาน{"\t"}{item.NameWork}
          </Text>
        </CardItem>

        <CardItem>
          <MaterialIcons name="attach-money" size={24} color="#3F51B5" />
          <Text style={{...styles.itemStyle2,flex:1}}>
            ราคา{"\t"}{item.Rate}
          </Text>
        </CardItem>

        <CardItem>
          <FontAwesome5 name="hand-rock" size={24} color="#3F51B5" />
          <Text style={styles.itemStyle2}>
            เทคนิควิธีการ{"\t"}{"\t"}{item.description}
          </Text>
        </CardItem>
      </Card>
      </TouchableHighlight>
  );
};


const getItem = (item,select) => {
  // Function for click on an item
  setPoint(item.Key)
  setisSelect(select)
  setModalVisible(true)
};

const DeleteDoc = () =>{
  if(isSelect == 1){
    docRefOnoff.doc(Point).delete().then(function() {
      Alert.alert(
        "การดำเนินการ",
        "ลบเสร็จสิ้น",)
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }
  if(isSelect == 2){
    docRefService.doc(Point).delete().then(function() {
      Alert.alert(
        "การดำเนินการ",
        "ลบเสร็จสิ้น",)
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }
  getData()
} 

const T = () =>{
  if(Motorcycle == true){
    return ("ช่างซ่อมรถจักรยานยนต์")
  }
  else if(Electrician == true){
    return ("ช่างซ่อมเครื่องใช้ไฟฟ้า")
  }
  else if(Electricity == true){
    return ("ช่างซ่อมไฟฟ้า")
  }else{
    return ("ช่างทั่วไป")
  }
}

const mi = (g) =>{
  let t = g.split(":")
  let ho
  let min
  if(parseInt(t[0]) < 10){
    ho = ("0"+t[0])
  }
  if(parseInt(t[1]) < 10){
    min =  ("0"+t[1])
  }
  else{
    return g
  }
  return (ho+" : "+min)
}


if(dataOnoff.length > 0 || dataService.length > 0){
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
                <Title>งานบริการ</Title>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
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
          <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>


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
                  <Text style={styles.modalText}>ตัวเลือก</Text>
                  
                  <TouchableHighlight
                    style={{ ...styles.openButton, }}
                    onPress={() => {
                      setModalVisibleCD(true);
                      //DeleteDoc();
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>ลบ</Text>
                  </TouchableHighlight>


                  <TouchableHighlight
                    style={{ ...styles.openButton, }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Text style={styles.textStyle}>ยกเลิก</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>




            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleCD}
            onRequestClose={() => {
              setModalVisibleCD(!modalVisibleCD);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>ต้องการลบ</Text>
                <TouchableHighlight
                  style={{ ...styles.openButton,  }}
                  onPress={() => {
                    DeleteDoc();
                    setModalVisibleCD(!modalVisibleCD);
                  }}>
                  <Text style={styles.textStyle}>ตกลง</Text>
                </TouchableHighlight>


                <TouchableHighlight
                  style={{ ...styles.openButton, }}
                  onPress={() => {
                    setModalVisibleCD(!modalVisibleCD);
                  }}>
                  <Text style={styles.textStyle}>ยกเลิก</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          </View>


          <View style={{margin:5}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',margin:10}}>
              <View>
              <FontAwesome5 name="user-tie" size={95} color="#3F51B5" />
              </View>

              <View>
                <Text style={{fontSize:16}}>
                  {T()}
                </Text>
              </View>
            </View>

            <View style = {{margin:10}}>
              <Text>เวลาเปิด-ปิด</Text>
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
        <Header>
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
                <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
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
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={{margin:5}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',margin:10}}>
              <View>
                <FontAwesome5 name="user-tie" size={95} color="#3F51B5" />
              </View>
              <View>
                <Text style={{fontSize:16}}>
                  ไม่มีประเภทงานบริการ
                </Text>

              </View>
            </View>

            <View style = {{margin:10}}>
              <Text>ไม่มีเวลาเปิด-ปิด </Text>
              
            </View>
         
       
            <View style = {{margin:10}}>
              <Text>
                ไม่มีงานที่ให้บริการ
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
    backgroundColor: '#3F51B5',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom:10,
    width: 100
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

