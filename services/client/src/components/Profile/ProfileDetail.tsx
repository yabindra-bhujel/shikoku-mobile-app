import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
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

const ProfileDetail = () => {
  const [userData, setUserData] = useState<UserProfile>();
  const { fullname, email } = useUser();
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
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerText}>{fullname?.toUpperCase()}</Text>
          <Text style={styles.headerText}>{email}</Text>
        </View>
      </View>
      <View style={styles.bioContainer}>
        {userData?.bio ? (
          <Text style={styles.bioText}>{userData?.bio}</Text>
        ) : (
          <Text>No bio available</Text>
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
    backgroundColor: "#7F97B2",
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
