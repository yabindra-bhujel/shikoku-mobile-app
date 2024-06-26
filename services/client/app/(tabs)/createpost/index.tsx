import { StyleSheet, ScrollView, View } from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CommunityPageHeader from "@/src/components/community/CommunityPageHeader";
import Post from "@/src/components/community/Post";
import IPost from "@/src/components/community/IPost";

const Community = () => {
  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "white",
        }}

      >


      <CommunityPageHeader  headerTitle="Create Post"/>

      {/* post */}

      <Post />

      {/*  */}

      </ScrollView>
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({

});
