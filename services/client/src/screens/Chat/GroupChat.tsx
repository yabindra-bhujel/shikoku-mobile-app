import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import UserIconAndUsername from "@/src/components/GroupChat/UserIconAndUsername";
import CreateGroup from "@/src/components/GroupChat/CreateGroup";

const GroupChat = () => {
  const theme = useColorScheme();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const goBack = () => {
    router.back();
  };

  const toggleOpneModal = () => {
    setIsModalVisible(true);
  }

  const toggleCloseModal = () => {
    setIsModalVisible(false);
  }

  // const toggleModal = () => {
  //   setIsModalVisible(!isModalVisible);
  //   console.log(isModalVisible);
  // };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    communityHomeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: "green",
      padding: 10,
      borderRadius: 50,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", 

    },
   
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 54,
          backgroundColor: theme === "dark" ? "#333" : "#fff",
        }}
      />
      <View style={styles.communityHomeHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={goBack} style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="chevron-back-sharp"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            Group Chat
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
          <AntDesign
            name="search1"
            size={24}
            color={theme === "dark" ? "#fff" : "#000"}
            style={{ marginRight: 10, fontWeight: "bold" }}
          />
          <TouchableOpacity>
            <AntDesign
              name="setting"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
              style={{ marginRight: 10, fontWeight: "bold" }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* User list */}
      <UserIconAndUsername />

      {/* Add button */}
      <TouchableOpacity style={styles.addButton} onPress={toggleOpneModal}>
        <AntDesign name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Add Form */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleCloseModal}
      >
        <CreateGroup toggleCloseModal={toggleCloseModal} />
        {/* <View style={styles.modalContainer}>
          <View style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            width: "80%",

          
          }}>
            <TouchableOpacity   onPress={toggleCloseModal}>
              <AntDesign name="close" size={24} color="black"/>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Add Group Chat
            </Text>
          </View>

            <View style={{ marginBottom: 10 }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "lightgray",
                  padding: 10,
                  borderRadius: 5,
                }}
                placeholder="Group Name"
              />
            </View>
        </View> */}
      </Modal>
    </View>
  );
};

export default GroupChat;
