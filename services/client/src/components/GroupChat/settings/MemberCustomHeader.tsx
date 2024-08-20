import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CustomHeader = ({ onAddMember }) => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'lightgray',
      backgroundColor: isDark ? "#333" : "#fff",
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 5,
      color: "#3399ff"
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? "#fff" : "#333"
    },
    addButton: {
      padding: 5,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AntDesign name="left" size={20} color="#3399ff" />
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>
      <Text style={styles.title}>メンバーリスト</Text>
      <TouchableOpacity onPress={onAddMember} style={styles.addButton}>
        <AntDesign name="plus" size={24} color={isDark ? "white" : "black"} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
