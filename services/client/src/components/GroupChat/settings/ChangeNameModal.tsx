import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Text as PaperText } from "react-native-paper";
import GroupServices from "@/src/api/GroupServices";

interface ChangeModalTypes {
  visible: boolean;
  onClose: () => void;
  currentGroupId: number;
  groupInfo: any;
  refresDetaiScreen: () => void;
}

const ChangeNameModal: React.FC<ChangeModalTypes> = ({
  visible,
  onClose,
  currentGroupId,
  groupInfo,
  refresDetaiScreen,
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  useEffect(() => {
    setGroupName(groupInfo.name);
    setGroupDescription(groupInfo.description);
  }, [groupInfo]);

  const handleUpdateGroup = async () => {
    const data = {
        name: groupName,
        description: groupDescription,
        group_type: "private"
    };
    console.log(data)
    try {
      await GroupServices.updateGroup(currentGroupId, data);
      refresDetaiScreen();
    } catch (error) {
      Alert.alert("Error", "Failed to update group. Please try again.");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalText}>グループの更新</Text>
          </View>
          <View style={styles.modalBody}>
            <TextInput
              label="グループ名"
              mode="outlined"
              value={groupName}
              onChangeText={setGroupName}
              style={styles.input}
            />
            <TextInput
              label="グループの説明"
              mode="outlined"
              value={groupDescription}
              onChangeText={setGroupDescription}
              multiline
              style={[styles.input, styles.description]}
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
      </View>
    </Modal>
  );
};

export default ChangeNameModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalBody: {
    marginTop: 20,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    width: 250,
    maxWidth: 270,
  },
  description: {
    height: 100,
  },
  modalFooter: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
