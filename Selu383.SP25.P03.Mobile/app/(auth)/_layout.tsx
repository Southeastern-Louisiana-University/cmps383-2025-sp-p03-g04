import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#B4D335',
      },
      headerTintColor: '#242424',
    }} />
  );
}