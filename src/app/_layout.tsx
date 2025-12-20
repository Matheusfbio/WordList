import { Stack, Tabs } from "expo-router";
import { TabBar, TabBarItem } from "react-native-tab-view";
import { Header } from "react-native/Libraries/NewAppScreen";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: "dark",
      }}
    >
      <Stack.Screen name="(top-tabs)" />
    </Stack>
  );
}
