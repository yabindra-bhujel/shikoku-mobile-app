import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    useColorScheme,
  } from "react-native";
  import Ionicons from "@expo/vector-icons/Ionicons";
  import { useRouter } from "expo-router";
  import Button from "@/src/ReusableComponents/Button";
  
  const PostCreateHeader = ({post}) => {
    const theme = useColorScheme();
    const router = useRouter();
  
    const goBack = () => {
      router.back();
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
              投稿作成
            </Text>
          </View>
  
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <Button
             title="投稿"
             onPress={post}
              />
          </View>
        </View>
      </View>
    );
  };
  
  export default PostCreateHeader;
  