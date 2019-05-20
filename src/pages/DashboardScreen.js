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

export async function request_device_location_runtime_permission() {
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
    } else {
      //Alert.alert("Location Permission Not Granted");
    }
  } catch (err) {
    console.warn(err);
  }
}

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 0,
      longitude: 0,
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

  async componentDidMount() {
    console.log("in componentDidMountStart");
    await request_device_location_runtime_permission();

    this.getLongLat = navigator.geolocation.watchPosition(
      position => {
        console.log(
          "in componentDidMount set state" +
            position.coords.latitude +
            " ->" +
            position.coords.longitude
        );
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 100,
        distanceFilter: 10
      }
    );
    
    if(this.state.latitude!==0 && this.state.longitude!==0){
      console.log("Current location called");
    this.getCurrentLocation();
    }else{
      console.log("Default location called");
      this.getDefaultLocation();
    }
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

  getCurrentLocation() {
    console.log("in getCurrentLocation"+this.state.latitude+"Long = "+this.state.longitude);
    return fetch(
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
        this.state.latitude +
        "&lon=" +
        this.state.longitude +
        "&mode=json&appid=de32477c716ee4787d88b09b6211eafd"
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

  getDefaultLocation() {
    console.log("in getDefaultLocation: Lat = "+this.state.latitude+" Long = "+this.state.longitude);
    return fetch(
      "http://api.openweathermap.org/data/2.5/forecast?lat=28.5355&lon=77.3910&mode=json&appid=de32477c716ee4787d88b09b6211eafd"
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
});
