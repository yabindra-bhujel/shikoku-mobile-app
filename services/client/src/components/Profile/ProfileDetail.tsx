import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
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
  const [isSkillEditing, setIsSkillEditing] = useState<boolean>(false);
  const [isActivityEditing, setIsActivityEditing] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();

  // Updated interests and colors
  const skills = ["HTML", "CSS", "JavaScript", "React", "React Native", "Node.js", "Python"];
  const skillColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFC133", "#33FFF9"];
  const activities = ["佐藤研究室", "書道部"];

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


        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={20} color="#333" />
            <Text style={styles.sectionTitle}>活動・サークル</Text>
          </View>
          <View style={styles.activityContainer}>
            <View style={styles.activityCard}>
              <Ionicons name="book-outline" size={30} color="#5A67D8" />
              <Text style={styles.activityText}>佐藤研究室</Text>
            </View>
            <View style={styles.activityCard}>
              <Ionicons name="brush-outline" size={30} color="#F56565" />
              <Text style={styles.activityText}>書道部</Text>
            </View>
          </View>
        </View>
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
    height: 240,
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
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    marginTop: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#666',
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  interestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#FF5733',
  },
  interestText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#FF5733',
  },
  skillText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  activityContainer: {
    marginTop: 10,
  },
  activityCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  activityText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ProfileDetail;
