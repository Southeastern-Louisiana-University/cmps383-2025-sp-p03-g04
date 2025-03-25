import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../components/AuthProvider';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  
  // Set color scheme based on user's preference
  const isDark = colorScheme === 'dark';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#B4D335', // Lion's Den green
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
          backgroundColor: '#B4D335', // Lion's Den green
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#242424',
        },
      }}
    >
      {/* Home tab - visible to all users */}
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
      
      {/* Customer-specific tabs */}
      {user?.role === 'customer' && (
        <>
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
        </>
      )}
      
      {/* Staff-specific tabs */}
      {user?.role === 'staff' && (
        <>
          <Tabs.Screen
            name="orders"
            options={{
              title: "Order Queue",
              tabBarLabel: "Orders",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />
          
          <Tabs.Screen
            name="delivery"
            options={{
              title: "Delivery",
              tabBarLabel: "Delivery",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="navigate" size={size} color={color} />
              ),
            }}
          />
          
          <Tabs.Screen
            name="scan"
            options={{
              title: "Scan Tickets",
              tabBarLabel: "Scan",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="qr-code" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
      
      {/* Manager-specific tabs */}
      {user?.role === 'manager' && (
        <>
          <Tabs.Screen
            name="dashboard"
            options={{
              title: "Dashboard",
              tabBarLabel: "Dashboard",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart" size={size} color={color} />
              ),
            }}
          />
          
          <Tabs.Screen
            name="schedule"
            options={{
              title: "Schedule",
              tabBarLabel: "Schedule",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar" size={size} color={color} />
              ),
            }}
          />
          
          <Tabs.Screen
            name="management"
            options={{
              title: "Manage",
              tabBarLabel: "Manage",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cog" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
      
      {/* Profile tab - visible to all users */}
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