import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Image,StyleSheet, Text, View ,ScrollView,RefreshControl,TouchableOpacity, } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle,  Button,Icon,Textarea} from 'native-base' 
import { AntDesign } from '@expo/vector-icons'; 
// import { Entypo } from '@expo/vector-icons';
// import Swiper from 'react-native-swiper'
import Spinner from 'react-native-loading-spinner-overlay';
import { Fontisto } from '@expo/vector-icons';
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


export default function JobAnnouShowT (props) {

  const {route} = props
  const { navigation } = props
  const { Key,TKey,AKey ,Name,Tot} = route.params;

  console.log(Tot)

  const [Ratingquality, setRatingquality] = useState(0);
  const [RatingPunctual, setRatingPunctual] = useState(0);
  const [Ratingcourtesy, setRatingcourtesy] = useState(0);
  const [RatingScharge, setRatingScharge] = useState(0);
  const [Ratingcontact, setRatingcontact] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const starImageFilled =
    'https://firebasestorage.googleapis.com/v0/b/ftynaja.appspot.com/o/scr%2Fstar_filled.png?alt=media&token=de4c1794-33a7-4435-aed2-041cec70ea77';
  const starImageCorner =
    'https://firebasestorage.googleapis.com/v0/b/ftynaja.appspot.com/o/scr%2Fstar_corner.png?alt=media&token=3124dd51-ff4f-44cf-94b0-9e40a77523ff';

  const [loading, setLoading] = useState(false);
  const KeyRef = React.useContext(Keyaut);
  const [refreshing, setRefreshing] = useState(false);
  //const [ShowName,setShowName] = useState()
  //const [modalVisible, setModalVisible] = useState(false);
  //const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [Comment, setComment] = useState("");
  const [Point, setPoint] = useState(null);
  const [App,setApp] = useState(null)
  var docRef = firebase.firestore().collection("announce").doc(AKey)
  var docRefT = firebase.firestore().collection("users").doc(TKey)
  var docRefC = firebase.firestore().collection("Comment").doc(Key)



  useEffect(() => {
    getDataA();
    getDataT();
    getDataC();
  }, [App != null,dataSource != null]);


  const getDataA = () =>{
    docRef.get().then(function(doc) {
      if (doc.exists) {
          setDataSource(doc.data())
          //console.log(doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  }

  const getDataT = () =>{
    docRefT.get().then(function(doc) {
      if (doc.exists) {
          setApp(doc.data())
          //console.log(doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }

  const getDataC = () =>{
    setRatingquality(Tot.Quality)
    setRatingPunctual(Tot.Punctual)
    setRatingcourtesy(Tot.Courtesy)
    setRatingScharge(Tot.Scharge)
    setRatingcontact(Tot.Contact)
    setComment(Tot.Comment)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDataA();
    getDataT();
    getDataC();
    wait(300).then(() => setRefreshing(false));
  }, []);

  const Punctual = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setRatingPunctual(item)}>
              <Image
                style={styles.starImageStyle}
                source={
                  item <= RatingPunctual
                    ? { uri: starImageFilled }
                    : { uri: starImageCorner }
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const Quality = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setRatingquality(item)}>
              <Image
                style={styles.starImageStyle}
                source={
                  item <= Ratingquality
                    ? { uri: starImageFilled }
                    : { uri: starImageCorner }
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const Courtesy = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setRatingcourtesy(item)}>
              <Image
                style={styles.starImageStyle}
                source={
                  item <= Ratingcourtesy
                    ? { uri: starImageFilled }
                    : { uri: starImageCorner }
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const Scharge = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setRatingScharge(item)}>
              <Image
                style={styles.starImageStyle}
                source={
                  item <= RatingScharge
                    ? { uri: starImageFilled }
                    : { uri: starImageCorner }
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const Contact = () => {
    return (
      <View style={styles.customRatingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setRatingcontact(item)}>
              <Image
                style={styles.starImageStyle}
                source={
                  item <= Ratingcontact
                    ? { uri: starImageFilled }
                    : { uri: starImageCorner }
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };


const Doc = () =>{    
  setLoading(true)
  docRefC.set({
    Quality: Ratingquality,
    Punctual: RatingPunctual,
    Courtesy: Ratingcourtesy,
    Scharge: RatingScharge,
    Contact:Ratingcontact,
    Totle:(Ratingquality+RatingPunctual+Ratingcourtesy+RatingScharge+Ratingcontact)/5,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    Comment: Comment,
    status:true,
  }, { merge: true }).then(function() {
    setLoading(false)
    navigation.navigate('CCommentShow')
  })
} 



if(dataSource != null && App != null){
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
            <View style={{marginTop:5}}>
              <Title>ประเมินงาน</Title>
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

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style ={{margin:5}}>
            <Card>
              <CardItem>
                <View>
                  <Text >
                    ชื่องาน {dataSource.announceName}
                  </Text>
                </View>
              </CardItem>
      
              <CardItem>
                <Text >
                  คำอธิบายงาน {dataSource.announceExplain} 
                </Text>
              </CardItem>

              <CardItem>
                <Text >
                  เปลี่ยนแปลงล่าสุด {dataSource.createdAt.toDate().toLocaleTimeString()} {dataSource.createdAt.toDate().toLocaleDateString()}
                </Text>
              </CardItem>

            </Card>

            <Card>
              
                <Body>
                <View style={{margin:10}}>
                  <Text >
                    ผู้รับทำงาน
                  </Text>
                </View>

                <Image source={ {uri:App.Photo} } style={{ width: 150, height: 200,margin:10}} ></Image>

                <View style={{margin:10}}>
                  <Text >
                   ชื่อช่าง {App.Name}
                  </Text>
                </View>
              </Body>
             
            </Card>
            <Card>
            <Body>
              <CardItem>   
                <Text>
                  การคะเเนนเเละประเมินงาน
                </Text>
              </CardItem>
            </Body>
            
            <CardItem>
                <Left>
                  <View style={{marginTop:30}}>
                    <Text>
                      คุณภาพของงาน
                    </Text>
                  </View>
                </Left>
                <Right>
                  {Quality()}
                </Right>
                
              </CardItem>

              <CardItem>
                <Left>
                  <View style={{marginTop:30}}>
                    <Text>
                      ตรงต่อเวลา 
                    </Text>
                  </View>
                </Left>
                <Right>
                  {Punctual()}
                </Right>
              </CardItem>

              <CardItem>
                <Left>
                  <View style={{marginTop:30}}>
                    <Text>
                      บริการ/มารยาท
                    </Text>
                  </View>
                </Left>
                <Right>
                  {Courtesy()}
                </Right>
              </CardItem>

              <CardItem>
                <Left>
                  <View style={{marginTop:30}}>
                    <Text>
                      ค่าบริการ
                    </Text>
                  </View>
                </Left>
                <Right>
                  {Scharge()}
                </Right>
              </CardItem>

              <CardItem>
                <Left>
                  <View style={{marginTop:30}}>
                    <Text>
                      ความสะดวกในการติดต่อ
                    </Text>
                  </View>
                </Left>
                <Right>
                  {Contact()}
                </Right>
              </CardItem>
            
            <View style = {{margin:10}}>
              <Textarea  rowSpan={4} bordered placeholder="ความคิดเห็น" 
                value = {Comment}
                onChangeText={(g)=>setComment(g)}/>
           </View>

              
            </Card>
            <Button  full rounded    style ={{marginTop: 10, margin:20,backgroundColor:"#CA7004"}}
             onPress = {Doc} >
              <Text style = {{color: '#FFFFFF',textAlign:'center'}}> บันทึก </Text>
            </Button>
          </View>
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
    backgroundColor: '#FE9D09',
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
  swiper: {
    height: 200
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyleSmall: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 15,
  },
  buttonStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    padding: 15,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  starImageStyle: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

