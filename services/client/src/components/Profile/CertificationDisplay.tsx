import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const CertificationList = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isDark = useColorScheme() === "dark";

  const certifications = [
    { id: "1", name: "ITパスポート" },
    { id: "2", name: "基本情報技術者試験（FE)" },
    { id: "3", name: "応用情報技術者試験（AP)" },
  ];

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleVisibility}>
        <View style={[styles.titleContainer, {
          backgroundColor: isDark ? "#444" : "#007BFF",
        }]}>
          <Text style={styles.titleText}>Certifications</Text>
          {isVisible ? (
            <AntDesign name="upcircleo" size={24} color="#fff" />
          ) : (
            <AntDesign name="downcircle" size={24} color="#fff" />
          )}
        </View>
      </TouchableWithoutFeedback>
      {isVisible && (
        <FlatList
          data={certifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.certificationItem, {
              backgroundColor: isDark ? "#444" : "#007BFF",
            }]}>
              <Text style={[styles.certificationText, {
                color: isDark ? "#fff" : "#007BFF",
              }]}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default CertificationList;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titleContainer: {
    // backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  certificationItem: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  certificationText: {
    fontSize: 16,
  },
});
