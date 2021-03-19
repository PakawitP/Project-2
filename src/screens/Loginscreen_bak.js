
export default class Loginscreen extends React.Component{

  constructor(props){
    super(props)
    this.state = ({
      email:'',
      password:''
    })
  }

  
  componentDidMount(){
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null){
        console.log(user)
      }
    })
  }


  /*ฟังก์ชันเข้าสู่ระบบด้วย email*/
  loginUser = (email,password) =>{
    try{
      firebase.auth().signInWithEmailAndPassword(email,password).then(function(user){
        console.log(user)
      })
    }

    catch(erroe){
      
      console.log(error.toString())
    }
  }


  /*ฟังก์ชันเข้าสู่ระบบ facebook*/
  login=async ()=>{

  await Facebook.initializeAsync('338955613739410');
  
  const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        { permissions:['public_profile', 'email'] },
      );


      if(type == 'success'){
        const credential = firebase.auth.FacebookAuthProvider.credential(token)
  
        firebase.auth().signInWithCredential(credential).catch((error) => {
          console.log(error)
        })
      }
  }

  render(){
    return (
      <Container style={styles.container}>
      <Form>

          {/*กรอกอีเมลเข้าสู่ระบบ*/ }
          <Item floatingLabel>
            <Label>อีเมล</Label>
            <Input
              autoCorrect={false}
              autoCapitalize={"none"}
              onChangeText={(email)=>this.setState({email})}
            />
          </Item>

          <Item floatingLabel>  
            <Label>รหัสผ่าน</Label>
            <Input
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize={"none"}
              onChangeText={(password)=>this.setState({password})}
            />
          </Item>

          <Button style={{marginTop :40}}
            full
            rounded
            success
            onPress ={()=>this.loginUser(this.state.email,this.state.password)}
          >
              <Text style={{color: 'white'}}>เข้าสู่ระบบ</Text>
          </Button>


          {/*ปุ่มสมัคร*/ }
          <Button style={{marginTop :20 , backgroundColor: "#85037F"}}  
            full
            rounded 
            onPress ={()=>this.signUpUser(this.state.email,this.state.password)}
          >
              <Text style={{color: 'white'}}>สมัคร</Text>
          </Button>

          {/*ปุ่มเข้าระบบด้วยfacebook*/ }
          <Button style={{marginTop :20}}
            full
            rounded
            primary
            onPress ={()=>this.login()}
          >
              <Text style={{color: 'white'}}>เข้าระบบด้วย facebook</Text>
          </Button>

      </Form>
  </Container>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
