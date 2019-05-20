import React, { Component } from "react";
import { StyleSheet, Text, View, StatusBar, Image } from "react-native";

export default class Logo extends Component {
  render() {
    return (
      <View style={style.container}>
        <Image
          style={{ width: 40, height: 40 }}
          source={{ uri: "https://facebook.github.io/react/logo-og.png" }}
        />
        <Text style={style.logoText}>Weather forecast</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logoText: {
    marginVertical: 15,
    fontSize: 18,
    color: "rgba(255,255,255,0.7)"
  }
});
