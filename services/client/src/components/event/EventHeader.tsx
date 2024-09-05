
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    useColorScheme,
  } from "react-native";
  import Ionicons from "@expo/vector-icons/Ionicons";
  import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
  
  const EventHeader = () => {
    const theme = useColorScheme();
    const router = useRouter();
    const {t} = useTranslation();
  
    const goBack = () => {
      router.back();
    };
  
    const styles = StyleSheet.create({
   
      header: {
        flexDirection: "row",
        gap: 10,
        padding: 10,
        backgroundColor: theme === "dark" ? "#333" : "#fff",
      },
      
    });
  
    return (
        <View>
        <View
          style={{
            height: 54,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
          }}
        />
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={goBack}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons
                name="chevron-back-sharp"
                size={24}
                color={theme === "dark" ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              {t("schoolEvent.schooleventTitle")}
            </Text>
          </View>
  
        </View>
      </View>
    );
  };
  
  export default EventHeader;
  