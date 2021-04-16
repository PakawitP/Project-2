import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,StyleSheet, Text, View ,Alert, Modal,ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,Button,Icon} from 'native-base' 
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import Spinner from 'react-native-loading-spinner-overlay';
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


export default function JobAnnouShowT (props) {

  const {route} = props
  const { navigation } = props
  const { KeyJ,KeyAnnou ,Name} = route.params;

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisibleR, setModalVisibleR] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [dataSourceJ, setDataSourceJ] = useState(null);
  const [dataSourceV, setDataSourceV] = useState([]);

  var docRefJ = firebase.firestore().collection("JobStatus").doc(KeyJ)
  var docRef = firebase.firestore().collection("announce").doc(KeyAnnou)
  var docRefC = firebase.firestore().collection("Comment")
  var docRefU = firebase.firestore().collection("users")
  var docReprog = firebase.firestore().collection("JobStatus").doc(KeyJ).collection("progress")

  useEffect(() => {
    getData();
    getProgress();
  }, [dataSource != null]);

  const getData = () =>{
    docRefJ.get().then(function(doc) {
      if (doc.exists) {
          setDataSourceJ(doc.data())
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
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
        if(dataSourceJ.Techicianpetition != dataSourceJ.Custommerpetition && dataSourceJ.Techicianpetition == "cancle"){
          setModalVisibleR(true)
        }
        else if(dataSourceJ.Techicianpetition != dataSourceJ.Custommerpetition && dataSourceJ.Techicianpetition == "completed"){
          setModalVisibleCD(true)
        }
        
      }
    })

  
  }

  const getProgress = () =>{
    var dat = []
    docReprog.orderBy("persen").get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            dat.push(doc.data());
        });
        setDataSourceV(dat)
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });


  }



  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    getProgress();
    wait(300).then(() => setRefreshing(false));
  }, []);


  ///////////////////////////////////////////////////////////////
  const gettoken = (r) =>{
    docRefU.doc(dataSourceJ.TechicianKey).get().then(function(doc) {
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
  docRefU.doc(dataSourceJ.TechicianKey).get().then(function(doc) {
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
  setLoading(true)
  gettoken(c)
  docRefJ.set({
    Custommerpetition: "cancle",
   // stus:"ขอยกเลิกงาน",
  }, { merge: true }).then(() => {
    Alert.alert(
      "การดำเนินการ",
      "ขอยกเลิกสำเร็จ")
  }).then(()=>{
    setLoading(false)
    navigation.navigate('StatusWork')
  })
}

const Rcancle = (R) =>{
  setLoading(true)
  if(R == "Y"){
    let y = 'การขอยกเลิกงานได้รับการยืนยัน'
    gettokenT(y)
    docRefJ.set({
      Custommerpetition: "cancle",
    }, { merge: true }).then(()=>{
      const uid = docRefC.doc().id
      docRefC.doc(uid).set({
      Workstatus: "งานถูกยกเลิก",
      CustommerKey:dataSourceJ.CustommerKey,
      TechicianKey:dataSourceJ.TechicianKey,
      WorkName:dataSourceJ.WorkName,
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
    setLoading(true)
    let y = 'ถูกปฎิเสธการขอยกเลิก'
    gettoken(y)
    docRefJ.set({
      Techicianpetition: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     // stus:"การขอยกเลิกถูกปฎิเสธ",
    }, { merge: true })
    // .then(()=>{
    //   navigation.navigate('StatusWork')
    // })
  }
  setLoading(false)
}

const Rcompleted = (R) =>{
  setLoading(true)
  if(R == "Y"){
    let n = 'การขอสำเร็จงานได้รับการยืนยัน'
    gettokenT(n)
    docRefJ.set({
      Custommerpetition: "completed",
    }, { merge: true }).then(()=>{
      const uid = docRefC.doc().id
      docRefC.doc(uid).set({
      Workstatus: "งานสำเร็จ",
      CustommerKey:dataSourceJ.CustommerKey,
      TechicianKey:dataSourceJ.TechicianKey,
      WorkName:dataSourceJ.WorkName,
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
      docRefU.doc(dataSourceJ.TechicianKey).set({
        WorkSuccess: firebase.firestore.FieldValue.increment(1),
      }, { merge: true })
    }).then(()=>{
      setLoading(false)
      navigation.navigate('StatusWork')
    })
  }
  if(R == "N"){
    let n = 'ถูกปฎิเสธการขอสำเร็จงาน'
    gettoken(n)
    docRefJ.set({
      Techicianpetition: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     // stus:"การขอเสร็จสิ้นถูกปฎิเสธ",
    }, { merge: true })
    // .then(()=>{
    //   navigation.navigate('StatusWork')
    // })
  }
  setLoading(false)
}

// const Stus = ()=>{
//   if(dataSourceJ.status == "รอช่างยืนยัน"){
//     return (
//       <Text>
//         รอช่างยืนยันการทำงาน
//       </Text>
//     )
//   }
//   if(dataSourceJ.status == "กำลังดำเนินการ"){
//     return (
//       <Text>
//         {dataSourceJ.stus}
//       </Text>
//     )
//   }
// }

const ButtonG = () =>{
  if(dataSourceJ.status =="รอช่างยืนยัน"){
    return(<Text></Text>)
  }else{
    return(
      <View style = {{alignItems:'center', marginTop:20}}>
        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true)
            
          }}>
          <Text style={styles.textStyle}>ยกเลิกงาน</Text>
        </TouchableHighlight>
      </View>
    )
  }
  
}

const ItemView = (item, key) => {
  return (
    <TouchableHighlight View key={key} style ={{margin:5}} onLongPress = {() => {setPoint(item.key);setModalVisibleG(true)}}>
      <View>
        <Text style={{...styles.itemStyle,marginLeft:20}}>
          เวลา {item.createdAt.toDate().toLocaleTimeString()} วันที่ {item.createdAt.toDate().toLocaleDateString()}
        </Text>
        <Text style={{...styles.itemStyle,marginLeft:20}}>
          ความคืบหน้าของงาน {item.persen} %
        </Text>
        
        <Text style={{...styles.itemStyle,marginLeft:20}}>
          รายละเอียด/อธิบาย {item.progress} 
        </Text>
        {ItemSeparatorView()}
      </View>
    </TouchableHighlight>
  
  );
};

const ItemSeparatorView = () => {
  return (
    // Flat List Item Separator
    <View style={styles.itemSeparatorStyle} />
  );
};

const countarray = () =>{
  if(dataSourceV.length > 0)
    return(
      <View>
        <Card> 
          <View style = {{alignItems:'center',margin:10}}>
            <Text style={{fontSize:16}}>
              ความคืบหน้าของงาน
            </Text>
          </View>
            {dataSourceV.map(ItemView)}
        </Card>
      </View>
    )
}


if(dataSource != null && dataSourceJ != null){
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
            <Title>สถานะงาน</Title>
                  <Subtitle>{Name}</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
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
              <Body style={{flexDirection:'row',marginTop:10}}>
                <AntDesign name="creditcard" size={24} color="#CA7004" />
                <Text style={{fontSize:16}}>
                  {"\t"}รายละเอียดงาน
                </Text>
              </Body>
              <CardItem>
                <Text>
                  ชื่องาน {dataSource.announceName}
                </Text>
              </CardItem>
              <CardItem>
                <Text>
                  อธิบายงาน/รายละเอียดงาน {dataSource.announceExplain}
                </Text>
              </CardItem>
              <CardItem>
                {/* <Text>
                  สถานะงานปัจจุบัน {dataSourceJ.status}{"\n"}ความคืบหน้า {Stus()}
                </Text> */}
              </CardItem>
              {/* <CardItem>
                <Text>
                  เปลี่ยนแปลงเมื่อ {dataSourceJ.createdAt.toDate().toLocaleTimeString()} {dataSourceJ.createdAt.toDate().toLocaleDateString()}
                </Text>
              </CardItem> */}
            </Card>
          </View>

          {/* <View style={{flex:1}}> */}

          {countarray()}
          {ButtonG()}
          
          {/* </View> */}

        
        <Spinner
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>ขอยกเลิกงาน</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setModalVisible(!modalVisible)
                  cancle()
                }}>
                <Text style={styles.textStyle}>ยืนยัน</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton,}}
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
              <Text style={styles.modalText}>คำขอเสร็จสิ้นงาน</Text>

              <TouchableHighlight
                style={{ ...styles.openButton,}}
                onPress={() => {
                  setModalVisibleCD(!modalVisibleCD)
                  Rcompleted("Y")
                }}>
                <Text style={styles.textStyle}>ตกลง</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton, }}
                onPress={() => {
                  setModalVisibleCD(!modalVisibleCD)
                  Rcompleted("N")
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
                style={{ ...styles.openButton,}}
                onPress={() => {
                  Rcancle("Y")
                  setModalVisibleR(!modalVisibleR)
                  
                }}>
                <Text style={styles.textStyle}>ตกลง</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{ ...styles.openButton,}}
                onPress={() => {
                  Rcancle("N")
                  setModalVisibleR(!modalVisibleR)
                }}>
                <Text style={styles.textStyle}>ยกเลิก</Text>
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
    <Header style ={{backgroundColor: "#CA7004"}}>
      <Left>
        <Button transparent onPress={() => navigation.toggleDrawer()}>
          <Icon name='menu'  />
        </Button>
      </Left>
      <Body>
        <Title></Title>
      </Body>
      <Right>
        {/* <Button transparent onPress={() => navigation.navigate('WorkPicture')}>
          < AntDesign name="edit" size={24} color="#FFFFFF" />
        </Button> */}
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
    backgroundColor: '#CA7004',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom:10,
    width: 130
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
  spinnerTextStyle: {
    color: '#FFF',
  },
});

