import React, { Component } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import Logo from "../components/Logo";
import Form from "../components/Form";

export default class Login extends Component {
  static navigationOptions = {
    title: "Login",
    headerLeft: null
  };

  render() {
    return (
      <View style={styles.container}>
        <Logo />
        <Form
          navToDash={() => this.props.navigation.replace("Dashboard")}
          num={26}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#455a64",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
