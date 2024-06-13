import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {Notices} from "../../components/notice-data";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {

  const ListNotice = Notices.map(notice => (
    <View style={styles.noticeLine}>
    <Link href={`/&{notice.title}`} style={styles.noticeText} key={notice.id}>
    {notice.title}
    </Link>
</View>
  ))
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerView}>
        <View>
          <Text style={styles.headerText}>Welcome back</Text>
          <Text style={styles.username}>Bob Jhonn</Text>
        </View>
        <View>
          <FontAwesome name="user-circle" size={24} color="black" />
        </View>
      </View>
      <Link href="/profile" style={{color: "blue"}}>Profile</Link>
      <View style={styles.noticement}>
        <Text style={styles.noticeTitle}>新着のお知らせ</Text>
        <ScrollView style={styles.noticeBox}>
          {ListNotice}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    backgroundColor: "#D9D9D9",
    justifyContent: "space-between",
    alignItems: "center",
    height: 55,
    paddingLeft: 28,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noticement: {
    padding: 10,
  },
  noticeTitle: {
    fontSize: 20,
    padding: 5,
    fontWeight: "bold",
  },
  Link: {
    color: "#0000aa",
  },
  noticeBox: {
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#fff"
  },
  noticeLine: {
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
  },
  noticeText: {
    fontSize: 20,
    lineHeight: 30,
    color: '#0000aa'
  },
});

export default HomeScreen;
