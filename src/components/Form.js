import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { AsyncStorage } from "react-native";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class Form extends React.Component {
  state = {
    username: "",
    password: ""
  };

  constructor(props) {
    super(props);
    this.updateFormField = this.updateFormField.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  updateFormField(fieldName) {
    return event => {
      this.setState({
        [fieldName]: event.nativeEvent.text
      });
    };
  }

  storeUser = async () => {
    //Alert.alert("Empty credential");
    try {
      AsyncStorage.setItem("username", this.state.username);
      AsyncStorage.setItem("password", this.state.password);
    } catch (error) {
      // Error saving data
    }
  };

  getUser = async () => {
    try {
      let username = await AsyncStorage.getItem("username");
      let password = await AsyncStorage.getItem("password");
      //Alert.alert(username + " " + password);
      console.log(username + " -> " + password);
      if (username !== null && password !== null) {
        this.props.navToDash();
      }
    } catch (error) {}
  };



  onLocationPressed = () => {
    
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
      .then(data => {
        alert(data);
      }).catch(err => {
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
        // codes : 
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        alert("Error " + err.message + ", Code : " + err.code);
      });
    
  }


  submitForm() {
    //this.onLocationPressed();

    const { username, password } = this.state;

    //Now do something with username and password
    if (username !== "" && password !== "") {

      if (username == "adminuser" && password == "12345678") {
        this.storeUser();
        this.props.navToDash();
      } else {
        Alert.alert("Wrong credential");
      }
    } else {
      Alert.alert("Please enter credential");
    }
  }

  componentDidMount() {
    console.log("in componentDidMount From.js");
    this.getUser();
  }

  render() {
    // const { onPress, num } = this.props;
    console.log(this.props);

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="Username"
          placeholderTextColor="#ffffff"
          onChange={this.updateFormField("username")}
        />
        <TextInput 
          secureTextEntry={true}
          style={styles.inputBox}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          onChange={this.updateFormField("password")}
        />
        <TouchableOpacity style={styles.button} onPress={this.submitForm}>
          <Text> Login </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  inputBox: {
    width: 300,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 25,
    paddingHorizontal: 16,
    color: "#ffffff",
    marginVertical: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 15,
    width: 300,
    borderRadius: 25,
    marginVertical: 10
  }
});
