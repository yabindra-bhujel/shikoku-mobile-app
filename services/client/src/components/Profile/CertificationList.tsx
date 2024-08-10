import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CheckBox } from "react-native-elements";
import Feather from "@expo/vector-icons/Feather";

const CertificationList = () => {
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const certifications = [
    { id: "1", name: "Certification A" },
    { id: "2", name: "Certification B" },
    { id: "3", name: "Certification C" },
    { id: "4", name: "bo Certification E" },
    { id: "5", name: "de Certification F" },
    { id: "6", name: "Certification G" },
    { id: "7", name: "Certification H" },
    { id: "8", name: "Certification I" },
    { id: "9", name: "Certification J" },
    { id: "10", name: "Certification K" },
  ];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const toggleCertificationSelection = (certificationId: string) => {
    setSelectedCertifications((prevSelected) =>
      prevSelected.includes(certificationId)
        ? prevSelected.filter((id) => id !== certificationId)
        : [...prevSelected, certificationId]
    );
  };

  // Filter certifications based on search query
  const filteredCertifications = certifications.filter((certification) =>
    certification.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Certifications"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        {searchQuery.length !== 0 ? (
          <Feather
            name="delete"
            size={24}
            color="black"
            onPress={() => setSearchQuery("")}
          />
        ) : null}
        {isKeyboardVisible && (
          <TouchableOpacity onPress={Keyboard.dismiss} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Certification List */}
      <View style={{ height: 
        isKeyboardVisible ? 270 : "90%" }}>
        <FlatList
          data={filteredCertifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleCertificationSelection(item.id)}>
              <View style={styles.certificationItem}>
                <Text style={styles.certificationText}>{item.name}</Text>
                <CheckBox
                  checkedIcon="checkbox-marked"
                  uncheckedIcon="checkbox-blank-outline"
                  iconType="material-community"
                  checkedColor="green"
                  checked={selectedCertifications.includes(item.id)}
                  onPress={() => toggleCertificationSelection(item.id)}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default CertificationList;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  searchBar: {
    height: 50,
    width: "70%", // Adjusted to make room for the Cancel button
    borderRadius: 5,
  },
  certificationItem: {
    backgroundColor: "#f8f8f8",
    marginTop: 8,
    borderRadius: 5,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  certificationText: {
    fontSize: 16,
  },
  searchBarContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  cancelButton: {
    padding: 10,
    marginLeft: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
});
