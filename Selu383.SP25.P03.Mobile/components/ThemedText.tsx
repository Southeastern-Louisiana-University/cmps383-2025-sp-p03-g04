import { Text } from "react-native";
import { useColorScheme } from "react-native";
import { Colors } from "../styles/theme/colors";
import { ThemedTextProps } from "../types/components/uiComponents";

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const color = isDark ? Colors.dark.text : Colors.light.text;

  let typeStyle = {};

  switch (type) {
    case "title":
      typeStyle = {
        fontSize: 32,
        fontWeight: "bold",
        lineHeight: 32,
      };
      break;
    case "defaultSemiBold":
      typeStyle = {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "600",
      };
      break;
    case "subtitle":
      typeStyle = {
        fontSize: 20,
        fontWeight: "bold",
      };
      break;
    case "link":
      typeStyle = {
        lineHeight: 30,
        fontSize: 16,
        color: "#0a7ea4",
      };
      break;
    default:
      typeStyle = {
        fontSize: 16,
        lineHeight: 24,
      };
  }

  return <Text style={[{ color }, typeStyle, style]} {...rest} />;
}
