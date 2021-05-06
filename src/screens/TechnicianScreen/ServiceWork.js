
import {Keyaut} from '../Keyaut'
import { FontAwesome5 } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);

}  
import Spinner from 'react-native-loading-spinner-overlay';
import {Container,Left, Body,Right,Content, Title, Header ,Input, Item, Button,Icon,Textarea,Card, CardItem,} from 'native-base' 
import React, { useState, useEffect} from "react";
import { CheckBox, Text, StyleSheet, View ,  Platform,ScrollView,Alert} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { G } from 'react-native-svg';


export default function MyApp (props){
  const { navigation } = props

  const KeyRef = React.useContext(Keyaut);
  var docRefOccupation = firebase.firestore().collection("users").doc(KeyRef.key);
  var docRefOnoff = firebase.firestore().collection("users").doc(KeyRef.key).collection("onoff");
  var docRefService = firebase.firestore().collection("users").doc(KeyRef.key).collection("ServiceWork")
  const [onoff, setonoff] = useState();
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  //เวลาเปิดปิด
  const [Timeon, setTimeon] = useState(null);
  const [Timeoff, setTimeoff] = useState(null);
  

  //อาชีพ
  const [Motorcycle, setMotorcycle] = useState(false);
  const [Electrician, setElectrician] = useState(false);
  const [Electricity, setElectricity] = useState(false);

  //วันทำการ
  const [Sunday, setSunday] = useState(false)
  const [Monday, setMonday] = useState(false)
  const [Tuesday, setTuesday] = useState(false)
  const [Wednesday,setWednesday] = useState(false)
  const [Thursday, setThursday] = useState(false)
  const [Friday, setFriday] = useState(false)
  const [Saturday, setSaturday] = useState(false)

  //รายละเอียดการทำงาน
  const [Work, setWork] = useState(null);
  const [Rate, setRate] = useState(null);
  const [Dis, setDis] = useState(null);

  const [isOcc, setOcc] = useState(false);
  const [isTime, setTime] = useState(false);
  const [isWorkD, setWorkD] = useState(false);


  const [loading, setLoading] = useState(false);
  



  useEffect(() => {

    if(isOcc == false){
      setMotorcycle(false);
      setElectrician(false);
      setElectricity(false);
    }

    if(isTime == false){
     setSunday(false)
     setMonday(false)
     setTuesday(false)
     setWednesday(false)
     setThursday(false)
     setFriday(false)
     setSaturday(false)

     setTimeon(null);
     setTimeoff(null);
    }

    if(isWorkD == false){
      setWork(null);
      setRate(null);
      setDis(null);
    }

    
  }, []);

  const Occupation = () =>{
    if(Motorcycle != false || Electrician != false || Electricity != false){
      docRefOccupation.set({Occupations : {
        Motorcycle : Motorcycle,
        Electrician: Electrician,
        Electricity: Electricity,
        Technician: true,
      }},{ merge: true })
    }
    setLoading(false)
    Alert.alert(
      "การดำเนินการ",
      "บันทึกสำเร็จ",)
    setOcc(!isOcc)
  }

  const SavaOnoff = () =>{
    const uidOnoff = docRefOnoff.doc().id
    if(Timeon != null && Timeoff != null){
      docRefOnoff.doc(uidOnoff).set({
        Day : {Sunday : Sunday,
        Monday: Monday,
        Tuesday: Tuesday,
        Wednesday: Wednesday,
        Thursday: Thursday,
        Friday: Friday,
        Saturday: Saturday},
        on : Timeon,
        off : Timeoff,
        Key : uidOnoff
      },{ merge: true })
    }
    setLoading(false)
    Alert.alert(
      "การดำเนินการ",
      "บันทึกสำเร็จ",)
    setTime(!isTime)
  }

  const SaveServiceWork = () =>{
    const uidService = docRefService.doc().id
    if(Work != null && Rate != null && Dis != null){
      docRefService.doc(uidService).set({
        NameWork : Work,
        Rate : Rate,
        description : Dis,
        Key : uidService
      },{ merge: true })
    }
    setLoading(false)
    Alert.alert(
      "การดำเนินการ",
      "บันทึกสำเร็จ",)
    setWorkD(!isWorkD)

    
  }

  const check = () =>{
    if(isOcc){
      if(Motorcycle == false && Electrician == false && Electricity == false){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ตรวจสอบประเภทช่าง",)
      }else{
        SaveData(2)
      }
    }
    if(isTime){
      if(Timeon == null || Timeoff == null){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "เลือกเวลาเปิด - ปิด",)
      }
      else if(!(Sunday || Monday || Tuesday || Wednesday || Thursday || Friday || Saturday)){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "เลือกวันทำการ",)
      }else{
        SaveData(1)
      }
    }
    if(isWorkD){
      if(Work == null && Rate == null && Dis == null){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ตรวจสอบชื่องานบริการ",)
      }
      else if(Rate == null){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ตรวจสอบอัตราค่าบริการ",)
      }
      else if(Dis == null){
        Alert.alert(
          "ข้อมูลไม่ครบถ้วน",
          "ตรวจสอบคำอธิบาย/รายละเอียด",)
      }else{
        SaveData(3)
      }
    }
  }
  const SaveData = (a) =>{
    setLoading(true)
    if(a == 1){
      SavaOnoff();
    }
    else if(a == 2){
      Occupation();
    }
    else if(a == 3){
      SaveServiceWork();
    }
    
    // navigation.navigate('ServiceWorkShow')
  }


  const onChange = (event, selectedDate) => {

    let offtime
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');

    if(onoff == 1){
      let onminute = currentDate.getHours().toString()
      let onhour = currentDate.getMinutes().toString()

      setTimeon(onminute .concat(":").concat(onhour));
    }

    if(onoff == 2){
      let onminute = currentDate.getHours().toString()
      let onhour = currentDate.getMinutes().toString()

      setTimeoff(onminute .concat(":").concat(onhour));
    }
    
    console.log(currentDate.toLocaleTimeString())
  };



  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepickeron = () => {
    showMode('time');
    setonoff(1);
  };

  const showTimepickeroff = () => {
    showMode('time');
    setonoff(2);
  };


  const Occ = () =>{
    if(isOcc == true)
    return(
        <CardItem>
          <View style = {{marginLeft:15,marginTop:5}}>
            <View style={styles.checkboxInput}>
              <CheckBox
                value={Motorcycle}
                //onValueChange={setMotorcycle}
                onChange={()=>{
                  setElectricity(false)
                  setElectrician(false)
                  setMotorcycle(!Motorcycle)
                }}
                style={styles.checkbox}
              />
              <Text style={styles.label}>ช่างซ่อมรถจักรยานยนค์</Text>
            </View>

            <View style={styles.checkboxInput}>
              <CheckBox
                value={Electrician}
                onChange={()=>{
                  setElectricity(false)
                  setElectrician(!Electrician)
                  setMotorcycle(false)
                }}
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
              }}
                style={styles.checkbox}
              />
              <Text style={styles.label}>ช่างซ่อมไฟฟ้า</Text>
            </View>
          </View>
        </CardItem>

    )
  }


  const time = () =>{
    if(isTime == true)
    return(
       <View>
        <View style = {{flex: 2,flexDirection:'column',alignItems: 'center'}}>
          <View style = {{flex: 2,flexDirection:'row',alignItems: 'center'}}>
            <View>
              <View>
                <Button full rounded onPress={showTimepickeron}  style={{marginTop: 15,marginRight: 10, width: 100,alignItems: 'center'}}>
                  <Text style = {{color:'#ffffff'}}>เวลาเปิด</Text>
                </Button>
              </View>
            </View>
            <View>
              <View>
                <Button full rounded onPress={showTimepickeroff}  style={{marginTop: 15,marginLeft: 10, width: 100,alignItems: 'center'}}>
                  <Text style = {{color:'#ffffff'}}>เวลาปิด</Text>
                </Button>
              </View>
            </View>
          </View>
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
          <View style = {{flex: 2,flexDirection:'row',alignItems: 'center',margin:15}}>
            <View>
              <Text>
                {P()}
              </Text>
            </View>
            <View>
              <Text>
                {G()}
              </Text>
            </View>
          </View>
        </View>
   


      <View style = {{flex: 2,flexDirection:'row',justifyContent:'center'}}>
        <View style={{marginRight: 35}}>
          <View style={styles.checkboxInput}>
            <CheckBox
              value={Sunday}
              onValueChange={setSunday}
              style={styles.checkbox}
            />
            <Text style={styles.label}>วันอาทิตย์</Text>
          </View>

          
          <View style={styles.checkboxInput}>
            <CheckBox
              value={Monday}
              onValueChange={setMonday}
              style={styles.checkbox}
            />
            <Text style={styles.label}>วันจันทร์</Text>
          </View>

          <View style={styles.checkboxInput}>
            <CheckBox
              value={Tuesday}
              onValueChange={setTuesday}
              style={styles.checkbox}
            />
            <Text style={styles.label}>วันอังคาร</Text>
          </View>
          <View style={styles.checkboxInput}>
            <CheckBox
              value={Wednesday}
              onValueChange={setWednesday}
              style={styles.checkbox}
            />
            <Text style={styles.label}>วันพุธ</Text>
          </View>
        </View>
        <View style={{marginLeft: 35}}>
          <View style={styles.checkboxInput}>
            <CheckBox
              value={Thursday}
              onValueChange={setThursday}
              style={styles.checkbox}
            />
            <Text style={styles.label}>วันพฤหัสบดี</Text>
          </View>

          <View style={styles.checkboxInput}>
            <CheckBox
              value={Friday}
              onValueChange={setFriday}
              style={styles.checkbox}
            />
            <Text style={styles.label}>วันศุกร์</Text>
          </View>
          <View style={styles.checkboxInput}>
            <CheckBox
              value={Saturday}
              onValueChange={setSaturday}
              style={styles.checkbox}
            />
            <Text style={styles.label}>วันเสาร์</Text>
          </View>
        </View>
      </View>
    </View>

    )
  }

