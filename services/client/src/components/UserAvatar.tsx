import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

type UserImageType = {
  url?: string;
  height?: number;
  width?: number;
}
const UserAvatar = (
  props
: UserImageType) => {
  const styles = StyleSheet.create({
    avatar: {
      width: props.width = 50,
      height: props.height = 50,
      borderRadius: 25,
      marginRight: 10,
    },
  });
  return (
    <View>
      <Image
        source={{
          uri: props.url,
        }}
        style={styles.avatar}
      />
    </View>
  );
};

export default UserAvatar;
