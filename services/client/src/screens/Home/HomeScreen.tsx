import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Notices } from "@/src/components/notice-data";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router, useRouter } from "expo-router";
import AuthServices from "@/src/api/AuthServices";
import { User } from "@/assets/interfaces/userInterface";
const HomeScreen = () => {
  const [user, setUser] = useState<User | null>(null);

  const routers = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const user = await AuthServices.getCurrentUser();
      setUser(user.data);
    };
    getUser();
  }, []);

  const handleLogout = () => {
    SecureStore.deleteItemAsync("refreshToken");
    router.push("/login");
  };

  const handleProfile = () => {
    router.push("user/index");
  };

  const ListNotice = Notices.map((notice) => (
    <View style={styles.noticeLine} key={notice.id}>
      <Link href={{
        pathname: 'home/[noticeId]',
        params: { noticeId: notice.id ,
          body : notice.body,
          title: notice.title,
        },
      }} style={styles.noticeText}>
        {notice.id}{"--"}
        {notice.title}
      </Link>
    </View>
  ));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerView}>
        <View>
          <Text style={styles.headerText}>Welcome back</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <TouchableOpacity style={styles.headerActions}>
          <Link href="modal">
            <FontAwesome
              name="user-circle"
              size={24}
              color="black"
              onPress={handleProfile}
            />
          </Link>
          <Button title="Logout" onPress={handleLogout} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <TouchableOpacity onPress={() => routers.navigate("modal")}>
          <Text>
          Profile
          </Text>
        </TouchableOpacity>
        <View style={styles.noticement}>
          <Text style={styles.noticeTitle}>新着のお知らせ</Text>
          <ScrollView style={styles.noticeBox}>{ListNotice}</ScrollView>
        </View>
      </View>
    </SafeAreaView>
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
    fontSize: 16,
  },
  bodyContainer: {
    flex: 1,
    borderRadius: 5,
    borderTopWidth: 1,
    padding: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  noticement: {},
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
    backgroundColor: "#fff",
  },
  noticeLine: {
    padding: 5,
    borderStyle: "solid",
    borderBottomWidth: 1,
  },
  noticeText: {
    fontSize: 20,
    lineHeight: 30,
    color: "#0000aa",
  },
});

export default HomeScreen;
