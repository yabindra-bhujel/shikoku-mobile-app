import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";

const CommunityPageHeader = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const navigateToCreatePost = () => {
    router.push("/createpost");
  };

  return (
    <View style={styles.communityHomeHeader}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={goBack} style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="chevron-back-sharp" size={24} color="black" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Community
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
        <AntDesign
          name="search1"
          size={24}
          color="black"
          style={{ marginRight: 10, fontWeight: "bold" }}
        />
        <Ionicons
          name="notifications"
          size={24}
          color="black"
          style={{ marginRight: 10, fontWeight: "bold" }}
        />
        <TouchableOpacity onPress={navigateToCreatePost}>
          <FontAwesome6
            name="add"
            size={24}
            color="black"
            style={{ marginRight: 20, fontWeight: "bold" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  communityHomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
});

export default CommunityPageHeader;
