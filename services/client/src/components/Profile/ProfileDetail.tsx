import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@/src/hooks/UserContext";
import UserServices, { UserProfile } from "@/src/api/UserServices";
import UserAvatar from "../UserAvatar";
import Header from "../CustomizableHeader";
import { router } from "expo-router";
import EditProfileModal from "./EditProfileModal";
import CertificationList from "./CertificationDisplay";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileDetail = () => {
  const isDark = useColorScheme() === "dark";
  const [userData, setUserData] = useState<UserProfile>();
  const { email } = useUser();
  const [show, setShow] = useState(false);

  const handleShowHideModal = () => {
    setShow(!show);
  };

  const getProfile = async () => {
    try {
      const request = await UserServices.UserProfile.getProfile();
      setUserData(request.data);
    } catch (error) {
      throw error;
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setUserData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <SafeAreaView style={[styles.container,{
      backgroundColor: isDark ? "#333" : "#fff",
    }]}>
      <Header
        onBackPress={() => router.back()}
        title="Profile"
        rightComponent={
          <TouchableWithoutFeedback onPress={handleShowHideModal}>
            <View>
              <Text style={styles.editButtonText}>Edit</Text>
            </View>
          </TouchableWithoutFeedback>
        }
      />
      <EditProfileModal
        visible={show}
        onHide={handleShowHideModal}
        userData={userData}
        onProfileUpdate={handleProfileUpdate}
      />
      <Image
        style={styles.stretch}
        source={{ uri: "https://picsum.photos/200/300" }}
      />
      <View style={styles.headerContainer}>
        <UserAvatar url={userData?.update_profile} />
        <View>
          <Text style={[styles.headerText, {
            color: isDark ? "#fff" : "#000",
          }]}>{userData?.first_name ? `${userData?.first_name.toUpperCase()} ${userData?.last_name.toUpperCase()}` : "No Name available"}</Text>
          <Text style={[styles.headerText, {
            color: isDark ? "#fff" : "#000",
          }]}>{email}</Text>
        </View>
      </View>
      <View style={[styles.bioContainer,{
        backgroundColor: isDark ? "#444" : "#7F97B2",
      }]}>
        {userData?.bio ? (
          <Text style={[styles.bioText, {
            color: isDark ? "#fff" : "#000",
          }]}>{userData?.bio}</Text>
        ) : (
          <Text style={{
            color: isDark ? "#fff" : "#000",
          }}>No bio available</Text>
        )}
      </View>
      <CertificationList/>
    </SafeAreaView>
  );
};

export default ProfileDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    padding: 10,
    marginHorizontal: 10,
  },
  stretch: {
    width: "100%",
    height: 200,
  },
  headerText: {
    fontSize: 20,
  },
  userimage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  bioContainer: {
    padding: 20,
    // backgroundColor: "#7F97B2",
    marginHorizontal: 20,
    borderRadius: 15,
  },
  bioText: {
    fontSize: 16,
    color: "#fff",
  },
  editButtonText: {
    fontSize: 16,
    color: "#0099ff",
  },
});
