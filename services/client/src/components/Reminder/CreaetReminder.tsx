import React, { useState } from 'react';
import { useColorScheme, Modal, TextInput, Button, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const CreateReminder = ({ setModalVisible }) => {
    const theme = useColorScheme();
    const [newReminder, setNewReminder] = useState({
        title: '',
        description: '',
        time_to_remind: '',
        time_to_do: '',
    });

    const handleSave = async () => {
        // 保存処理の実装
    };

    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            padding: 20,
            paddingTop: 80,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
        },
        headerText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme === "dark" ? "#fff" : "#000",
        },
        modalInput: {
            width: '100%',
            padding: 10,
            marginVertical: 10,
            borderColor: theme === "dark" ? "#666" : "#ccc",
            borderWidth: 1,
            borderRadius: 5,
        },
        buttonContainer: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        button: {
            width: '48%',
        },
    });

    return (
        <Modal
            visible={true} // モーダルを常に表示するために true に設定
            animationType="slide"
            transparent={false}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="close" size={24} color="red" onPress={() => setModalVisible(false)} />
                    <Text style={styles.headerText}>Create Reminder</Text>
                    <View style={styles.button}>
                       <Ionicons name="add" size={24} color="red" onPress={() => setModalVisible(false)} />
                    </View>
                </View>

                {/* Inputs */}
                <TextInput
                    style={{
                        marginBottom: 20,
                        borderWidth: 0,
                        fontWeight: 'bold',
                        fontSize: 24,

                    }}
                    placeholder="会社説明会..."
                    value={newReminder.title}
                    onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
                />
                <TextInput
                   style={{
                        marginBottom: 20,
                        borderWidth: 0,
                        fontWeight: 'semibold',
                        fontSize: 18,
                   }}
                    placeholder="株式会社夢"
                    value={newReminder.description}
                    onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
                />

                {/* color selection */}
                
               
            </View>
        </Modal>
    );
};

export default CreateReminder;
