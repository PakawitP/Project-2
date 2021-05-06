import React,{ useState, useEffect,useCallback } from 'react';
import { SafeAreaView,Image,StyleSheet, Text, View ,ScrollView,RefreshControl,TouchableOpacity } from 'react-native';
import {Container,Left, Body,Right,Card,CardItem, Title, Header , Subtitle, Button,Icon} from 'native-base' 
//import { AntDesign } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import {Keyaut} from '../Keyaut'
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
//import { MaterialCommunityIcons } from '@expo/vector-icons';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};


export default function CommentC (props) {

  const {route} = props
  const { navigation } = props
  const {All} = route.params;
  // const { Key,All} = route.params;
  console.log(All)

  const [Ratingquality, setRatingquality] = useState(0);
  const [RatingPunctual, setRatingPunctual] = useState(0);
  const [Ratingcourtesy, setRatingcourtesy] = useState(0);
  const [RatingScharge, setRatingScharge] = useState(0);
  const [Ratingcontact, setRatingcontact] = useState(0);
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const starImageFilled =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
  const starImageCorner =
    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';


  // const KeyRef = React.useContext(Keyaut);
  const [refreshing, setRefreshing] = useState(false);
  // const [ShowName,setShowName] = useState()
  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalVisibleCD, setModalVisibleCD] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [Comment, setComment] = useState(null);
  // const [Point, setPoint] = useState(null);
  // const [App,setApp] = useState(null)




  useEffect(() => {
    getDataC();
  }, []);




  const getDataC = () =>{
    setRatingquality(All.Quality)
    setRatingPunctual(All.Punctual)
    setRatingcourtesy(All.Courtesy)
    setRatingScharge(All.Scharge)
    setRatingcontact(All.Contact)
    setComment(All.Comment)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
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
              >
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
              >
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
              >
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
              >
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
              >
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




if(dataSource == null ){
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
                <Title>ประเมินงาน</Title>
                <Subtitle>{All.WorkName}</Subtitle>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <Fontisto name="person" size={40} color="#FFFFFF" />
            </View>
          </View>
          
          {/* <Subtitle>{Name}</Subtitle> */}
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
            <Body>
                <CardItem>
                  <View>
                    <Right>
                      <Foundation name="graph-bar" size={50} color="#CA7004" />
                    </Right>
                    <Text style={{fontSize:18}}>
                      สรุปคะเเนนประเมิน
                    </Text>
                  </View>
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

              <Body><CardItem>
                  

                  <Text>
                   คะเเนนรวม  {All.Totle}  <FontAwesome name="star" size={30} color="#efce4a" />
                  </Text>
                
              </CardItem></Body>


              <View style ={{margin:5}}>
                <Card>
                  <CardItem>
                    <Text>
                      ความคิดเห็น
                    </Text>
                  </CardItem>
                  <CardItem>
                    <Text>
                      {All.Comment}
                    </Text>
                  </CardItem>
                </Card>
              </View>
            </Card>

           
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
        {/* <Title>รูปภาพการทำงาน</Title> */}
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
});

