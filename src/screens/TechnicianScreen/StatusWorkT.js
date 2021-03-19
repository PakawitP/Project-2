import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Alert,StyleSheet, Text, View , Modal,ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle, Button,Icon,Label,Textarea,Content} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
import Spinner from 'react-native-loading-spinner-overlay';
import {Keyaut} from '../Keyaut'
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
import { FontAwesome5 } from '@expo/vector-icons';;
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};


export default function JobAnnouShowT (props) {
  const KeyRef = React.useContext(Keyaut);
  const {route} = props
  const { navigation } = props
  const { KeyJ,KeyAnnou ,Name} = route.params;
  let Key = KeyRef.key
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisibleR, setModalVisibleR] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [modalVisibleW, setModalVisibleW] = useState(false);
  const [modalVisibleWC, setModalVisibleWC] = useState(false);
  const [modalVisibleCon, setModalVisibleCon] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [Contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataSourceJ, setDataSourceJ] = useState(null);
  var docRefJ = firebase.firestore().collection("JobStatus").doc(KeyJ)
  var docRef = firebase.firestore().collection("announce").doc(KeyAnnou)
  var docRefC = firebase.firestore().collection("Comment")
  var docRefU = firebase.firestore().collection("users")

  useEffect(() => {
    getData();
  }, [dataSource != null]);

  const getData = () =>{
    docRefJ.get().then(function(doc) {
      if (doc.exists) {
          setDataSourceJ(doc.data())
          if(doc.data().ConfirmKey != null){
            if(doc.data().ConfirmKey != Key)
              setModalVisibleCon(true)
          }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).then(()=>{
      if(dataSourceJ != null)
        setContact(dataSourceJ.stus)
      
    });

    docRef.get().then(function(doc) {
      if (doc.exists) {
          setDataSource(doc.data())
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).then(function(){
      if(dataSourceJ != null){
        if(dataSourceJ.Techicianpetition != dataSourceJ.Custommerpetition && dataSourceJ.Custommerpetition == "cancle"){
          setModalVisibleR(true)
        }
      }
    })

  
  }



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(300).then(() => setRefreshing(false));
  }, []);


  ///////////////////////////////////////////////////////////////
  const gettoken = (r) =>{
    docRefU.doc(dataSourceJ.CustommerKey).get().then(function(doc) {
      if (doc.exists) {
          sendPushNotification(doc.data().token,r)
      } else {
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
  
  async function sendPushNotification(token,r) {
    const message = {
      to: token,
      sound: 'default',
      title: 'ตรวจสอบสถานะงานของคุณ',
      body: 'งาน '+dataSourceJ.WorkName+r,
      
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
/////////////////////////////////////////////////////////

const gettokenT = (r) =>{
  docRefU.doc(dataSourceJ.CustommerKey).get().then(function(doc) {
    if (doc.exists) {
        sendPushNotificationT(doc.data().token,r)
    } else {
        console.log("No such document!");
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}

async function sendPushNotificationT(token,r) {
  const message = {
    to: token,
    sound: 'default',
    title: 'งาน '+dataSourceJ.WorkName,
    body: r,
    
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

/////////////////////////////////////////////////////

const cancle = () =>{
  let c = 'ถูกขอยกเลิกงาน'
  gettoken(c)
  docRefJ.set({
    Techicianpetition: "cancle",
    stus:"ขอยกเลิกงาน",
  }, { merge: true }).then(() => {
    Alert.alert(
      "การดำเนินการ",
      "ขอยกเลิกสำเร็จ")
    //alert('ขอยกเลิกสำเร็จ')
    setLoading(false)
    navigation.navigate('StatusWork')
  })
}

const completed = () =>{
  let c = 'ถูกขอสำเร็จงานงาน'
  gettoken(c)
  docRefJ.set({
    Techicianpetition: "completed",
    stus:"ขอสำเร็จงาน",
  }, { merge: true }).then(() => {
    Alert.alert(
      "การดำเนินการ",
      "ขอยืนยืนสำเร็จ")
    //alert('ขอยืนยืนสำเร็จ')
    setLoading(false)
    navigation.navigate('StatusWork')
  })
}

const Rcancle = (R) =>{
  if(R == "Y"){
    let y = 'การขอยกเลิกงานได้รับการยืนยันให้คะเเนนช่างในเมนูการประเมิน'
    gettokenT(y)
    docRefJ.set({
      Techicianpetition: "cancle",
    }, { merge: true }).then(()=>{
      const uid = docRefC.doc().id
      docRefC.doc(uid).set({
      Workstatus: "งานถูกยกเลิก",
      CustommerKey: dataSourceJ.CustommerKey,
      TechicianKey: dataSourceJ.TechicianKey,
      WorkName: dataSourceJ.WorkName,
      KeyAnnou: dataSourceJ.KeyAnnou,
      Quality: 0,
      Punctual: 0,
      Courtesy: 0,
      Scharge: 0,
      Contact:0,
      Totle:0,
      status:false,
      Key: uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
      },{ merge: true }) 
      .then(()=>{
        setLoading(false)
        navigation.navigate('StatusWork')
      })
    })
  }
  if(R == "N"){
    let y = 'ถูกปฎิเสธการขอยกเลิก'
    gettoken(y)
    docRefJ.set({
      Custommerpetition: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      stus:"การขอยกเลิกถูกปฎิเสธ",
    }, { merge: true })
    setLoading(false)
  }
}

const Getjob = () =>{
  let y = 'มีผู้รับทำงานเเล้ว'
    gettoken(y)
  docRefJ.set({
    status: "กำลังดำเนินการ",
    TechicianKey:Key,
    ConfirmKey:Key,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    stus:"เริ่มทำงาน"
  }, { merge: true }).then(()=>{
    docRef.set({
      announceStatus: true,
    }, { merge: true })
  }).then(()=>{
    Alert.alert(
      "การดำเนินการ",
      "รับทำงานสำเร็จ")
    //alert('ขอยืนยืนสำเร็จ')
    setLoading(false)
    navigation.navigate('StatusWork')
  })
}

const Canclejob = () =>{
  docRefJ.delete().then(function(){
    navigation.navigate('StatusWork')
  })
  setLoading(false)
}

const kaw =() =>{
  if(dataSourceJ.status != "รอช่างยืนยัน"){
    return(
      <CardItem>
      <Content padder>
        <Label style={{fontSize:14}}>บันทึกความคืบหน้า</Label>
          <Textarea  rowSpan={4} bordered 
          value = {Contact}
          onChangeText={(g)=>setContact(g)}/>
      </Content>
    </CardItem>
    
    );
  }
}

const Savekaw = () =>{
  if(dataSourceJ.status != "รอช่างยืนยัน"){
    return(
      <CardItem>
        <TouchableHighlight
          style={styles.openButtonT}
          onPress={() => {
            docRefJ.set({
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              stus:Contact
            }, { merge: true }).then(()=>{
              Alert.alert(
                "การดำเนินการ",
                "บันทึกความคืบหน้าเสร็จสิ้น",)
            })
          }}>
          <Text style={styles.textStyle}>บันทึกความคืบหน้า</Text>
        </TouchableHighlight>
      </CardItem>
    );
  }
}

const ButtonS = () =>{
  if(dataSourceJ.status != "รอช่างยืนยัน"){
    return(
      <View style = {{alignItems:'center', marginTop:20}}>
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true)
            
          }}>
          <Text style={styles.textStyle}>งานเสร็จสิ้น</Text>
        </TouchableHighlight>
      </View>
      
    )
  }else{
    return(
      <View style = {{alignItems:'center', marginTop:20}}>
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisibleW(true)
          }}>
          <Text style={styles.textStyle}>รับทำงาน</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const ButtonSS = () =>{
  if(dataSourceJ.status != "รอช่างยืนยัน"){
    return(
      <View style = {{alignItems:'center',marginTop:15}}>
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisibleCD(true)
            
          }}
          >
          <Text style={styles.textStyle}>ยกเลิกงาน</Text>
        </TouchableHighlight>
      </View>
    )
  }else{
    return(
      <View style = {{alignItems:'center', marginTop:20}}>
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisibleWC(true)
          }}>
          <Text style={styles.textStyle}>ไม่รับทำงาน</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const Stus = ()=>{
  if(dataSourceJ.status == "รอช่างยืนยัน"){
    return (
      <Text>
        รอช่างยืนยันการทำงาน
      </Text>
    )
  }
  if(dataSourceJ.status == "กำลังดำเนินการ"){
    return (
      <Text>
        {dataSourceJ.stus}
      </Text>
    )
  }
}




if(dataSource != null && dataSourceJ != null){
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
              <Title>สถานะงาน</Title>
              <Subtitle>{Name}</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>
        </Body>
        <Right>
          {/* <Button transparent onPress={() => navigation.navigate('WorkPicture')}>
            < AntDesign name="edit" size={24} color="#FFFFFF" />
          </Button> */}
        </Right>
      </Header>

      <SafeAreaView style={{ flex: 1 ,margin:5 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={styles.container}>
            <Card>
              <CardItem>
                <Text>
                  ชื่องาน {dataSource.announceName}
                </Text>
              </CardItem>
              <CardItem>
                <Text>
                  อธิบายงาน {dataSource.announceExplain}
                </Text>
              </CardItem>
              <CardItem>
                <Text>
                  ชื่อผู้จ้างงาน {dataSourceJ.NameCustommer}
                </Text>
              </CardItem>
              <CardItem>
                <Text>
                สถานะงานปัจจุบัน {dataSourceJ.status}{"\n"}ความคืบหน้า {Stus()}
                </Text>
                
              </CardItem>
              <CardItem>
                <Text>
                  เปลี่ยนแปลงเมื่อ {dataSourceJ.createdAt.toDate().toLocaleTimeString()} {dataSourceJ.createdAt.toDate().toLocaleDateString()}
                </Text>
              </CardItem>
              {/* <CardItem>
                <Content padder>
                  <Label style={{fontSize:14}}>บันทึกความคืบหน้า</Label>
                    <Textarea  rowSpan={4} bordered 
                    value = {Contact}
                    onChangeText={(g)=>setContact(g)}/>
                </Content>
              </CardItem>
              <CardItem>
                <TouchableHighlight
                  style={styles.openButtonT}
                  onPress={() => {
                    docRefJ.set({
                      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                      stus:Contact
                    }, { merge: true })
                    
                  }}>
                  <Text style={styles.textStyle}>บันทึกความคืบหน้า</Text>
                </TouchableHighlight>

                {Savekaw()}
                
              </CardItem> */}
              {kaw()}
              {Savekaw()}
            </Card>
          </View>

          {/* <View style={{flex:1}}> */}
            {ButtonS()}
            {ButtonSS()}
            
          {/* </View> */}

        
        
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisibleCD(!modalVisible)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>ขอสถานะงานเสร็จสิ้น</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setLoading(true)
                  setModalVisible(!modalVisible)
                  completed()
                }}>
                <Text style={styles.textStyle}>ยืนยัน</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setModalVisible(!modalVisible)
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
            setModalVisibleCD(!modalVisibleCD)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>ขอยกลิกงาน</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setLoading(true)
                  setModalVisibleCD(!modalVisibleCD)
                  cancle()
                }}>
                <Text style={styles.textStyle}>ยืนยัน</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setModalVisibleCD(!modalVisibleCD)
                }}>
                <Text style={styles.textStyle}>ยกเลิก</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleR}
          onRequestClose={() => {
            setModalVisibleR(!modalVisibleR)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>คำขอยกเลิกงาน</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setLoading(true)
                  Rcancle("Y")
                  setModalVisibleR(!modalVisibleR)
                  
                }}>
                <Text style={styles.textStyle}>ตกลง</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setLoading(true)
                  Rcancle("N")
                  setModalVisibleR(!modalVisibleR)
                }}>
                <Text style={styles.textStyle}>ไม่ตกลง</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleW}
          onRequestClose={() => {
            setModalVisibleW(!modalVisibleW)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>รับทำงาน</Text>

              <TouchableHighlight
                style={{ ...styles.openButton,}}
                onPress={() => {
                  setLoading(true)
                  Getjob()
                  setModalVisibleW(!modalVisibleW)
                  
                }}>
                <Text style={styles.textStyle}>ยืนยัน</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton,}}
                onPress={() => {
                  setModalVisibleW(!modalVisibleW)
                }}>
                <Text style={styles.textStyle}>ยกเลิก</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleWC}
          onRequestClose={() => {
            setModalVisibleWC(!modalVisibleWC)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>ไม่รับรับทำงาน</Text>

              <TouchableHighlight
                style={{ ...styles.openButton,  }}
                onPress={() => {
                  Canclejob()
                  setModalVisibleWC(!modalVisibleWC)
                  setLoading(true)
                }}>
                <Text style={styles.textStyle}>ยืนยัน</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setModalVisibleWC(!modalVisibleWC)
                }}>
                <Text style={styles.textStyle}>ยกเลิก</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleCon}
          onRequestClose={() => {
            setModalVisibleCon(!modalVisibleCon)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>งานถูกทำไปเเล้ว</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setLoading(true)
                  Canclejob()
                  setModalVisibleCon(!modalVisibleCon)
                  
                }}>
                <Text style={styles.textStyle}>ยืนยัน</Text>
              </TouchableHighlight>

            </View>
          </View>
        </Modal>


        <Spinner
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
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
        <Title>สถานะงาน</Title>
      </Body>
      <Right>
        <Button transparent onPress={() => navigation.navigate('WorkPicture')}>
          < AntDesign name="edit" size={24} color="#FFFFFF" />
        </Button>
      </Right>
    </Header>

  </Container>

  
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    width: 130
  },
  openButtonT: {
    backgroundColor: '#3F51B5',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom:10,
    width: 150,
    flex:1
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
  swiper: {
    height: 200
  },
  boxinput:{
    marginRight: 20,
    marginTop:15,
    marginLeft:20,
  }
});
