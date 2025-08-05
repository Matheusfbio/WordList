import { Stack, Tabs } from "expo-router";
import { TabBar, TabBarItem } from "react-native-tab-view";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: "auto",
      }}
    >
      <Stack.Screen name="(top-tabs)" />
    </Stack>
  );
}
