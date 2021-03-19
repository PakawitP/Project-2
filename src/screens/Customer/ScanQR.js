import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StyleSheet, Text, View ,Alert, } from 'react-native';
import {Container,Left, Body,Right, Title, Header , Subtitle,  Button,Icon} from 'native-base' 
//import { AntDesign } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons';
export default function App(props) {
  const { navigation } = props
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    Alert.alert(
        "QR Code",
        data,
        [
          {
            text: "ยกเลิก",
            // onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "ดำเนินการต่อ", onPress : () => navigation.navigate('CStatusAdd',{Key : data}) }

        ],
        { cancelable: false }
      );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
                <Title>การเพิ่มงาน</Title>
                <Subtitle>Scan QRcode</Subtitle>
                </View>
                <View style={{marginLeft:10,marginTop:7}}>
                    <Fontisto name="person" size={33} color="#FFFFFF" />
                </View>
            </View>

        </Body>
        <Right>
            {/* <Button transparent>
            <AntDesign name="qrcode" size={24} color="#FFFFFF" 
            onPress={() => navigation.navigate('CScanQR')} 
            />
            </Button> */}
        </Right>
        </Header>
    
        <View style={styles.container}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />
        {/* {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}
        {scanned && <Button block  onPress={() => setScanned(false)}><Text style={{color:'#FFFFFF'}}>เเสกนอีกครั้ง</Text></Button>}
        </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});


