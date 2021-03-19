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
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitudelongitude, setlatitudelongitude] = useState({latitude : 11.423933,longitude : 101.214496});
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
       let location = await Location.getCurrentPositionAsync({});
      setlatitudelongitude({latitude: location.coords.latitude,longitude: location.coords.longitude});
    })();
  }, []);

  const SavaLocation = (loca) => {
    navigation.navigate('JobAnnou',{Location:loca})
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
    <MapView.Marker provider={PROVIDER_GOOGLE} draggable    
      coordinate={{latitude: latitudelongitude.latitude,
                   longitude: latitudelongitude.longitude,
                  }}    
      onPress={e => SavaLocation(e.nativeEvent.coordinate)}
      
    />
    </MapView>
  );
}