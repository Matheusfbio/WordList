import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, statusBarStyle: "auto" }}>
      <Stack.Screen name="(top-tabs)" />
    </Stack>
  );
}
