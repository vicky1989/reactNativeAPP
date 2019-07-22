import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "#FFF",
    elevation: 2
  },
  temperture: {
    fontSize: 20,
    color: "#000"
  },
  title: {
    fontSize: 16,
    color: "#000"
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    justifyContent: "center"
  }
});

const CustomRow = ({ date, description, temperture }) => (
  <View style={styles.container}>
    <View style={styles.container_text}>
      <Text style={styles.temperture}>{"Temperture : " + temperture+"°C"}</Text>
      <Text style={styles.title}>{"Date and Time : " + date}</Text>
    </View>
  </View>
);

export default CustomRow;
