import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/AuthProvider';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '../components/ThemedText';
import { clearAuthStorage, logStorageKeys } from '../utils/DevUtils';

// Set this to true during development to enable the clear storage button
const DEVELOPMENT_MODE = true;

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showDevButtons, setShowDevButtons] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Function to clear auth storage and restart app flow
  const handleClearAuthStorage = async () => {
    try {
      await clearAuthStorage();
      Alert.alert('Storage Cleared', 'Auth storage has been cleared. App will restart.');
      router.replace('/role-selection');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };
  
  // Function to log current storage for debugging
  const handleLogStorage = async () => {
    await logStorageKeys();
    Alert.alert('Storage Logged', 'Check your console for storage contents');
  };
  
  // Secret gesture to show dev buttons (tap title 5 times)
  const handleTitlePress = () => {
    if (!DEVELOPMENT_MODE) return;
    
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowDevButtons(true);
        return 0;
      }
      return newCount;
    });
  };
  
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // Avoid navigation if already navigating
        if (isNavigating || isLoading) return;
        
        // For development: uncomment this line to clear storage on every app launch
        // await clearAuthStorage();
        
        setIsNavigating(true);
        
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/role-selection');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        // In case of error, always go to role selection
        router.replace('/role-selection');
      }
    };
    
    checkFirstLaunch();
  }, [user, isLoading]);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={handleTitlePress}
      >
        <ThemedText style={styles.logoText}>Lion's Den Cinemas</ThemedText>
      </TouchableOpacity>
      
      <ActivityIndicator size="large" color="#B4D335" />
      <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      
      {DEVELOPMENT_MODE && showDevButtons && (
        <View style={styles.devButtonsContainer}>
          <TouchableOpacity 
            style={styles.devButton}
            onPress={handleClearAuthStorage}
          >
            <ThemedText style={styles.devButtonText}>Clear Auth Storage</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.devButton}
            onPress={handleLogStorage}
          >
            <ThemedText style={styles.devButtonText}>Log Storage</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E2429',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B4D335',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#9BA1A6',
  },
  devButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  devButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  devButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});