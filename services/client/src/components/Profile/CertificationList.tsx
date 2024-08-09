import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { CheckBox } from "react-native-elements";
import Feather from "@expo/vector-icons/Feather";

const CertificationList = ({ visible }) => {
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const certifications = [
    { id: "1", name: "Certification A" },
    { id: "2", name: "Certification B" },
    { id: "3", name: "Certification C" },
    { id: "4", name: "bo Certification E" },
    { id: "5", name: "de Certification F" },
  ];

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
    <View>
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
        ) : (
          ""
        )}
      </View>
      {/* Certification List */}
      <FlatList
        data={filteredCertifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleCertificationSelection(item.id)}
          >
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
  );
};

export default CertificationList;

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    width: "90%",
    borderRadius: 5,
    // paddingHorizontal: 10,
  },
  certificationItem: {
    backgroundColor: "#f8f8f8",
    marginTop: 8,
    marginHorizontal: 20,
    borderRadius: 5,
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
});
