import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../components/AuthProvider';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoading) return;
    
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('../role-selection');
    }
  }, [user, isLoading]);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#B4D335" />
    </View>
  );
}