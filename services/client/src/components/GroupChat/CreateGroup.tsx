import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import axiosInstance from '@/src/config/Api';
import UserAvatar from '../UserAvatar';
import { CheckBox } from 'react-native-elements';

interface UserData {
    user_image?: string;
    name: string;
    id: number;
}

const users: UserData[] = [
    {
        user_image: "https://randomuser.me/api/portraits/men/1.jpg",
        name: "John Doe",
        id: 1
    },
    {
        user_image: "https://randomuser.me/api/portraits/women/1.jpg",
        name: "Jane Smith",
        id: 2
    },
    {
        user_image: "https://randomuser.me/api/portraits/men/2.jpg",
        name: "Alice Johnson",
        id: 3
    },
    {
        user_image: "https://randomuser.me/api/portraits/men/3.jpg",
        name: "Bob Brown",
        id: 4
    },
    {
        user_image: "https://randomuser.me/api/portraits/men/4.jpg",
        name: "Charlie Davis",
        id: 5
    },
    {
        user_image: "https://randomuser.me/api/portraits/women/2.jpg",
        name: "Diana Evans",
        id: 6
    },
    {
        user_image: "https://randomuser.me/api/portraits/men/5.jpg",
        name: "Evan Frank",
        id: 7
    },
    {
        user_image: "https://randomuser.me/api/portraits/women/3.jpg",
        name: "Fiona Green",
        id: 8
    },
    {
        user_image: "https://randomuser.me/api/portraits/men/6.jpg",
        name: "George Harris",
        id: 9
    },
    {
        user_image: "https://randomuser.me/api/portraits/women/4.jpg",
        name: "Hannah Isaac",
        id: 10
    }
];

const CreateGroup = ({ toggleCloseModal }) => {
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [searchText, setSearchText] = useState<string>('');

    const handleCreateGroup = async () => {
        try {
            if (!groupName || !description) {
                Alert.alert('Please fill all the fields');
                return;
            }
            await axiosInstance.post('/groups', {
                name: groupName,
                description: description,
                members: Array.from(selectedUsers)  // Pass selected user IDs
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toggleCloseModal();
        } catch (error) {
            Alert.alert('Something went wrong. Please try again.');
        }
    };

    const handleCloseModal = () => {
        toggleCloseModal();
    };

    const toggleUserSelection = (userId: number) => {
        setSelectedUsers(prevSelectedUsers => {
            const updatedSelection = new Set(prevSelectedUsers);
            if (updatedSelection.has(userId)) {
                updatedSelection.delete(userId);
            } else {
                updatedSelection.add(userId);
            }
            return updatedSelection;
        });
    };

    const filterUsers = (users: UserData[], searchText: string) => {
        if (!searchText) return users;
        return users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));
    };

    const sortedUsers = [
        ...Array.from(selectedUsers).map(id => users.find(user => user.id === id)),
        ...filterUsers(users, searchText).filter(user => !selectedUsers.has(user.id))
    ].filter(Boolean) as UserData[];

    const UserAvatarAndUsername = () => {
        return (
            <View style={styles.userListContainer}>
                <TextInput
                    label="Search User"
                    mode="outlined"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                />
                <ScrollView style={styles.userScrollView}>
                    {sortedUsers.map(user => (
                        <View key={user.id} style={styles.userItem}>
                            <View style={styles.userInfo}>
                                <UserAvatar
                                    url={user.user_image}
                                    width={30}
                                    height={30}
                                />
                                <Text style={styles.userName}>
                                    {user.name}
                                </Text>
                            </View>
                            <CheckBox
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checkedColor='green'
                                checked={selectedUsers.has(user.id)}
                                onPress={() => toggleUserSelection(user.id)}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Group</Text>
                        <TouchableOpacity onPress={handleCloseModal}>
                            <Ionicons name="close-sharp" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        label="Group Name"
                        mode="outlined"
                        value={groupName}
                        onChangeText={setGroupName}
                        style={styles.input}
                    />
                    <TextInput
                        label="Description"
                        mode="outlined"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        style={[styles.input, styles.description]}
                    />
                    <UserAvatarAndUsername />
                    <Button mode="contained" onPress={handleCreateGroup} style={styles.createButton}>
                        Create
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
    },
    input: {
        marginBottom: 20,
    },
    description: {
        height: 100,
    },
    createButton: {
        marginTop: 10,
    },
    userListContainer: {
        flex: 1,
    },
    searchInput: {
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'white',
    },
    userScrollView: {
        maxHeight: 150,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 10,
    },
});

export default CreateGroup;
