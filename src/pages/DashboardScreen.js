import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Alert,
  Platform,
  ActivityIndicator,
  FlatList,
  Button
} from "react-native";
import { AsyncStorage } from "react-native";
import CustomListview from "../CustomeListView";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLatitude: 'unknown',
      currentLongitude: 'unknown',
      error: null,
      isLoading: true
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Dashboard",
      headerLeft: null,
      headerRight: (
        <Button
          onPress={() => {
            AsyncStorage.clear();
            navigation.replace("Login");
          }}
          title="Logout"
          color="#000"
        />
      )
    };
  };

  static logout() {
    //Alert.alert("Logout");
    AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  }

   componentDidMount = () => {

    var that =this;
    console.log("in componentDidMountStart");
    async function request_device_location_runtime_permission() {
      console.log("in request_device_location_runtime_permission");
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "ReactNativeCode Location Permission",
            message: "ReactNativeCode App needs access to your location ",
    
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //Alert.alert("Location Permission Granted.");
          console.log("Location permission is granted")
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
              .then(data => {
                that.getLocation(that);
              // The user has accepted to enable the location services
              // data can be :
              // - "already-enabled" if the location services has been already enabled
              // - "enabled" if user has clicked on OK button in the popup
              }).catch(err => {
              // The user has not accepted to enable the location services or something went wrong during the process
              // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
              // codes :
              // - ERR00 : The user has clicked on Cancel button in the popup
              // - ERR01 : If the Settings change are unavailable
              // - ERR02 : If the popup has failed to open
              //alert("Please turn on location")
              that.getDefaultLocation();
          });
        } else {
          //Alert.alert("Location Permission Not Granted");
          that.getDefaultLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
     request_device_location_runtime_permission();
  }

  getLocation(that){
    console.log("Get Location");

      //alert("callLocation Called");
      navigator.geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
          const currentLongitude = JSON.stringify(position.coords.longitude);
          //getting the Longitude from the location json
          const currentLatitude = JSON.stringify(position.coords.latitude);
          //getting the Latitude from the location json
          that.setState({ currentLongitude:currentLongitude });
          //Setting state Longitude to re re-render the Longitude Text
          that.setState({ currentLatitude:currentLatitude });
          //Setting state Latitude to re re-render the Longitude Text
          that.setState({ isLoading: false});
      },
      (error) => console.log(error.message+" here"),
          { enableHighAccuracy: true, timeout: 20000 }
      );
      that.watchID = navigator.geolocation.watchPosition((position) => {
          //Will give you the location on location change
          console.log(position);
          const currentLongitude = JSON.stringify(position.coords.longitude);
          //getting the Longitude from the location json
          const currentLatitude = JSON.stringify(position.coords.latitude);
          //getting the Latitude from the location json
          that.setState({ currentLongitude:currentLongitude });
          //Setting state Longitude to re re-render the Longitude Text
          that.setState({ currentLatitude:currentLatitude });
          //Setting state Latitude to re re-render the Longitude Text
          that.setState({ isLoading: false});
          //alert(that.state.currentLatitude+"==>"+that.state.currentLongitude)
          that.getCurrentLocation(that)
      });
  }

  getDefaultLocation() {
    //alert("in getDefaultLocation");
    console.log("in getDefaultLocation: Lat = "+this.state.latitude+" Long = "+this.state.longitude);
    return fetch(
      "http://api.openweathermap.org/data/2.5/forecast?lat=28.5355&lon=77.3910&mode=json&appid=de32477c716ee4787d88b09b6211eafd&units=metric"
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: responseJson.list,
          isLoading: false
        });
        console.log("From default location"+responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }

  getCurrentLocation(that) {
    //alert(that.state.currentLatitude+"==>"+that.state.currentLongitude);
    return fetch(
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      that.state.currentLatitude +
        "&lon=" +
        that.state.currentLongitude +
        "&mode=json&appid=de32477c716ee4787d88b09b6211eafd&units=metric"
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: responseJson.list,
          isLoading: false
        });
        console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }


  componentWillUnmount() {
    console.log("componentWillUnmount called");
    navigator.geolocation.clearWatch(this.getLongLat);
  }

  getUser = async () => {
    try {
      let username = await AsyncStorage.getItem("username");
      let password = await AsyncStorage.getItem("password");
      Alert.alert(username + " " + password);
    } catch (error) {}
  };

  render() {
    console.log("in render");

    //if (this.state.latitude !== 0 && this.state.longitude !== 0) {
      if (this.state.isLoading) {
        return (
          <View style={{ flex: 1, padding: 20 }}>
            <ActivityIndicator />
          </View>
        );
      } else {
        return (
          <View style={styles.MainContainer}>
            <CustomListview itemList={this.state.dataSource} />
          </View>
        );
      }
    //} else {
      // return (
      //   <View style={{ flex: 1, padding: 20 }}>
      //     <ActivityIndicator />
      //   </View>
      // );
    //}
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5fcff",
    padding: 11
  },

  text: {
    fontSize: 22,
    color: "#000",
    textAlign: "center",
    marginBottom: 10
  }
})