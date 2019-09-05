import React, { Component } from "react";

import {
  StyleSheet,
  View,
  PermissionsAndroid,
  ActivityIndicator,
  Button,
  Platform
} from "react-native";
import { AsyncStorage, AppState } from "react-native";
import CustomListview from "../CustomeListView";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLatitude: "unknown",
      currentLongitude: "unknown",
      error: null,
      isLoading: true,
      appState: AppState.currentState
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

  componentDidMount() {
    console.log("in componentDidMountStart");

    AppState.addEventListener("change", this._handleAppStateChange);

    if (Platform.OS === "ios") {
      console.log("in login", navigator.geolocation);
      navigator.geolocation.requestAuthorization();
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log("Permission access ios", position);
          const currentLongitude = JSON.stringify(position.coords.longitude);
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            console.log(currentLongitude + " " + currentLatitude);
            this.setState({
              currentLongitude: currentLongitude,
              currentLatitude: currentLatitude,
              isLoading: false
            });
            this.getCurrentLocation();
        },
        error => {
          console.log("Permission denied :- ", error);
          this.getDefaultLocation();
        }
      );
    } else {
      this.request_device_location_runtime_permission();
    }
  }

  async request_device_location_runtime_permission() {
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
        console.log("Location permission is granted");
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000
        })
          .then(data => {
            console.log("in RNAndroidLocationEnabler success");
            this.getLocation();
            // The user has accepted to enable the location services
            // data can be :
            // - "already-enabled" if the location services has been already enabled
            // - "enabled" if user has clicked on OK button in the popup
          })
          .catch(err => {
            console.log("in RNAndroidLocationEnabler fail");
            // The user has not accepted to enable the location services or something went wrong during the process
            // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
            // codes :
            // - ERR00 : The user has clicked on Cancel button in the popup
            // - ERR01 : If the Settings change are unavailable
            // - ERR02 : If the popup has failed to open
            //alert("Please turn on location")
            this.getDefaultLocation();
          });
      } else {
        //Alert.alert("Location Permission Not Granted");
        this.getDefaultLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getLocation() {
    console.log("Get Location function");

    //alert("callLocation Called");
    navigator.geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        console.log(currentLongitude + " " + currentLatitude);
        //getting the Latitude from the location json
        this.setState({
          currentLongitude: currentLongitude,
          currentLatitude: currentLatitude,
          isLoading: false
        });
        this.getCurrentLocation();
      },
      error => console.log(error.message + " here"),
      { enableHighAccuracy: true, timeout: 20000 }
    );
  }

  getDefaultLocation() {
    //alert("in getDefaultLocation");
    console.log(
      "in getDefaultLocation: Lat = " +
        this.state.latitude +
        " Long = " +
        this.state.longitude
    );
    return fetch(
      "http://api.openweathermap.org/data/2.5/forecast?lat=28.5355&lon=77.3910&mode=json&appid=de32477c716ee4787d88b09b6211eafd&units=metric"
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: responseJson.list,
          isLoading: false
        });
        console.log("From default location" + responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }

  getCurrentLocation() {
    console.log(
      "in getCurrentLocation" +
        this.state.currentLatitude +
        " " +
        this.state.currentLongitude
    );
    return fetch(
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
        this.state.currentLatitude +
        "&lon=" +
        this.state.currentLongitude +
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
    AppState.removeEventListener("change", this._handleAppStateChange);
    console.log("componentWillUnmount called");
    navigator.geolocation.clearWatch(this.getLongLat);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      if (Platform.OS === "ios") {
        console.log("in login", navigator.geolocation);
        navigator.geolocation.requestAuthorization();
        navigator.geolocation.getCurrentPosition(
          position => {
            console.log("Permission access ios _handleAppState", position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            console.log(currentLongitude + " " + currentLatitude);
            this.setState({
              currentLongitude: currentLongitude,
              currentLatitude: currentLatitude,
              isLoading: false
            });
            this.getCurrentLocation();
          },
          error => {
            console.log("Permission denied :- ", error);
            this.getDefaultLocation();
          }
        );
      }
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    console.log("in render");

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
});
