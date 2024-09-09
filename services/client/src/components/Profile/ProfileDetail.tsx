import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useUser } from "@/src/hooks/UserContext";
import UserServices, { UserProfile } from "@/src/api/UserServices";
import UserInfoServices from "@/src/api/UserInfo";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import Header from "./Header";
import Bio from "./Bio";
import Interest from "./Interest";
import Skill from "./Skill";
import ClubActivity from "./ClubActivity";
import UserPostCard from "./UserPostCard";
import { UserInfoInterface } from "@/src/type/interfaces/UserInfoInterfaces";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "@/src/hooks/useThemeColor";

enum Menu {
  BASICINFO = 'basic',
  POSTINFO = 'post'
}

const ProfileDetail = () => {
  const [userData, setUserData] = useState<UserProfile>();
  const { loggedInUserId, email } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfoInterface>();
  const [activeMenu, setActiveMenu] = useState<string>(Menu.BASICINFO);
  const { updateProfileImage } = useUser();

  const backgroundColor = useThemeColor({}, "background");

  const getProfile = async () => {
    try {
      const request = await UserServices.UserProfile.getProfile();
      setUserData(request.data);
      setProfileImage(request.data.image);
    } catch (error) {
      Alert.alert("プロフィール情報の取得に失敗しました。もう一度お試しください。");
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await UserInfoServices.getUserInfo();
      setUserInfo(response.data);
    } catch (error) {
      Alert.alert("ユーザー情報の取得に失敗しました。もう一度お試しください。");
    }
  };

  const goBack = () => {
    router.back();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setImageChanged(true);
    }
  };

  const saveImage = async () => {
    if (!profileImage) return;
    try {
      const formData = new FormData();
      const uriParts = profileImage.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('file', {
        uri: profileImage,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      });

      await UserServices.UserProfile.updateImage(formData);
      setImageChanged(false);
      getProfile();
      updateProfileImage(profileImage);
    } catch (error) {
      Alert.alert("画像の保存に失敗しました。再度お試しください。");
    }
  };

  useEffect(() => {
    getProfile();
    getUserInfo();
  }, []);

  useEffect(() => {
    if (imageChanged) {
      saveImage();
    }
  }, [imageChanged]);

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Header onBackPress={goBack} />
      <LinearGradient
        colors={["rgba(181,217,211,1)", "rgba(148,187,233,1)"]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: profileImage || userData?.update_profile }}
              style={styles.avatar}
            />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {userData?.first_name} {userData?.last_name}
            </Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Menu switch buttons */}
      <View style={styles.switchButtonContainer}>
        <View style={[activeMenu === Menu.BASICINFO && styles.activeButtonLine]}>
          <TouchableOpacity
            style={[styles.btnStyle, activeMenu === Menu.BASICINFO && styles.activeButton]}
            onPress={() => setActiveMenu(Menu.BASICINFO)}
            disabled={activeMenu === Menu.BASICINFO}
          >
            <Ionicons
              name="information-circle-sharp"
              size={24}
              color={activeMenu === Menu.BASICINFO ? "#E6B227" : "black"}
            />
          </TouchableOpacity>
        </View>

        <View style={[activeMenu === Menu.POSTINFO && styles.activeButtonLine]}>
          <TouchableOpacity
            style={[styles.btnStyle, activeMenu === Menu.POSTINFO && styles.activeButton]}
            onPress={() => setActiveMenu(Menu.POSTINFO)}
            disabled={activeMenu === Menu.POSTINFO}
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={activeMenu === Menu.POSTINFO ? "#E6B227" : "black"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <ScrollView>
        {activeMenu === Menu.BASICINFO && (
          <View>
            <Bio userData={userData} getProfile={getProfile} />
            <Interest interestsProps={userInfo?.interests} fetchUserInfo={getUserInfo} />
            <Skill skillProps={userInfo?.skills} fetchUserInfo={getUserInfo} />
            <ClubActivity clubActivitiesProps={userInfo?.club_activities} fetchUserInfo={getUserInfo} />
          </View>
        )}
        {activeMenu === Menu.POSTINFO && (
          <View>
            <UserPostCard user_id={loggedInUserId ?? undefined} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6.65,
    elevation: 8,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  email: {
    fontSize: 18,
    color: "#000",
    marginTop: 5,
  },
  switchButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnStyle: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  activeButton: {
    // backgroundColor: '#E6B227',
  },
  activeButtonLine: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E6B227',
  },
});

export default ProfileDetail;
