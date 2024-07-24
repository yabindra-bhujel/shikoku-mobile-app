import React, { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";

const TextArea = ({text, setText}) => {

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textArea}
                placeholder="共有する内容を入力してください！"
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
