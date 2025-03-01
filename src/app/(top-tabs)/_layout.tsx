import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/utils/db/initDatabase";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs>
      <MaterialTopTabs.Screen name="index" options={{ title: "Word list" }} />
      <MaterialTopTabs.Screen name="History" options={{ title: "History" }} />
      <MaterialTopTabs.Screen
        name="Favorites"
        options={{ title: "Favorites" }}
      />
    </MaterialTopTabs>
  );
}
