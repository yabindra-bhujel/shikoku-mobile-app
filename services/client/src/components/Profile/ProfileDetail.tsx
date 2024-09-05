import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@/src/hooks/UserContext";
import UserServices, { UserProfile } from "@/src/api/UserServices";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import CustomizableHeader from "@/src/components/CustomizableHeader";
import Bio from "./Bio";
import Interest from "./Interest";
import UserInfoServices from "@/src/api/UserInfo";
import Skill from "./Skill";
import ClubActivity from "./ClubActivity";

interface SkillSchema {
  id: number;
  name: string;
}

interface InterestSchema {
  id: number;
  name: string;
}

interface ClubActivitySchema {
  id: number;
  name: string;
}

interface UserInfo {
  user_id: number;
  skills?: SkillSchema[];
  interests?: InterestSchema[];
  club_activities?: ClubActivitySchema[];
}


const ProfileDetail = () => {
  const [userData, setUserData] = useState<UserProfile>();
  const { email } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const getProfile = async () => {
    try {
      const request = await UserServices.UserProfile.getProfile();
      setUserData(request.data);
      setProfileImage(request.data.update_profile);
    } catch (error) {
      Alert.alert("プロフィール情報の取得に失敗しました。もう一度お試しください。");
    }
  };

  const getUserInfo = async () => {
    try{
      const response = await UserInfoServices.getUserInfo();
      setUserInfo(response.data);
    } catch (error) {
      Alert.alert("ユーザー情報の取得に失敗しました。もう一度お試しください。");
    }

  }

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
    <View style={styles.container}>
      <CustomizableHeader />
      <LinearGradient
        colors={["rgba(181,217,211,1)", "rgba(148,187,233,1)"]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="chevron-back-sharp" size={24} color="#fff" />
        </TouchableOpacity>

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

      <ScrollView>
        <Bio userData={userData} getProfile={getProfile} />

        {/* 興味セクション */}
        <Interest interestsProps={userInfo?.interests} fetchUserInfo={getUserInfo} />
        
        {/* スキルセットセクション */}
        <Skill skillProps={userInfo?.skills} fetchUserInfo={getUserInfo} />

        {/* 活動・サークルセクション */}
        <ClubActivity clubActivitiesProps={userInfo?.club_activities}  fetchUserInfo={getUserInfo}/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  headerContainer: {
    padding: 20,
    height: 200,
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 120,
    width: 120,
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
});

export default ProfileDetail;
