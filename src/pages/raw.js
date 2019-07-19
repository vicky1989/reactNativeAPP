//This is an example code to get Geolocation//
import React from 'react';
//import react in our code.
import {View, Text, StyleSheet, Image ,PermissionsAndroid, Button, ActivityIndicator} from 'react-native';
import { AsyncStorage } from "react-native";
import CustomListview from "../CustomeListView";
//import all the components we are going to use.

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export default class App extends React.Component {
state = {
currentLongitude: 'unknown',//Initial Longitude
currentLatitude: 'unknown',//Initial Latitude
isLoading: true,
}
componentDidMount = () => {
var that =this;
//Checking for the permission just after component loaded

async function requestLocationPermission() {
try {
const granted = await PermissionsAndroid.request(
PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
title: "ReactNativeCode Location Permission",
message: "ReactNativeCode App needs access to your location ",
buttonNeutral: "Ask Me Later",
buttonNegative: "Cancel",
buttonPositive: "OK"
}
)
if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//To Check, If Permission is granted

RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
.then(data => {
that.callLocation(that);
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
that.setState({ isLoading: false});
});
} else {
alert("Permission Denied");
}
} catch (err) {
alert("err",err);
console.warn(err)
}
}
requestLocationPermission();
}
callLocation(that){
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
that.getCurrentLocation(that);
});
}

componentWillUnmount = () => {
navigator.geolocation.clearWatch(this.watchID);
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

getCurrentLocation(that) {
console.log("in getCurrentLocation "+that.state.currentLatitude+"Long = "+that.state.currentLongitude);
return fetch(
"http://api.openweathermap.org/data/2.5/forecast?lat=" +
that.state.currentLatitude +
"&lon=" +
that.state.currentLongitude +
"&mode=json&appid=de32477c716ee4787d88b09b6211eafd"
)
.then(response => response.json())
.then(responseJson => {
that.setState({
dataSource: responseJson.list,
});
console.log("Current location data");
console.log(that.state.dataSource);
})
.catch(error => {
console.error(error);
});
}
getDefaultLocation() {
console.log("in getDefaultLocation "+this.state.currentLatitude+"Long = "+this.state.currentLongitude);
return fetch(
"http://api.openweathermap.org/data/2.5/forecast?lat=36.168478&lon=-115.203571&mode=json&appid=de32477c716ee4787d88b09b6211eafd"
)
.then(response => response.json())
.then(responseJson => {
this.setState({
dataSource: responseJson.list,
});
console.log("Current location data");
console.log(responseJson);
})
.catch(error => {
console.error(error);
});
}

static logout() {
//Alert.alert("Logout");
AsyncStorage.clear();
this.props.navigation.navigate("Login");
}

render() {
console.log("in render");
console.log(this.state.dataSource);
if(this.state.isLoading){
return (
<View style={{ flex: 1, padding: 20 }}>
<ActivityIndicator />
</View>
);
}else{

/*if(this.state.dataSource!==null){
console.log("i am here "+this.state.dataSource);
}*/
return (
<View style={styles.MainContainer}>
<CustomListview itemList={this.state.dataSource} />
</View>
)
}
}
}
const styles = StyleSheet.create ({
container: {
flex: 1,
alignItems: 'center',
justifyContent:'center',
marginTop: 50,
padding:16,
backgroundColor:'white'
},
boldText: {
fontSize: 30,
color: 'red',
}
})