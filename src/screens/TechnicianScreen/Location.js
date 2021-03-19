import React, { useState, useEffect } from 'react';
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import {Keyaut} from '../Keyaut'
import { firebaseConfig } from './firebaseConfig.js';
import 'firebase/firestore';
require("firebase/firestore");
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  
}  

export default function ocation(props) {
  const { navigation } = props
  const KeyRef = React.useContext(Keyaut);
  //const [Oc, setOc] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitudelongitude, setlatitudelongitude] = useState({latitude : 11.423933,longitude : 101.214496});
  //const [Savelatitudelongitude, setSavelatitudelongitudeS] = useState(null);

  const [Motorcycle, setMotorcycle] = useState(false);
  const [Electrician, setElectrician] = useState(false);
  const [Electricity, setElectricity] = useState(false);
  const [Totle, setTotle] = useState(0);
  const [WorkSuccess, setWorkSuccess] = useState(0);
  const [CerTech, setCerTech] = useState(0);


  var Refdb = firebase.firestore().collection("users").doc(KeyRef.key)
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
       let location = await Location.getCurrentPositionAsync({});
      setlatitudelongitude({latitude: location.coords.latitude,longitude: location.coords.longitude});
    })();

    Refdb.get().then(function(doc) {
      if (doc.exists) {
        //console.log("Document data:", doc.data());
        // if(doc.data().Occupations.Motorcycle != null){
        //   setMotorcycle(doc.data().Occupations.Motorcycle);
        // }
        // if(doc.data().Occupations.Electrician != null){
        //   setElectrician(doc.data().Occupations.Electrician);
        // }
        // if(doc.data().Occupations.Electricity != null){
        //   setElectricity(doc.data().Occupations.Electricity);
        // }
        if(doc.data().Occupations != null){
          setElectricity(doc.data().Occupations.Electricity);
          setElectrician(doc.data().Occupations.Electrician)
          setMotorcycle(doc.data().Occupations.Motorcycle)
        }
        if(doc.data().WorkSuccess != null){
          setWorkSuccess(doc.data().WorkSuccess)
        }
        if(doc.data().CerTech != null){
           setCerTech(doc.data().CerTech)
        }
        if(doc.data().TotalScore != null){
          setTotle(doc.data().TotalScore)
       }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    })

  }, []);



  const SavaLocation = (loca) => {
    //console.log(loca);
    //setSavelatitudelongitudeS(loca)
    SaveData(loca)
    navigation.navigate('History')
  }

  const SaveData = (location)=>{
    // if(Oc == 1){
      Refdb.set({
        TotalScore : Totle,
        WorkSuccess : WorkSuccess,
        CerTech : CerTech,
        latlong : location,
        Occupations : {
          Motorcycle : Motorcycle,
          Electrician : Electrician,
          Electricity : Electricity,
          Technician : true,
        }
      }, { merge: true })
    // }else{
      // Refdb.set({
      //   latlong: location,
      //   Occupations : {
      //     Motorcycle : false,
      //     Electrician: false,
      //     Electricity: false,
      //   }
      // }, { merge: true })
    // }

  }

  return (
   
    <MapView provider={PROVIDER_GOOGLE} style={{flex: 1 ,alignItems:'center'}}
      showsMyLocationButton={true}
      region={{
        latitude: latitudelongitude.latitude,
        longitude: latitudelongitude.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
    <MapView.Marker draggable    provider={PROVIDER_GOOGLE}
      coordinate={{latitude: latitudelongitude.latitude,
                   longitude: latitudelongitude.longitude,
                  }}    
      onPress={e => SavaLocation(e.nativeEvent.coordinate)}
      
    />
    </MapView>
  );
}