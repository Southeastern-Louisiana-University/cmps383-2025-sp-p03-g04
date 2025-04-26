import { Stack } from "expo-router";
import { useTheme } from "../../components/ThemeProvider";

export default function FoodCheckoutLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? "#1E2429" : "#FFFFFF",
        },
        headerTintColor: isDark ? "#FFFFFF" : "#242424",
        contentStyle: {
          backgroundColor: isDark ? "#1E2429" : "#FFFFFF",
        },
      }}
    />
  );
}
