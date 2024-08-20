import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import GroupServices from "@/src/api/GroupServices";

interface ChangeModalTypes {
  visible: boolean;
  onClose: () => void;
  currentGroupId: number;
  groupInfo: any;
  refresDetaiScreen: () => void;
  onUpdateGroup: (data: { name: string; description: string }) => void;
}

const ChangeNameModal: React.FC<ChangeModalTypes> = ({
  visible,
  onClose,
  currentGroupId,
  groupInfo,
  refresDetaiScreen,
  onUpdateGroup,
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [initialGroupName, setInitialGroupName] = useState("");
  const [initialGroupDescription, setInitialGroupDescription] = useState("");
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    setGroupName(groupInfo.name);
    setGroupDescription(groupInfo.description);
    setInitialGroupName(groupInfo.name);
    setInitialGroupDescription(groupInfo.description);
  }, [groupInfo]);

  const handleUpdateGroup = async () => {
    // Check if the name or description has changed
    if (
      groupName === initialGroupName &&
      groupDescription === initialGroupDescription
    ) {
      onClose();
      return;
    }

    const data = {
      name: groupName,
      description: groupDescription,
      group_type: "private",
    };
    try {
      const res = await GroupServices.updateGroup(currentGroupId, data);
      Alert.alert("Success", "Group updated successfully.");
      refresDetaiScreen();
      onUpdateGroup(data);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update group. Please try again.");
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: isDark ? "#444" : "white",
      padding: 20,
      borderRadius: 20,
      width: "90%",
    },
    modalBody: {
      marginTop: 20,
    },
    modalText: {
      fontSize: 20,
      marginTop: 20,
      fontWeight: "bold",
      alignItems: "flex-start",
      color: isDark ? "white" : "black",
    },
    input: {
      marginBottom: 20,
      width: "100%",
      backgroundColor: isDark ? "#333" : "white",
    },
    description: {
      height: 100,
    },
    modalFooter: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
  });

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>グループの更新</Text>
          <View style={styles.modalBody}>
            <TextInput
              label="グループ名"
              mode="outlined"
              value={groupName}
              textColor={isDark ? "white" : "black"}
              outlineColor={isDark ? "white" : "purple"}
              underlineColor={"white"}
              activeUnderlineColor={"white"}
              activeOutlineColor={isDark ? "white" : "purple"}
              onChangeText={(newGroupName) => setGroupName(newGroupName)}
              style={styles.input}
              theme={{
                colors: {
                  text: isDark ? "white" : "black",
                  placeholder: isDark ? "white" : "black",
                  onSurfaceVariant: isDark ? "white" : "purple",
                },
              }} 
            />

            <TextInput
              label="グループの説明"
              mode="outlined"
              value={groupDescription}
              textColor={isDark ? "white" : "black"}
              outlineColor={isDark ? "white" : "purple"}
              activeOutlineColor={isDark ? "white" : "purple"}
              onChangeText={(newDescription) =>
                setGroupDescription(newDescription)
              }
              multiline
              style={[styles.input, styles.description]}
              theme={{
                colors: {
                  text: isDark ? "white" : "black",
                  placeholder: isDark ? "white" : "black",
                  onSurfaceVariant: isDark ? "white" : "purple",
                },
              }}
            />
          </View>
          <View style={styles.modalFooter}>
            <Button mode="contained" icon="close" onPress={onClose}>
              閉じる
            </Button>
            <Button
              mode="contained"
              icon="note-check-outline"
              onPress={handleUpdateGroup}
            >
              変更
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChangeNameModal;
