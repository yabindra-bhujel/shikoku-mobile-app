import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import axiosInstance from '@/src/config/Api';
import UserAvatar from '../UserAvatar';
import { CheckBox } from 'react-native-elements'


const CreateGroup = ({ toggleCloseModal }) => {
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const handleCreateGroup = async () => {
        try{
            if(!groupName || !description){
                Alert.alert('Please fill all the fields');
                return;
            }
        await axiosInstance.post('/groups', {
            name: groupName,
            description: description
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        toggleCloseModal();

    }
    catch(error){
       Alert.alert('Something went wrong. Please try again.');
    }

    };

    const handleCloseModal = () => {
        toggleCloseModal();
    }

    const UserAvatorAndUsername = () => {
        return (
            <View >
                <UserAvatar />
                <Text>Username</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',

                    }}>
                        <View>
                            <Text style={styles.title}>Create Group</Text>

                        </View>
                        <View>
                            <TouchableOpacity onPress={handleCloseModal}>
                                <Ionicons name="close-sharp" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

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
                    {/* user selection  */}
                    <CheckBox
                        title='User 1'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={false}
                    />
                    <UserAvatorAndUsername />

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
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
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
});

export default CreateGroup;
