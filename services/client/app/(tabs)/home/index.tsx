import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
} from "react-native";
import HeaderView from "@/src/screens/Home/HeaderView";
import Home from "@/src/screens/Home/HomeUi";

const HomeScreen = () => {

  const theme = useColorScheme();

  return (
    <View style={{ flex: 1 ,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
    }}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <HeaderView/>
      <ScrollView
        style={[
          styles.bodyContainer,
          {
            backgroundColor: theme === "dark" ? "#333" : "#f5f5f5",
          },
        ]}
      >
        <Home />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 55,
    paddingLeft: 28,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bodyContainer: {
    flex: 1,
    padding: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerActions: {
    right: 10,
  },
  darBgColor: {
    backgroundColor: "grey",
  },
});

export default HomeScreen;
