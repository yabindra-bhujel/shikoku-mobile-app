import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    TextInput,
    ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import UserServices, { UserProfile } from "@/src/api/UserServices";
import Ionicons from "@expo/vector-icons/Ionicons";
import Markdown from "react-native-markdown-display";

interface BioProps {
    userData?: UserProfile;
    getProfile: () => void;
}

const Bio = ({ userData, getProfile}: BioProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isBioEditing, setIsBioEditing] = useState<boolean>(false);
    const [bio, setBio] = useState<string>("");

    useEffect(() => {
        setBio(userData?.bio || "");
    }, [userData]);

    const handleEditing = () => {
        setIsBioEditing(true);
    };

    const saveBio = async () => {
        if (bio.trim() === userData?.bio || bio.trim() === "") {
            setIsBioEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            await UserServices.UserProfile.updateBio(bio);
            getProfile();
            setIsBioEditing(false);
        } catch (error) {
            Alert.alert("プロフィールの更新に失敗しました。再度お試しください。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Ionicons name="person-circle-outline" size={24} color="#0033EA" />
                    <Text style={styles.sectionTitle}>プロフィール</Text>
                </View>
                <View>
                    {isBioEditing ? (
                        <TouchableOpacity onPress={saveBio} style={styles.iconButton}>
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#2196F3" />
                            ) : (
                                <Ionicons name="checkmark-circle-outline" size={24} color="#2196F3" />
                            )}
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleEditing} style={styles.iconButton}>
                            <Ionicons name="pencil-outline" size={24} color="#9C27B0" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.item}>
                {isBioEditing ? (
                    <TextInput
                        style={[styles.itemText, styles.textInput]}
                        value={bio}
                        onChangeText={setBio}
                        multiline
                        placeholder="プロフィールを入力"
                    />
                ) : (
                    <Markdown style={styles.markdown}>
                        {bio || "*プロフィールが登録されていません。編集ボタンを押して追加してください。*"}
                    </Markdown>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginTop: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    item: {
        marginTop: 10,
    },
    itemText: {
        fontSize: 16,
        color: '#666',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    textInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    iconButton: {
        padding: 5,
    },
    markdown: {
        fontSize: 16,
        color: '#333',
    },
});

export default Bio;
