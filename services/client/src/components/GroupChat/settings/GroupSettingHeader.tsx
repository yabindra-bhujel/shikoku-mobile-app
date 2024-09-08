import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import GroupServices from "@/src/api/GroupServices";

interface GroupSettingHeaderProps {
    groupImage?: string[];
    groupInfo: {
        id: string;
        name: string;
        description: string;
    };
    isDark: boolean;
    handleShowNameChange: () => void;
    handleShowAddMember: () => void;
    pickImage: () => void;
    refresDetaiScreen: () => void;
}

const GroupSettingHeader = ({ groupImage = [], groupInfo, isDark, handleShowNameChange, handleShowAddMember, pickImage, refresDetaiScreen }: GroupSettingHeaderProps) => {
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
    const [groupName, setGroupName] = React.useState<string>(groupInfo.name);
    const [groupDescription, setGroupDescription] = React.useState<string>(groupInfo.description);
    const [groupId, setGroupId] = React.useState<string>(groupInfo.id);

    const handleEditModeToggle = () => {
        setIsEditMode(!isEditMode);
    }

    useEffect(() => {
        setGroupName(groupInfo.name);
        setGroupDescription(groupInfo.description);
        setGroupId(groupInfo.id);
    }, [groupInfo]);

    const handleUpdateGroup = async () => {
        if (groupName === groupInfo.name && groupDescription === groupInfo.description){
            setIsEditMode(false);
            return;
        };

        const data = {
            name: groupName,
            description: groupDescription,
            group_type: "private",
        };

        try {
            const res = await GroupServices.updateGroup(groupId, data);
            refresDetaiScreen();
            setIsEditMode(false);
        } catch (error) {
            Alert.alert("Error", "Failed to update group. Please try again.");
        }
    };

    return (
        <View style={[styles.headerContainer, { borderBottomColor: isDark ? '#444' : '#ddd', backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={isEditMode ? handleUpdateGroup : handleEditModeToggle}>
                    <Ionicons
                        name={isEditMode ? "checkmark-done-circle" : "create-outline"}
                        size={24}
                        color={isEditMode ? "#03DAC6" : "#6200EE"}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={pickImage}>
                {groupImage.length > 0 ? (
                    <Image
                        source={{ uri: groupImage[groupImage.length - 1] }}
                        style={styles.groupImage}
                    />
                ) : (
                    <View style={[styles.groupInitialContainer, { backgroundColor: isDark ? '#555' : '#e0e0e0' }]}>
                        <Text style={[styles.groupInitial, { color: isDark ? "white" : "#000" }]}>
                            {groupInfo?.name?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={isEditMode ? [styles.nameAndDetailCard, { backgroundColor: isDark ? '#444' : '#fff' }] : styles.defaultCard}>
                {isEditMode ? (
                    <>
                        <TextInput
                            style={styles.groupNameEdit}
                            value={groupName}
                            onChangeText={setGroupName}
                            autoFocus
                            placeholder="Group Name"
                        />
                        <TextInput
                            style={styles.groupDescriptionEdit}
                            value={groupDescription}
                            onChangeText={setGroupDescription}
                            multiline
                            placeholder="Group Description"
                        />
                    </>
                ) : (
                    <>
                        <Text style={[styles.groupName, { color: isDark ? "white" : "black" }]}>
                            {groupName}
                        </Text>
                        <Text style={[styles.groupDescription, { color: isDark ? "white" : "black" }]}>
                            {groupDescription}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
}

export default GroupSettingHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },

    headerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderRadius: 10,
    },

    groupDescription: {
        fontSize: 16,
        marginVertical: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    groupDescriptionEdit: {
        width: '100%',
        minHeight: 100,
        fontSize: 18,
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },

    groupImage: {
        height: 150,
        width: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: '#897DFA',
    },

    groupInitial: {
        fontSize: 40,
        fontWeight: "bold",
    },

    groupInitialContainer: {
        height: 100,
        width: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
    },

    groupName: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    groupNameEdit: {
        width: '100%',
        fontSize: 18,
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },

    defaultCard: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    nameAndDetailCard: {
        marginTop: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});
