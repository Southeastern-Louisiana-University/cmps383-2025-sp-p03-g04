// app/(tabs)/_layout.tsx - Update to include theater dropdown in header
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#65a30d', // Updated green color
        tabBarInactiveTintColor: '#9BA1A6',
        tabBarStyle: {
          backgroundColor: '#1E2429',
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
          backgroundColor: '#65a30d', // Updated green color
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#242424',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Theater",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      {/* Keep other tab screens */}
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