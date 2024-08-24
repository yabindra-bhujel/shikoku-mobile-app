import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    useColorScheme,
  } from "react-native";
  import Ionicons from "@expo/vector-icons/Ionicons";
  import { useRouter } from "expo-router";
  
  const NewEventHeader = () => {
    const theme = useColorScheme();
    const router = useRouter();
  
    const goBack = () => {
      router.back();
    };
  
    const styles = StyleSheet.create({
      header: {
        flexDirection: "row",
        alignItems: "center", 
        padding: 5,
        backgroundColor: theme === "dark" ? "#333" : "#fff",
      },
      button: {
        flexDirection: "row",
        alignItems: "center",
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
          <TouchableOpacity onPress={goBack} style={styles.button}>
            <Ionicons
              name="chevron-back-sharp"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  export default NewEventHeader;
  