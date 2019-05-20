import React from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { PermissionsAndroid } from "react-native";

export default class LocationPermission extends React.Component {
  state = {
    status: null
  };

  locationRequest = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "Please allow app to get your current location " +
            "so app can forcast weather for you",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
        //Alert.alert("You can use the location");
      } else {
        console.log("location permission denied");
        //Alert.alert("location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
}
