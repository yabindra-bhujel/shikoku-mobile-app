import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, StyleSheet, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

const TextArea = ({text, setText}) => {
    const {t} = useTranslation();

    const color = useThemeColor({}, "text");

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.textArea, {color}]}
                placeholder={t("Community.clicktoinput")}
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
        minHeight: 80,
        borderColor: 'gray',
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 16,
    },
});

export default TextArea;
