import * as React from 'react';
import { QRCode as CustomQRCode } from 'react-native-custom-qr-codes-expo';
import { SafeAreaView, Text, View  } from 'react-native';
import {Container,Left, Body,Right, Title, Header , Subtitle,  Button,Icon} from 'native-base' 
import { FontAwesome5 } from '@expo/vector-icons';



export default function CustomQRCodes(props) {
  const {route} = props
  const { navigation } = props
  const {UID} = route.params;
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
            <Title>ข้อมูลงาน</Title>
            <Subtitle>QR Code</Subtitle>
          </View>
          <View style={{marginLeft:10,marginTop:7}}>
            <FontAwesome5 name="user-tie" size={32} color="#FFFFFF" />
          </View>
        </View>

        </Body>
        <Right>
          {/* <Button transparent>
            <AntDesign name="qrcode" size={24} color="#FFFFFF" 
            onPress={() => navigation.navigate('QRCode')} />
          </Button> */}
        </Right>
      </Header>

      <SafeAreaView style={{ flex: 1 , alignItems:'center',justifyContent:'center'}}>
          <CustomQRCode codeStyle="square"  content = {UID} />
          <View>
            <Button full rounded  style={{width:100, marginTop:50}} onPress={()=>navigation.navigate('StatusWork')}>
              <Text style={{color:"#FFFFFF" ,textAlign:'center'}}>กลับ</Text>
            </Button>
          </View>
      </SafeAreaView>
    </Container>



      
  );
}
