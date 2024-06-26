import { StyleSheet, ScrollView } from "react-native";
import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CommunityPageHeader from "@/src/components/community/CommunityPageHeader";
import Post from "@/src/components/community/Post";
import IPost from "@/src/components/community/IPost";

const Community = () => {
  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "white",
        }}

      >


      <CommunityPageHeader />

      {/* post */}

      <Post />

      {/*  */}

      </ScrollView>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({

});