const P = () =>{
    if(Timeon != null){
      return "เวลาเปิด "+Timeon
    }
}

const G = () =>{
  if(Timeoff != null){
    return " - "+Timeoff
  }
}
const WorkD = () => {
  if(isWorkD == true)
  return(

            <View>
              <Content padder>
                {/* ชื่อ */}
                <Item regular>
                    <Input placeholder='งาน' 
                  onChangeText={(e)=>setWork(e)}
                    />
                </Item>
                <Textarea rowSpan={5} bordered placeholder='อัตราค่าบริการ' 
                  onChangeText={(e)=>setRate(e)}
                />
                <Textarea rowSpan={5} bordered placeholder="เทคนิควิธีการอื่นๆ" 
                  onChangeText={(f)=>setDis(f)}
                />
              
              
              </Content>

            
            </View> 
        )
}

const saveW = () =>{
  return(
    <Button  full rounded    style ={{marginTop: 10, margin:20,color:'#ffffff'}}
    // onPress ={()=>SaveData(Name,Contact,Address)}>
    onPress ={check}
    >
      <Text style ={{color:'#ffffff'}}> บันทึก </Text>
    </Button>
  )
}

  

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
        {/* <Button transparent onPress={() => navigation.navigate('Work')}>
            < AntDesign name="edit" size={24} color="#FFFFFF" />
          </Button> */}
        </Right>
      </Header>

      <ScrollView>
      <View style={styles.container}>
      
      <View style ={{margin:5}}>
        <Card>
          <CardItem header >
            <CheckBox
                value={isOcc}
                onValueChange={setOcc}
              /><Text>แก้ไขประเภทช่าง</Text></CardItem>
              {Occ()}
        </Card>
      </View>


      <View style ={{margin:5}}>
        <Card>
          <CardItem header >
          <CheckBox
          value={isTime}
          onValueChange={setTime}
        /><Text>เพิ่มเวลาเปืด - ปิด</Text></CardItem>
              {time()}
        </Card>
      </View>

      <View style ={{margin:5}}>
        <Card>
          <CardItem header >
          <CheckBox
            value={isWorkD}
            onValueChange={setWorkD}
        /><Text>เพิ่มงานบริการ</Text></CardItem>
              {WorkD()}
        </Card>
      </View>
        

        {saveW()}

        
 
        <Spinner
          visible={loading}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
      </ScrollView>
    </Container>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 4,
    // alignItems: "center",
  },
  checkboxInput: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    margin: 5,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});



