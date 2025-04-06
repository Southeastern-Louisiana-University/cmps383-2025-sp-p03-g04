import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../components/AuthProvider";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  // Set color scheme based on user's preference
  const isDark = colorScheme === "dark";

  // Define common colors for consistency
  const tabBarBgColor = "#1E2429";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#B4D335",
        tabBarInactiveTintColor: "#9BA1A6",
        tabBarStyle: {
          backgroundColor: tabBarBgColor,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: tabBarBgColor,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#FFFFFF",
        },
      }}
    >
      {/* Home Tab - Always visible */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Movies Tab - Always visible */}
      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          tabBarLabel: "Movies",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />

      {/* Tickets Tab - Always visible, but will show login prompt if not authenticated */}
      <Tabs.Screen
        name="tickets"
        options={{
          title: "My Tickets",
          tabBarLabel: "Tickets",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket" size={size} color={color} />
          ),
        }}
      />

      {/* Concessions Tab - Always visible */}
      <Tabs.Screen
        name="concessions"
        options={{
          title: "Order Food",
          tabBarLabel: "Food",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab - Always visible, but will show login prompt if not authenticated */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
