import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";

const ColorPicker = ({color, setColor, isDark}: {color: string, setColor: any, isDark: boolean}) => {
  const {t} = useTranslation();
  return (
    <View style={{
      width: "90%",
      backgroundColor: isDark? "#aaa" : '#fff',
      marginTop: 10,
      borderRadius: 10,
      padding: 10,
    }}>
      <Text style={{
        fontSize: 16,
      }}>{t("calendar.choosedotColor")} </Text>
      <Picker
        selectedValue={color}
        onValueChange={(itemValue, itemIndex) => setColor(itemValue)}
        style={{
          width: "100%",
        }}
      >
        <Picker.Item label={t("colors.red")} value="red"/>
        <Picker.Item label={t("colors.pink")} value="pink" />
        <Picker.Item label={t("colors.blue")} value="blue" />
        <Picker.Item label={t("colors.green")} value="green" />
        <Picker.Item label={t("colors.yellow")} value="yellow" />
      </Picker>
    </View>
  );
};

export default ColorPicker;