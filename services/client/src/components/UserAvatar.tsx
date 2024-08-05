import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { myip } from "../config/Api";

type UserImageType = {
  url?: string;
  height?: number;
  width?: number;
}

const UserAvatar = ({ url, height = 50, width = 50 }: UserImageType) => {
  const styles = StyleSheet.create({
    avatar: {
      width: width,
      height: height,
      borderRadius: 25,
      marginRight: 10,
    },
  });

  return (
    <View>
      <Image
        source={{
          uri: url,
        }}
        style={styles.avatar}
      />
    </View>
  );
};

export default UserAvatar;
