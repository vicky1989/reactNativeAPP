import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import CustomRow from "./CustomeRow";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const CustomListview = ({ itemList }) => (
  <View style={styles.container}>
  <Text style={styles.title}>{"Title"}</Text>
    <FlatList
      data={itemList}
      renderItem={({ item }) => (
        <CustomRow date={item.dt_txt} temperture={item.main.temp} />
      )}
    />
  </View>
);

export default CustomListview;
