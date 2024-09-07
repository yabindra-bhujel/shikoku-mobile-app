import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const PostSkeletonPlaceholder = () => {
  return (
    <View style={[styles.container]}>
      {/* Placeholder for header */}
      <View style={styles.header}>
        <Animated.View style={styles.avatar} />
        <View style={styles.headerTextContainer}>
          <Animated.View style={styles.username} />
          <Animated.View style={styles.timestamp} />
        </View>
      </View>

      {/* Placeholder for post content */}
      <View style={styles.postContent}>
        <Animated.View style={styles.postText} />
        <Animated.View style={styles.postImage} />
      </View>

      {/* Placeholder for footer */}
      <View style={styles.footer}>
        <Animated.View style={styles.footerText} />
        <Animated.View style={styles.footerText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  headerTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    height: 20,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginBottom: 5,
    width: '60%',
  },
  timestamp: {
    height: 15,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    width: '40%',
  },
  postContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  postText: {
    height: 60,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  postImage: {
    height: 200,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  footerText: {
    height: 15,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    width: '30%',
  },
});
