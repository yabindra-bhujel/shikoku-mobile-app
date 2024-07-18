import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import GroupServices from '@/src/api/GroupServices';
import { GroupData } from './GroupHeader';

export default function SettingModal() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [groupInfo, setGroupInfo] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupId) return;

      try {
        const response = await GroupServices.getGroupById(groupId);
        setGroupInfo(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch group information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupInfo();
  }, [groupId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!groupInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Group not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.groupInfoContainer}>
        <Text style={styles.groupName}>Group Name: {groupInfo.name}</Text>
        <Text style={styles.groupId}>Group ID: {groupInfo.id}</Text>
        <Text style={styles.groupDescription}>Description: {groupInfo.description}</Text>
        <Text style={styles.groupMemberCount}>Members: {groupInfo.member_count}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  groupInfoContainer: {
    padding: 20,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  groupId: {
    fontSize: 16,
    marginBottom: 10,
  },
  groupDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  groupMemberCount: {
    fontSize: 16,
    marginBottom: 10,
  },
});
