import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Image,StyleSheet, Text, View ,Alert, Modal,ScrollView,RefreshControl,TouchableHighlight } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Button,Icon} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
//import { Entypo } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import { FontAwesome5 } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};


export default function WorkPictureShow (props) {
  const KeyRef = React.useContext(Keyaut);
  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  const [Show,setShow] = useState(0)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [Point, setPoint] = useState(null);
  var cities = [];
  var docRef = firebase.firestore().collection("users").doc(KeyRef.key).collection("WorkingPicture");

  
  useEffect(() => {
    getData();
  }, []);

  const getData = () =>{
    var cities = [];
    docRef.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            cities.push(doc.data());
        });
        setDataSource(cities)
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    setShow(1)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    wait(300).then(() => setRefreshing(false));
  }, []);


const ItemView = (item, key) => {
  return (
    // Flat List Item
    <TouchableHighlight View key={key} style ={{margin:5}} onLongPress = {() => getItem(item)}>
      <Card>
        <CardItem>
          <Image source={{uri:item.Photo}} style={{ width: 350, height: 200 }}/>
        </CardItem>

        <CardItem>
          <Text style={styles.itemStyle}>
            <AntDesign name="filetext1" size={24} color="#3F51B5" /> {item.PhotoExplain}
          </Text>
        </CardItem>
      </Card>


    </TouchableHighlight>
  );
};



const getItem = (item) => {
  //alert('Id : '+ item.Key);
  //let Ref = docRef.doc(item.Key)
  setPoint(item.Key)
  setModalVisible(true)
  //console.log(Ref);

  //deleteDoc(Ref);
};

const DeleteDoc = () =>{
  docRef.doc(Point).delete().then(function() {
    Alert.alert(
      "การดำเนินการ",
      "ลบเสร็จสิ้น",)
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
} 

const Editdoc = () => {
  navigation.navigate('WorkPictureEdit',{Ref : Point})
}

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
              <Title>รูปภาพการทำงาน</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
            </View>
          </View>

          
        </Body>
        <Right>
          <Button transparent onPress={() => navigation.navigate('WorkPicture')}>
            < AntDesign name="edit" size={24} color="#FFFFFF" />
          </Button>
        </Right>
      </Header>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
                  style={{ ...styles.openButton}}
                  onPress={() => {
                    Editdoc();
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>แก้ไข</Text>
                </TouchableHighlight>

                
                <TouchableHighlight
                  style={{ ...styles.openButton}}
                  onPress={() => {
                    setModalVisibleCD(true);
                    //DeleteDoc();
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>ลบ</Text>
                </TouchableHighlight>


                <TouchableHighlight
                  style={{ ...styles.openButton,}}
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
                  style={{ ...styles.openButton,}}
                  onPress={() => {
                    DeleteDoc();
                    setModalVisibleCD(!modalVisibleCD);
                  }}>
                  <Text style={styles.textStyle}>ตกลง</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{ ...styles.openButton,}}
                  onPress={() => {
                    setModalVisibleCD(!modalVisibleCD);
                  }}>
                  <Text style={styles.textStyle}>ยกเลิก</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
          <View style={styles.container}>
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
              <View style={{marginTop:12}}>
                <Title>รูปภาพการทำงาน</Title>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
              </View>
            </View>
          </Body>
          <Right>
            <Button transparent onPress={() => navigation.navigate('WorkPicture')}>
              < AntDesign name="edit" size={24} color="#FFFFFF" />
            </Button>
          </Right>
        </Header>
        
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
                      <View style={{flex:1,alignItems:'center'}}>
                        <Text>ไม่มีรูปภาพ</Text>
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

