import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import { UIColors } from "../../styles/theme/colors";

export default function TabLayout() {
  const { user } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const tabBarBgColor = isDark ? UIColors.dark.tabBar : UIColors.light.tabBar;
  const activeTabColor = UIColors.brandGreen;
  const inactiveTabColor = isDark
    ? UIColors.dark.textSecondary
    : UIColors.light.textSecondary;
  const headerBgColor = isDark ? UIColors.dark.navBar : UIColors.light.navBar;
  const headerTextColor = isDark ? UIColors.dark.text : UIColors.light.text;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTabColor,
        tabBarInactiveTintColor: inactiveTabColor,
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
          backgroundColor: headerBgColor,
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: headerTextColor,
        },
        headerTintColor: headerTextColor,

        headerTitle: "",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          headerTitle: "Lion's Den Cinemas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="movies"
        options={{
          title: "Movies",
          tabBarLabel: "Movies",
          headerTitle: "Movies",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tickets"
        options={{
          title: "My Tickets",
          tabBarLabel: "Tickets",
          headerTitle: "My Tickets",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="concessions"
        options={{
          title: "Order Food",
          tabBarLabel: "Food",
          headerTitle: "Order Food",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fast-food" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          headerTitle: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
