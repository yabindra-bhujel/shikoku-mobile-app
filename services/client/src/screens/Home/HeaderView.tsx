import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UserAvatar from "@/src/components/UserAvatar";
import { useUser } from "@/src/hooks/UserContext";

const HeaderView = () => {

  const theme = useColorScheme();
  const deviceWidth = Dimensions.get("window").width;
  const { image, fullname, email } = useUser();

  const styles = StyleSheet.create({
    HeaderContainer: {
      height: 220,
      width: "100%",
      backgroundColor: theme === "dark" ? "#333" : "#f3f3f3",
    },
    useComponentContainer: {
      height: 155,
      width: "100%",
    },
    HeaderGradient: {
      width: "100%",
      height: 155,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    GradientChild: {
      width: 258,
      padding: 10,
      height: 108,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    useComponents: {
      flex: 1,
      marginHorizontal: 30,
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    userLeftContainer: {
      gap: 7,
      flexDirection: "row",
      alignItems: "center",
    },
    userMemoContainer: {
      position: "absolute",
      top: 108,
      height: 108,
      width: "100%",
    },
    userMemo: {
      height: 108,
      marginHorizontal: 20,
      borderRadius: 15,
      flexDirection: "row",
    },

    base: {
      flexDirection: "row",
    },
    baseTopLeft: {
      borderLeftWidth: 35,
      borderTopWidth: 54,
      borderTopColor: "transparent",
      borderBottomWidth: 54,
      borderBottomColor: "transparent",
      height: 0,
      width: 0,
    },
    baseBottomLeft: {
      height: 108,
      width: 100,
    },

    flag: {
      position: "relative",
    },
    flagTop: {},
    flagBottom: {
      position: "absolute",
      width: 0,
      height: 0,
      left: -35,
      borderTopWidth: 54,
      borderTopColor: "#513D70",
      borderBottomWidth: 54,
      borderBottomColor: "#513D70",
      borderLeftWidth: 35,
      borderLeftColor: "transparent",
    },
    GradientChildRight: {
      width: deviceWidth - 149,
      padding: 20,
      height: 108,
      justifyContent: "center",
      alignItems: "center",
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
    },
    GradientChildLeft: {
      width: 110,
      height: 108,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
    },
    LeftBoardContainer: {
        height: 108,
        justifyContent: "center",
        alignItems: "center",
    }
  });

  return (
    <View style={styles.HeaderContainer}>
      <View style={styles.useComponentContainer}>
        <LinearGradient
          colors={["#591FA3", "#551E9C", "#210C3D"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.HeaderGradient}
        >
          <View style={styles.useComponents}>
            <View style={styles.userLeftContainer}>
              <UserAvatar url={image}/>
              <View>
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  {fullname?.toLocaleUpperCase()}
                </Text>
                <Text style={{ color: "white", fontSize: 14 }}>
                  {email}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.userMemoContainer}>
        <View style={styles.userMemo}>
          <View style={styles.base}>
            <LinearGradient
              colors={["#2F6982", "#0A171C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1.2 }}
              style={styles.GradientChildLeft}
            >
               <View style={styles.LeftBoardContainer}>
                <Text style={{ color: "#fff" }}>Hello world</Text>
               </View>
              <View style={styles.baseBottomLeft} />
              <View style={styles.baseTopLeft} />
            </LinearGradient>
          </View>

          <View>
            <LinearGradient
              colors={["#9A76D6", "#9773D1", "#513D70"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.GradientChildRight}
            >
              <Text style={{ color: "#fff" }}>
                Learn from yesterday, live for today hope for tomorrow. The
                important thing is not to stop questioning.
              </Text>
            </LinearGradient>
            <View style={styles.flagTop} />
            <View style={styles.flagBottom} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HeaderView;
