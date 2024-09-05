import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

interface RepeatPickerTypes {
    repeat: string;
    setRepeat: any;
}

const CustomRepeatPicker: React.FC<RepeatPickerTypes> = ({ repeat, setRepeat }) => {
    const isDark = useColorScheme() === "dark";
    const {t} = useTranslation();

    const styles = StyleSheet.create({
        repeatContainer: {
          width: '90%',
          marginTop: 20,
          padding: 10,
          borderRadius: 10,
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isDark ? '#aaa': "#fff",
          color: "red",
        },
        repeatTitle: {
          fontSize: 16,
        },
        picker: {
          width: '70%',
          color: isDark ? '#333': "#fff",
        },
        item: {
        }
      });
  return (
    <View style={styles.repeatContainer}>
      <Text style={styles.repeatTitle}>{t("calendar.repeatTitle")}</Text>
      <Picker
        selectedValue={repeat}
        onValueChange={setRepeat}
        style={styles.picker}
      >
        <Picker.Item label={t("calendar.repeatNone")} value="none"/>
        <Picker.Item label={t("calendar.repeatDaily")} value="daily"/>
        <Picker.Item label={t("calendar.repeatWeekly")} value="weekly"/>
        <Picker.Item label={t("calendar.repeatMonthly")} value="monthly"/>
        <Picker.Item label={t("calendar.repeatYearly")} value="yearly"/>
      </Picker>
    </View>
  );
};

export default CustomRepeatPicker;