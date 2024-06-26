import { StyleSheet, ScrollView, View, Platform, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useRouter } from "expo-router";
import CommunityPageHeader from "@/src/components/community/CommunityPageHeader";
import Post from "@/src/components/community/Post";
import IPost from "@/src/components/community/IPost";

const Community = () => {
  return (
    <View>
      <CommunityPageHeader headerTitle="Community" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20, marginTop: 20 }}
      >
        <View
          style={{
            flex: 1,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              This is Test Data
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: "red",
              padding: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "blue" }} onPress={()=>router.push({
              pathname: "/post/[username]",
              params: {username :"Tanaka"
                }
              })}
                >This is Tanaka's Post</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({});
