import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import UserAvatar from "../UserAvatar";
  import * as ImagePicker from "expo-image-picker";
  import UserServices from "@/src/api/UserServices";
  import CertificationList from "./CertificationList";
  
  const EditProfileModal = ({ visible, onHide, userData, onProfileUpdate }) => {
    const [firstname, setFirstName] = useState(userData?.first_name || "");
    const [lastname, setLastName] = useState(userData?.last_name || "");
    const [bio, setBio] = useState(userData?.bio || "");
    const [imageUri, setImageUri] = useState(userData?.update_profile || "");
    const [activeTab, setActiveTab] = useState("basicInfo");
  
    useEffect(() => {
      if (userData) {
        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
        setBio(userData.bio || "");
        setImageUri(userData.update_profile || "");
      }
    }, [userData]);
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        const uriParts = selectedImageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];
  
        const formData = new FormData();
        formData.append("file", {
          uri: selectedImageUri,
          name: `image.${fileType}`,
          type: `image/${fileType}`,
        } as any);
  
        try {
          const uploadResponse = await uploadImage(formData);
          console.log(uploadResponse);
          setImageUri(selectedImageUri); // Update the image URI in state
        } catch (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
      }
    };
  
    const uploadImage = async (formData: FormData): Promise<string | null> => {
      try {
        const uploadResponse = await UserServices.UserProfile.updateImage(
          formData
        );
  
        return uploadResponse.data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return null;
      }
    };
  
    const updateProfile = async () => {
      const data = {
        first_name: firstname,
        last_name: lastname,
        bio,
      };
      try {
        const request = await UserServices.UserProfile.updateProfile(data);
        onProfileUpdate({ ...data, update_profile: imageUri });
        onHide();
      } catch (error) {
        throw error;
      }
    };
  
    return (
      <SafeAreaView>
        <Modal transparent={true} visible={visible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.headerContainer}>
                <TouchableWithoutFeedback onPress={onHide}>
                  <Text style={styles.headerSubTitle}>閉じる</Text>
                </TouchableWithoutFeedback>
                <Text style={styles.headerText}>Edit Profile</Text>
                <TouchableWithoutFeedback onPress={updateProfile}>
                  <Text style={styles.headerSubTitle}>保存する</Text>
                </TouchableWithoutFeedback>
              </View>
  
              {/* Tabs for navigation */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "basicInfo" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("basicInfo")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "basicInfo" && styles.activeTabText,
                    ]}
                  >
                    基本の情報
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "certifications" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("certifications")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "certifications" && styles.activeTabText,
                    ]}
                  >
                    資格の登録
                  </Text>
                </TouchableOpacity>
              </View>
  
              {/* Content rendering based on active tab */}
              <View style={styles.bodyContainer}>
                {activeTab === "basicInfo" ? (
                  <ScrollView style={styles.baseProfile}>
                    <Text style={styles.title}>基本の情報:</Text>
                    <View style={styles.profileContainer}>
                      <Text style={styles.label}>性:</Text>
                      <TextInput
                        style={styles.username}
                        value={firstname}
                        onChangeText={(text) => setFirstName(text)}
                      />
                    </View>
                    <View style={styles.profileContainer}>
                      <Text style={styles.label}>名:</Text>
                      <TextInput
                        style={styles.username}
                        value={lastname}
                        onChangeText={(text) => setLastName(text)}
                      />
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.label,
                          {
                            marginTop: 10,
                          },
                        ]}
                      >
                        簡単な説明:
                      </Text>
                      <TextInput
                        value={bio}
                        style={styles.bioContainer}
                        multiline
                        numberOfLines={6}
                        maxLength={300}
                        onChangeText={(text) => setBio(text)}
                      />
                    </View>
  
                    <Text style={styles.title}>写真の更新:</Text>
                    <View style={styles.imageContainer}>
                      <UserAvatar url={imageUri} height={100} width={100} />
                      <TouchableOpacity
                        style={styles.imagePicker}
                        onPress={pickImage}
                      >
                        <Text style={styles.imagePickerText}>画像を選択</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                ) : (
                  <View style={styles.cerContainer}>
                    <CertificationList visible={visible} />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  };
  
  export default EditProfileModal;
  
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "gray",
    },
    modalView: {
      width: "100%",
      height: "90%",
      backgroundColor: "#eee",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    headerContainer: {
      padding: 18,
      width: "100%",
      backgroundColor: "#0099ff",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    headerText: {
      fontSize: 20,
      color: "white",
    },
    headerSubTitle: {
      fontSize: 16,
      color: "white",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: "#ddd",
    },
    tabButton: {
      padding: 10,
      width: "50%",
      alignItems: "center",
    },
    tabText: {
      fontSize: 16,
      color: "black",
    },
    activeTab: {
      backgroundColor: "#33ccff",
    },
    activeTabText: {
      color: "white",
      fontWeight: "bold",
    },
    bodyContainer: {
      flex: 1,
      padding: 20,
    },
    baseProfile: {
      backgroundColor: "#FFF",
    },
    title: {
      fontSize: 14,
      marginLeft: 20,
      marginTop: 20,
      marginBottom: 10,
    },
    profileContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    label: {
      fontSize: 16,
      marginLeft: 20,
    },
    username: {
      fontSize: 20,
      color: "black",
      padding: 12,
    },
    imageContainer: {
      width: "100%",
      backgroundColor: "#fff",
      padding: 10,
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "row",
    },
    imagePicker: {
      width: 100,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: "#ddd",
      alignItems: "center",
    },
    imagePickerText: {
      fontSize: 16,
      color: "blue",
    },
    bioContainer: {
      height: 110,
      width: "100%",
      padding: 20,
    },
    cerContainer: {
      backgroundColor: "white",
    },
  });
  