import { Text, View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled, useColorScheme } from "nativewind";

export const StyledText = styled(Text);

export default function Modal() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  // If the page was reloaded or navigated to directly, then the modal should be presented as
  // a full screen page. You may need to change the UI to account for this.
  const isPresented = router.canGoBack();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && <Link href="../">Dismiss</Link>}
      {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text>Hello wolrd</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
