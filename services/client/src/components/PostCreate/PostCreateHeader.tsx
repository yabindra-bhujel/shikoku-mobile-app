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
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
  
  const PostCreateHeader = ({post}) => {
    const theme = useColorScheme();
    const router = useRouter();
    const {t} = useTranslation();
  
    const goBack = () => {
      router.back();
    };
  
    const styles = StyleSheet.create({
      container: {},
      communityHomeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
      },
    });
  
    return (
      <SafeAreaView style={styles.container}>
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
                fontSize: 20,
                fontWeight: "bold",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              {t("Community.createpost")}
            </Text>
          </View>
  
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
             title={t("Community.post")}
             onPress={post}
             paddingHorizontal={18}
             paddingVertical={8}
              />
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  export default PostCreateHeader;
  