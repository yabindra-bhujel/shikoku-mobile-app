import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import UserInfoServices from "@/src/api/UserInfo";

interface ClubActivitySchema {
    id: number;
    name: string;
}

interface ClubActivityProps {
    clubActivitiesProps: ClubActivitySchema[] | undefined;
    fetchUserInfo: () => void;
}

const ClubActivity: React.FC<ClubActivityProps> = ({ clubActivitiesProps, fetchUserInfo }) => {
    const [isActivityEditing, setIsActivityEditing] = useState<boolean>(false);
    const [newActivity, setNewActivity] = useState<string>('');
    const [isActivityLoading, setIsActivityLoading] = useState<boolean>(false);
    const [activity, setActivity] = useState<ClubActivitySchema[]>([]);

    useEffect(() => {
        setActivity(clubActivitiesProps || []);
    }, [clubActivitiesProps]);

    const handleEditing = () => {
        setIsActivityEditing(true);
    };

    const updateClubActivity = () => {
        setIsActivityEditing(false);
    };

    const addClubActivity = async () => {
        if (newActivity.trim() === '') return;

        setIsActivityLoading(true);
        try {
            const response = await UserInfoServices.addClubActivities(newActivity);
            if (response.status === 201) {
                fetchUserInfo();
                setNewActivity('');
            }
        } catch (error) {
            Alert.alert('エラー', '部活 / サークルの追加に失敗しました。再度お試しください。');
        } finally {
            setIsActivityLoading(false);
        }
    };

    const handleDeleteInterest = async (id: number) => {
        try {
            const response = await UserInfoServices.deleteClubActivities(id);
            if (response.status === 204) {
                fetchUserInfo();
            }
        } catch (error) {
            Alert.alert('エラー', '部活 / サークルの削除に失敗しました。再度お試しください。');
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Ionicons name="people-circle-outline" size={24} color="#6200EE" />
                    <Text style={styles.sectionTitle}>部活 / サークル</Text>
                </View>
                <TouchableOpacity
                    onPress={isActivityEditing ? updateClubActivity : handleEditing}
                    accessibilityLabel={isActivityEditing ? "Save Changes" : "Edit Activities"}
                >
                    <Ionicons
                        name={isActivityEditing ? "checkmark-done-circle" : "create-outline"}
                        size={24}
                        color={isActivityEditing ? "#6200EE" : "#03DAC6"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.activityContainer}>
                {isActivityEditing ? (
                    <View style={styles.editContainer}>
                        {activity.map((item) => (
                            <View key={item.id} style={styles.activityCard}>
                                <Ionicons name='list-circle' size={24} color="#333" />
                                <Text style={styles.activityText}>{item.name}</Text>
                                <TouchableOpacity onPress={() => handleDeleteInterest(item.id)} accessibilityLabel="Delete Activity">
                                    <Ionicons name="close-circle-outline" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <View style={styles.addContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="新しい活動を追加"
                                value={newActivity}
                                onChangeText={setNewActivity}
                            />
                            <TouchableOpacity onPress={addClubActivity} accessibilityLabel="Add New Activity">
                                <View style={styles.addBtn}>
                                    {isActivityLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="add-outline" size={24} color="white" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View>
                        {activity.length === 0 && <Text>部活 / サークルが登録されていません。編集ボタンを押して追加してください。</Text>}
                        {activity.map((item) => (
                            <View style={styles.activityCard} key={item.id}>
                                <Ionicons name='list-circle' size={24} color="#333" />
                                <Text style={styles.activityText}>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

export default ClubActivity;

const styles = StyleSheet.create({
    section: {
        marginTop: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 7,
        elevation: 6,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        marginLeft: 12,
        fontSize: 22,
        fontWeight: '600',
        color: '#4A4A4A',
    },
    activityContainer: {
        marginTop: 10,
    },
    activityCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    activityText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#4A4A4A',
        flex: 1,
    },
    textInput: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 50,
        padding: 12,
        marginRight: 10,
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    addBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#6200EE',
        borderRadius: 50,
        shadowColor: '#6200EE',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },

    editContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    addContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },

    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});