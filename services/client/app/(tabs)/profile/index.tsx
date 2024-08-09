import { StyleSheet, Text, View, useColorScheme } from "react-native";
import React from "react";
import ProfileDetail from "@/src/components/Profile/ProfileDetail";

const Profile = () => {

  const theme = useColorScheme();

  return (
        <ProfileDetail/>
  );
};

export default Profile;

const styles = StyleSheet.create({});
