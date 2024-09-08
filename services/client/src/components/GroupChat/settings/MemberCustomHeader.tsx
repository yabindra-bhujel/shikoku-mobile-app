import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const CustomHeader = ({ onAddMember }) => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const {t} = useTranslation();

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#444' : '#ddd',
      backgroundColor: isDark ? '#333' : '#f9f9f9',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
      color: isDark ? '#4d9aff' : '#0066cc',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#333',
    },
    addButton: {
      padding: 8,
    },
    addButtonIcon: {
      borderRadius: 50,
      backgroundColor: isDark ? '#444' : '#ddd',
      padding: 8,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AntDesign name="left" size={20} color={isDark ? '#4d9aff' : '#0066cc'} />
        <Text style={styles.backButtonText}>{t("back")}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{t("groupchat.memberList")}</Text>
      <TouchableOpacity onPress={onAddMember} style={styles.addButton}>
        <View style={styles.addButtonIcon}>
          <AntDesign name="plus" size={24} color={isDark ? '#fff' : '#000'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
