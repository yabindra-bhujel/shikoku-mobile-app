import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MessageOptionsModal = ({ visible, onClose, onReply, onDelete }) => (
  <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalButton} onPress={onReply}>
          <Text style={styles.modalButtonText}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={onDelete}>
          <Text style={styles.modalButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalButton: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalButtonText: {
    fontSize: 18,
  },
});

export default MessageOptionsModal;
