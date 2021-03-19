import React, {useState,useEffect,useCallback} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Container,Left, Body,Right, Title, Header ,Icon, Button} from 'native-base' 
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions, Platform,RefreshControl,Alert,Text,Modal,TouchableHighlight
} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import EventCalendar from 'react-native-events-calendar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
let {width} = Dimensions.get('window') ;
import {Keyaut} from '../Keyaut'
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import { FontAwesome5 } from '@expo/vector-icons';
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


export default function ScheduleShow(props) {
  const { navigation } = props
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time,settime] = useState(0);
  const [DateS, setDateS] = useState('2020-01-01');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [Point, setPoint] = useState(null);
  const KeyRef = React.useContext(Keyaut);
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key).collection("Schedule");
  
  useEffect(() => {
    getData()
  }, [DateS,events]);

  const [events, setEvents] = useState([]);


  const getData = () =>{
    var Data = [];
    docRef
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          Data.push(doc.data());
        });
        setEvents(Data)
        Data = []
    });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    //getData();
    wait(300).then(() => setRefreshing(false));
  }, []);
  

  const onChange = (event, selectedDate) => {

    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');

    let date = currentDate.toDateString()
    let Dat = currentDate.getDate()
    if(Dat < 10){
      Dat = "0"+String(Dat)
    }else{
      Dat = String(Dat)
    }
    
    let Month = currentDate.getMonth()
    if(Month < 10){
      Month = "0"+String(Month+1)
    }else{
      Month = String(Month+1)
    }
    let Year = currentDate.getFullYear()
    let Data =String(Year) +"-"+Month+"-"+Dat
    setDateS(Data); 
    console.log(Data)
  };

  const evenfect = () =>{
    if(time == 1){
      return (
        <EventCalendar
          eventTapped={eventClicked}
          events={events}
          width={width}
          format24h={true}
          initDate={DateS}
          size={60}
          scrollToFirst
        />
    )
    }else{
      return (
        <EventCalendar
          eventTapped={eventClicked}
          events={events}
          width={width}
          format24h={true}
          size={60}
          scrollToFirst
        />
      )
    }
    
  }



  const eventClicked = (event) => {
    setModalVisible(!modalVisible)
    setPoint(event.Key)
    console.log(event.Key)
  };


  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
    settime(1);
  };


  // const getItem = (item) => {
  //   //alert('Id : '+ item.Key);
  //   //let Ref = docRef.doc(item.Key)
  //   setPoint(item.Key)
  //   setModalVisible(true)
  //   //console.log(Ref);
  
  //   //deleteDoc(Ref);
  // };
  
  const DeleteDoc = () =>{
    docRef.doc(Point).delete().then(function() {
      Alert.alert(
        "การดำเนินการ",
        "ลบเสร็จสิ้น")
      
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  } 
  
  const Editdoc = () => {
    navigation.navigate('ScheduleEdit',{Ref : Point})
  }


  return (
    <Container >
      <Header>
          <Left>
            <Button transparent onPress={() => navigation.toggleDrawer()}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{marginTop:12}}>
                <Title>ตารางนัดหมาย</Title>
              </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
                </View>
            </View>
          </Body>
          <Right>
            <Button transparent  onPress={() => navigation.navigate('Schedule')}> 
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button>
          </Right>
        </Header>
        
    <SafeAreaView style={styles.container} >
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
                        Editdoc();
                        setModalVisible(!modalVisible);
                      }}>
                      <Text style={styles.textStyle}>แก้ไข</Text>
                    </TouchableHighlight>

                    
                    <TouchableHighlight
                      style={{ ...styles.openButton, }}
                      onPress={() => {
                        
                        setModalVisibleCD(!modalVisibleCD);
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
                      style={{ ...styles.openButton,  }}
                      onPress={() => {
                        setModalVisibleCD(!modalVisibleCD);
                      }}>
                      <Text style={styles.textStyle}>ยกเลิก</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </Modal>
              



            </View>
      <View >
        <View>
           
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        {evenfect()}
        <View style = {{ margin:10}}><Button styles={{backgroundColor:"#3F51B5"}} Button full rounded onPress={showDatepicker}  >
          <Text styles={{color: 'white'}}>ค้นหาวันที่</Text></Button></View>
      </View>
    </SafeAreaView>
    </Container>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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