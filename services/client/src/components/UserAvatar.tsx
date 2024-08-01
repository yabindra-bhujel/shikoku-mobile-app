import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { myip } from "../config/Api";

type UserImageType = {
  url?: string;
  height?: number;
  width?: number;
}
const UserAvatar: React.FC<UserImageType> = ({ url = "https://randomuser.me/api/portraits/men/75.jpg", height = 50, width = 50}) => {
  const styles = StyleSheet.create({
    avatar: {
      width: height,
      height: width,
      borderRadius: 25,
      marginRight: 10,
    },
  });
  return (
    <View>
      <Image
        source={{
          uri: url
          // https://randomuser.me/api/portraits/men/75.jpg
        }}
        style={styles.avatar}
      />
    </View>
  );
};

export default UserAvatar;
