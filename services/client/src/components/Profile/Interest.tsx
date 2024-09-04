import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import UserInfoServices from "@/src/api/UserInfo";

interface InterestSchema {
    id: number;
    name: string;
}

interface InterestProps {
    interestsProps: InterestSchema[] | undefined;
    fetchUserInfo: () => void;
}

const Interest: React.FC<InterestProps> = ({ interestsProps, fetchUserInfo }) => {
    const [isInterestEditing, setIsInterestEditing] = useState<boolean>(false);
    const [interests, setInterests] = useState<InterestSchema[]>([]);
    const [newInterest, setNewInterest] = useState<string>('');
    const interestColors = ["#FFC107", "#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#FF9800"];

    useEffect(() => {
        if (interestsProps) {
            setInterests(interestsProps);
        }
    }, [interestsProps]);

    const handleEditing = () => {
        setIsInterestEditing(true);
    };

    const updateInterest = () => {
        setIsInterestEditing(false);
        setNewInterest('');
    };

    const addInterest = async () => {
        if (newInterest.trim() === '') {
            return;
        }

        try {
            const response = await UserInfoServices.addInterest(newInterest);
            if (response.status === 201) {
                fetchUserInfo();
                setNewInterest('');
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to add interest. Please try again.');
        }
    };

    const handleDeleteInterest = async (id: number) => {
        try {
            const response = await UserInfoServices.deleteInterest(id);
            if (response.status === 204) {
                fetchUserInfo();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to delete interest');
        }
    }

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Ionicons name="heart" size={20} color="red" />
                    <Text style={styles.sectionTitle}>興味 / 特技</Text>
                </View>
                <TouchableOpacity onPress={isInterestEditing ? updateInterest : handleEditing}>
                    <Ionicons name={isInterestEditing ? "save" : "create"} size={24} color={isInterestEditing ? "#4CAF50" : "#FF9800"} />
                </TouchableOpacity>
            </View>

            <View style={styles.interestContainer}>
                
                {isInterestEditing ? (
                    <View style={styles.editContainer}>
                        {interests.map((interest) => (
                            <View key={interest.id} style={[styles.interestBadge, { backgroundColor: interestColors[interests.findIndex(i => i.id === interest.id) % interestColors.length] }]}>
                                <Ionicons name="heart-outline" size={16} color="#fff" />
                                <Text style={styles.interestText}>{interest.name}</Text>
                                <TouchableOpacity onPress={() => handleDeleteInterest(interest.id)}>
                                    <Ionicons name="remove-circle" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <View style={styles.addContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="新しい興味を入力"
                                value={newInterest}
                                onChangeText={setNewInterest}
                            />
                            <TouchableOpacity onPress={addInterest}>
                                <View style={styles.addBtn}>
                                    <Ionicons name="add" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.interestContainer}>
                        {interests.length === 0 &&
                    <Text>
                        興味や特技が登録されていません。編集ボタンを押して追加してください。
                    </Text>}
                        {interests.map((interest) => (
                            <View key={interest.id} style={[styles.interestBadge, { backgroundColor: interestColors[interests.findIndex(i => i.id === interest.id) % interestColors.length] }]}>
                                <Ionicons name="heart-outline" size={16} color="#fff" />
                                <Text style={styles.interestText}>{interest.name}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        minHeight: 150,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    interestContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    editContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    addContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    interestBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#FF5733',
    },
    interestText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 50,
        padding: 10,
        marginRight: 10,
        flex: 1,
        fontWeight: '600',
        minWidth: 200,
    },
    addBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#FF5733',
        borderRadius: 50,
    }
});

export default Interest;
