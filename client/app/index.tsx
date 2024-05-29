import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import StyledButton from "@/src/components/StyledButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StartScreen() {
  const handlePress = () => {
    console.log("pressed");
  };
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View style={styles.headerImage}>
          <Image source={require("@/assets/images/128px-shikoku-logo.png")} />
          <View>
            <Text style={styles.text1}>SHIKOKU UNIVERSITY</Text>
            <Text style={styles.text2}>四国大学</Text>
          </View>
          <View>
            <Text style={styles.exitAlert}>
              This app is for Shikoku University if you are not please exit and
              delete this app.
            </Text>
          </View>
        </View>
        <StyledButton handlePress={()=> 
          router.push('/login')
        }
        title="Go to Login"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentstyle: {
    flex: 1,
  },
  headerImage: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 150,
    gap: 50,
  },
  text1: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000000",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  text2: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000000",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  redirect: {
    color: "blue",
  },
  exitAlert: {
    color: "red",
    fontSize: 20,
    padding: 15,
  },
});
