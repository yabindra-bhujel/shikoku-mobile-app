import { StyleSheet, ScrollView, View, TextInput, Text } from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Post from "@/src/components/community/Post";
import IPost from "@/src/components/community/IPost";
import PostCreateHeader from "@/src/components/PostCreate/PostCreateHeader";
import TextArea from "@/src/ReusableComponents/TextArea";

const Community = () => {
  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "white",
        }}

      >

      <PostCreateHeader />


      {/* body */}
      {/* <SafeAreaView> */}

      <View>
        <TextArea />
      </View>


      </ScrollView>
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({

});
