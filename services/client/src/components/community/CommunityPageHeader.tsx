import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

const CommunityPageHeader = ({ headerTitle }: { headerTitle: string }) => {
  const theme = useColorScheme();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const navigateToCreatePost = () => {
    router.push("/createpost");
  };

  const styles = StyleSheet.create({
    container: {},
    communityHomeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "lightgray",
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 54,
          backgroundColor: theme === "dark" ? "#333" : "#fff",
        }}
      />
      <View style={styles.communityHomeHeader}>
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

            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            {headerTitle}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <AntDesign
            name="search1"
            size={24}
            color={theme === "dark" ? "#fff" : "#000"}
            style={{ marginRight: 10, fontWeight: "bold" }}
          />
          <Ionicons
            name="notifications"
            size={24}
            color={theme === "dark" ? "#fff" : "#000"}
            style={{ marginRight: 10, fontWeight: "bold" }}
          />
          <TouchableOpacity onPress={navigateToCreatePost}>
            <FontAwesome6
              name="add"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
              style={{ marginRight: 20, fontWeight: "bold" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CommunityPageHeader;
