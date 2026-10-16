import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import "../../../global.css";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        title: "Dashboard", tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="Jobs" options={{
        title: "Jobs", tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'clipboard' : 'clipboard-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="Map" options={{
        title: "Map", tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'location-sharp' : 'location-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="More" options={{
        title: "More", tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'menu-sharp' : 'menu-outline'} color={color} size={24} />
        ),
      }} />
    </Tabs>
  );
}
