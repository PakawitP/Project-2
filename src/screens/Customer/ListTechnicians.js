import React,{ useState, useEffect,useCallback} from 'react';
import { SafeAreaView,Platform,Image,StyleSheet, Text, View ,Modal  ,ScrollView,RefreshControl,TouchableHighlight,CheckBox} from 'react-native';
import {Container,Left, Body,Right, Title, Header ,Card, CardItem, Button,Icon,} from 'native-base' 
import { FontAwesome } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { SearchBar } from 'react-native-elements';
import { firebaseConfig } from './firebaseConfig.js';
import { Fontisto } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
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

export default function ListTechnicians (props) {
  
  const { navigation } = props
  const [refreshing, setRefreshing] = useState(false);
  const [Show,setShow] = useState(0)
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceT, setDataSourceT] = useState([]);
  const [Glocation, setGLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [Motorcycle, setMotorcycle] = useState(false);
  const [Electrician, setElectrician] = useState(false);
  const [Electricity, setElectricity] = useState(false);
  const [TotleT, setTotleT] = useState(true);
  var docRef = firebase.firestore().collection("users");

  
  useEffect(() => {

    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setGLocation(location);
 
    })();

    getdata();
  }, []);

  
  const getdata = () => {
    var cities = [];
    docRef.where("Occupations.Technician", "==", true)
    .onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            cities.push(doc.data());
        })
        setDataSource(cities)
        setDataSourceT(cities)
        cities = []
    });
    setShow(1)
   
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getdata();
    wait(300).then(() => setRefreshing(false));
  }, []);


  const Distance = (latitude,longitude) =>{
    let Long = longitude - Glocation.coords.longitude
    let dist = Math.sin( latitude* Math.PI / 180) * Math.sin(Glocation.coords.latitude* Math.PI / 180)
              + Math.cos( latitude* Math.PI / 180) * Math.cos(Glocation.coords.latitude* Math.PI / 180)
              * Math.cos(Long* Math.PI / 180)
        dist = Math.acos(dist)
        dist = dist * Math.PI / 180   
        dist = dist * 60 * 1.1515
        dist = dist * 6371
    return dist
  }


  const SortDistance = (CC) =>{
    let SortD =  CC.sort((a, b) => 
      Distance(a.latlong.latitude,a.latlong.longitude)-Distance(b.latlong.latitude,b.latlong.longitude))
      // parseFloat(Math.sqrt(Math.pow( b.latlong.latitude,2) + Math.pow( b.latlong.longitude,2))) - 
      // parseFloat(Math.sqrt(Math.pow( a.latlong.latitude,2) + Math.pow ( a.latlong.longitude,2))));
    setDataSource(SortD)
  }
  
  const SortPoint = (CC) =>{
    let SortP = CC.sort((a, b) => parseFloat(b.TotalScore) - parseFloat(a.TotalScore));
    setDataSource(SortP)

  }

  const SortOcc = () =>{
    let Occupations = []
    dataSourceT.map((dataSourceT) =>{
      if(Motorcycle == true){
        if(dataSourceT.Occupations.Motorcycle == true){
          Occupations.push(dataSourceT)
        }
        
      }
      else if(Electrician == true){
        if(setDataSourceT.Occupations.Electrician == true){
          Occupations.push(dataSourceT)
        }
      }
      else if(Electricity == true){
        if(dataSourceT.Occupations.Electricity == true){
          Occupations.push(dataSourceT)
        }
      }
      else{
        Occupations.push(dataSourceT)
      }
      setDataSource(Occupations)
      //console.log(dataSource.Occupations.Electrician)
    })
  }


  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = dataSource.filter(function (item) {
        const itemData = item.Name
          ? item.Name.toUpperCase()
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
  if(item.Verify == true){
    return (
      <TouchableHighlight  key={key} style ={{margin:5}} onPress = {() => navigation.navigate('MyTabs',{ Tkey: item.Key })}>
        <Card>
          <CardItem>
            <Left><View>
              <Image source={{uri:item.Photo}} style={{ width:150 , height: 200 ,marginTop : 10}}/>
              <Right><Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/ftynaja.appspot.com/o/scr%2F73-730077_verify-users-via-e-mail-verified-user.png?alt=media&token=da5457d9-6260-4b42-b2e4-048eef031663"}} style={{ width:30 , height: 30 }}/></Right></View>
            </Left>
            <Body>
              <Text style={styles.itemStyle}>
                ชื่อ {item.Name}
              </Text>
              <Text style={styles.itemStyle}>
                {item.Occupations.Motorcycle ? " ช่างซ่อมรถจักรยานยนต์\n" : null} 
                {item.Occupations.Electrician ? " ช่างซ่อมเครื่องใช้ไฟฟ้า\n" : null}
                {item.Occupations.Electricity ? " ช่างซ่อมไฟฟ้า\n" : null}
              </Text> 
              <Text style={styles.itemStyle}>
                คะเเนนรวม {item.TotalScore.toFixed(1)} <FontAwesome name="star" size={20} color="#efce4a" />
                
              </Text>
              <Text style={styles.itemStyle}>
                ระยะห่าง {Distance(item.latlong.latitude,item.latlong.longitude).toFixed(3)} ก.ม.
              </Text>
              <Text style={styles.itemStyle}>
                งานที่สำเร็จ {item.WorkSuccess}
              </Text>
              <Text style={styles.itemStyle}>
                ช่างรับรอง {item.CerTech}
              </Text>
            </Body>
          </CardItem>
          
        </Card>
      </TouchableHighlight>
    );
  }else{
    return (
      <TouchableHighlight  key={key} style ={{margin:5}} onPress = {() => navigation.navigate('MyTabs',{ Tkey: item.Key })}>
        <Card>
          <CardItem>
            <Left>
              <View>
                <Image source={{uri:item.Photo}} style={{ width:150 , height: 200 ,marginTop : 10}}/>
              </View>
            </Left>
            <Body>
              <Text style={styles.itemStyle}>
                ชื่อ {item.Name}
              </Text>
              <Text style={styles.itemStyle}>
                {item.Occupations.Motorcycle ? " ช่างซ่อมรถจักรยานยนต์\n" : null} 
                {item.Occupations.Electrician ? " ช่างซ่อมเครื่องใช้ไฟฟ้า\n" : null}
                {item.Occupations.Electricity ? " ช่างซ่อมไฟฟ้า\n" : null}
              </Text> 
              <Text style={styles.itemStyle}>
                คะเเนนรวม {item.TotalScore.toFixed(1)} <FontAwesome name="star" size={20} color="#efce4a" />
              </Text>
              <Text style={styles.itemStyle}>
                ระยะห่าง {Distance(item.latlong.latitude,item.latlong.longitude).toFixed(3)} ก.ม.
              </Text>
              <Text style={styles.itemStyle}>
                งานที่สำเร็จ {item.WorkSuccess}
              </Text>
              <Text style={styles.itemStyle}>
                ช่างรับรอง {item.CerTech}
              </Text>
            </Body>
          </CardItem>
          
        </Card>
      </TouchableHighlight>
    );
  }
  
};

console.log(Glocation)
if(Show == 1 && Glocation != null){
    return (
      <Container>
        <Header style ={{backgroundColor: "#CA7004"}}>
        <View style={{flex:1,flexDirection:'row'}}>
          <Left>
            <Button transparent onPress={() => navigation.toggleDrawer()}>
              <Icon name='menu'  />
            </Button>
          </Left>
          <Body>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{marginTop:12}}>
                <Title>รายชื่อช่าง</Title>
              </View>
              <View style={{marginLeft:10,marginTop:7}}>
                <Fontisto name="person" size={33} color="#FFFFFF" />
              </View>
            </View>

            
          </Body>
          <Right>
            <Button transparent onPress={() => {setModalVisible(true);}}>
              <FontAwesome name="sort" size={24} color="#FFFFFF" />
            </Button>
          </Right> 
          </View>
        </Header>

        <View>
          <SearchBar
            searchIcon={{ size: 24 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="ค้นหารายชื่อ"
            lightTheme = {true}
            // placeholderTextColor= "#CA7004"
            value={search}
          />
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              
          
              
              {/* List Item as a function */}
              
                
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
                      {/* <Text style={styles.modalText}>เรียงลำดับ</Text> */}

            
                      {/* <Text style={styles.modalText}>ประเภทช่าง</Text> */}

                      <View style = {{marginLeft:15,marginBottom:20}}>
                        <View style={styles.checkboxInput}>
                          <CheckBox
                            value={Motorcycle}
                            onChange={()=>{
                                            setElectricity(false)
                                            setElectrician(false)
                                            setMotorcycle(!Motorcycle)
                                            setTotleT(false)}}
                            style={styles.checkbox}
                          />
                          <Text style={styles.label}>ช่างซ่อมรถจักรยานยนต์</Text>
                        </View>
                        <View style={styles.checkboxInput}>
                          <CheckBox
                            value={Electrician}
                            onChange={()=>{
                                            setElectricity(false)
                                            setElectrician(!Electrician)
                                            setMotorcycle(false)
                                            setTotleT(false)}}
                            style={styles.checkbox}
                          />
                          <Text style={styles.label}>ช่างซ่อมเครื่องใช้ไฟฟ้า</Text>
                        </View>
                        <View style={styles.checkboxInput}>
                          <CheckBox
                            value={Electricity}
                            onChange={()=>{
                                            setElectricity(!Electricity)
                                            setElectrician(false)
                                            setMotorcycle(false)
                                            setTotleT(false)}}
                            style={styles.checkbox}
                          />
                          <Text style={styles.label}>ช่างซ่อมไฟฟ้า</Text>
                        </View>
                        <View style={styles.checkboxInput}>
                          <CheckBox
                            value={TotleT}
                            // onValueChange={setTotleT}
                            onChange={()=>{
                                            setElectricity(false)
                                            setElectrician(false)
                                            setMotorcycle(false)
                                            setTotleT(!TotleT)}}
                            style={styles.checkbox}
                          />
                          <Text style={styles.label}>ช่างทั้งหมด</Text>
                        </View>
                      </View>

                      <TouchableHighlight
                        style={{ ...styles.openButton, }}
                        onPress={() => {
                          SortPoint(dataSourceT);
                        }}>
                        <Text style={styles.textStyle}>เรียงจากคะเเนน</Text>
                      </TouchableHighlight>

                      <TouchableHighlight
                        style={{ ...styles.openButton,}}
                        onPress={() => {
                          SortDistance(dataSourceT);
                        }}>
                        <Text style={styles.textStyle}>เรียงจากตำแหน่ง</Text>
                      </TouchableHighlight>

                      <TouchableHighlight
                        style={{ ...styles.openButton, marginTop:30 }}
                        onPress={() => {
                          SortOcc()
                          setModalVisible(false);
                        }}>
                        <Text style={styles.textStyle}>ตกลง</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </Modal>




                
            </View>
          </SafeAreaView>
        </ScrollView>
      </Container>
      
    );
  }else{
    return (
      <Container>
      <Header style ={{backgroundColor: "#CA7004"}}>
      <View style={{flex:1,flexDirection:'row'}}>
        <Left>
          <Button transparent onPress={() => navigation.toggleDrawer()}>
            <Icon name='menu'  />
          </Button>
        </Left>
        <Body>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{marginTop:12}}>
              <Title>รายชื่อช่าง</Title>
            </View>
            <View style={{marginLeft:10,marginTop:7}}>
              <Fontisto name="person" size={33} color="#FFFFFF" />
            </View>
          </View>

          
        </Body>
        <Right>
          <Button transparent onPress={() => {setModalVisible(true);}}>
            <FontAwesome name="sort" size={24} color="#FFFFFF" />
          </Button>
        </Right> 
        </View>
      </Header>


      <View>
        <SearchBar
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction('')}
          placeholder="ค้นหารายชื่อ"
          lightTheme = {true}
          // placeholderTextColor= "#CA7004"
          value={search}
        />
      </View>
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          
       
          
          {/* List Item as a function */}
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            
            


            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {/* <Text style={styles.modalText}>เรียงลำดับ</Text> */}

        
                  {/* <Text style={styles.modalText}>ประเภทช่าง</Text> */}

                  <View style = {{marginLeft:15,marginBottom:20}}>
                    <View style={styles.checkboxInput}>
                      <CheckBox
                        value={Motorcycle}
                        onChange={()=>{
                                        setElectricity(false)
                                        setElectrician(false)
                                        setMotorcycle(!Motorcycle)
                                        setTotleT(false)}}
                        style={styles.checkbox}
                      />
                      <Text style={styles.label}>ช่างซ่อมรถจักรยานยนต์</Text>
                    </View>
                    <View style={styles.checkboxInput}>
                      <CheckBox
                        value={Electrician}
                        onChange={()=>{
                                        setElectricity(false)
                                        setElectrician(!Electrician)
                                        setMotorcycle(false)
                                        setTotleT(false)}}
                        style={styles.checkbox}
                      />
                      <Text style={styles.label}>ช่างซ่อมเครื่องใช้ไฟฟ้า</Text>
                    </View>
                    <View style={styles.checkboxInput}>
                      <CheckBox
                        value={Electricity}
                        onChange={()=>{
                                        setElectricity(!Electricity)
                                        setElectrician(false)
                                        setMotorcycle(false)
                                        setTotleT(false)}}
                        style={styles.checkbox}
                      />
                      <Text style={styles.label}>ช่างซ่อมไฟฟ้า</Text>
                    </View>
                    <View style={styles.checkboxInput}>
                      <CheckBox
                        value={TotleT}
                        // onValueChange={setTotleT}
                        onChange={()=>{
                                        setElectricity(false)
                                        setElectrician(false)
                                        setMotorcycle(false)
                                        setTotleT(!TotleT)}}
                        style={styles.checkbox}
                      />
                      <Text style={styles.label}>ช่างทั้งหมด</Text>
                    </View>
                  </View>

                  <TouchableHighlight
                    style={{ ...styles.openButton,  }}
                    onPress={() => {
                      SortPoint(dataSourceT);
                    }}>
                    <Text style={styles.textStyle}>เรียงจากคะเเนน</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton,}}
                    onPress={() => {
                      SortDistance(dataSourceT);
                    }}>
                    <Text style={styles.textStyle}>เรียงจากตำแหน่ง</Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={{ ...styles.openButton,marginTop:30 }}
                    onPress={() => {
                      SortOcc()
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>ตกลง</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>



           
            </ScrollView>
        </View>
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
    padding: 40,
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
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16
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
  boxinput:{
    marginRight: 20,
    marginTop:15,
    marginLeft:20,
  },
  checkboxInput: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    margin: 5,
  },
});

