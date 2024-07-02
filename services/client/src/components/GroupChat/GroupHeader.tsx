import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    useColorScheme,
    Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

const GroupHeader = () => {
    const theme = useColorScheme();
    const router = useRouter();
    const goBack = () => {
        router.back();
    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        communityHomeHeader: {
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "lightgray",
        },
       
    });
    return(
        <View style={styles.communityHomeHeader}>
        <View style={{ flexDirection: "row",  alignItems: "center" }}>


            {/* 戻る */}
            <TouchableOpacity onPress={goBack}
                style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="chevron-back-sharp" size={24}
                    color={theme === "dark" ? "#fff" : "#000"}/>
            </TouchableOpacity>
        </View>

        <View
        style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 10,
        }}>

        <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,}}>
            <Image
                source={{
                    uri: "https://picsum.photos/seed/picsum/200/300",}}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                }}/>
            <View>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: theme === "dark" ? "#fff" : "#000",
                    }}>
                    キャリア形成
                </Text>
                <Text style={{
                    fontSize: 15,
                    color: theme === "dark" ? "#fff" : "#000",
                }}>メンバ- 50 </Text>
            </View>
        </View>
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
            }}>
            <TouchableOpacity >
                <AntDesign
                    name="setting"
                    size={24}
                    color={theme === "dark" ? "#fff" : "#000"}
                    style={{ marginRight: 10, fontWeight: "bold" }}
                />
            </TouchableOpacity>
        </View>
        </View>

    </View>

    )
};
export default GroupHeader;