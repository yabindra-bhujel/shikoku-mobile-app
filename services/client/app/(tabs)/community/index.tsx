import React, { useState, useCallback } from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import CommunityPageHeader from "@/src/components/community/CommunityPageHeader";
import Post from "@/src/components/community/Post";

const Community = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetchPosts().then(() => setRefreshing(false));
    setTimeout(() => setRefreshing(false), 2000); // Simulate a 2s delay
  }, []);

  return (
    <View style={styles.container}>
      <CommunityPageHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollViewContent}
      >
        <Post />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

export default Community;
