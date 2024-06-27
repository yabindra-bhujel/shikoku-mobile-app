import React, { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";

const TextArea = () => {
    const [text, setText] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textArea}
                placeholder="Some regular text"
                placeholderTextColor="gray"
                value={text}
                onChangeText={setText}
                multiline={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    textArea: {
        height: "auto",
        borderColor: 'gray',
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 16,
        color: 'black',
    },
});

export default TextArea;
