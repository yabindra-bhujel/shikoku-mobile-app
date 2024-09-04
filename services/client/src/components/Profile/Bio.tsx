import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserServices, { UserProfile } from "@/src/api/UserServices";
import Ionicons from "@expo/vector-icons/Ionicons";
import Markdown from "react-native-markdown-display";


interface BioProps {
    userData?: UserProfile;
    getProfile: () => void;
}

const Bio = (
    { userData
        , getProfile
    }: BioProps

) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isBioEditing, setIsBioEditing] = useState<boolean>(false);
    const [bio, setBio] = useState<string>("");

    useEffect(() => {
        setBio(userData?.bio || "");
    }, [userData]);

    const handleEditing = () => {
        setIsBioEditing(true);
    }


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
                    <Ionicons name="people-outline" size={20} color="#333" />
                    <Text style={styles.sectionTitle}>BIO</Text>
                </View>
                <View>
                    {isBioEditing ? (
                        <TouchableOpacity onPress={saveBio}>
                            <Ionicons name="save" size={20} color="#2196F3" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => handleEditing("bio")}>
                            <Ionicons name="create" size={20} color="#9C27B0" />
                        </TouchableOpacity>
                    )}

                </View>
            </View>

            <View style={styles.item}>
                {isBioEditing ? (
                    <TextInput
                        style={[styles.itemText, { minHeight: 100 }]}
                        value={bio}
                        onChangeText={setBio}
                        multiline
                    />
                ) : (

                    <Markdown style={styles.itemText}>
                        {bio}
                    </Markdown>
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
    item: {
        marginTop: 10,
    },
    itemText: {
        fontSize: 16,
        color: '#666',
    }
});


export default Bio;