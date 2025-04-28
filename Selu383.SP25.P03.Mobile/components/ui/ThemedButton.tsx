import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { useTheme } from "../ThemeProvider";
import { UIColors } from "../../styles/theme/colors";

interface ThemedButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textStyle?: any;
  children: React.ReactNode;
}

export function ThemedButton({
  variant = "primary",
  size = "medium",
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  children,
  ...rest
}: ThemedButtonProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const variantStyles = getVariantStyles(variant, isDark);

  const sizeStyles = getSizeStyles(size);

  const buttonStyles = [
    styles.button,
    variantStyles.button,
    sizeStyles.button,
    disabled && styles.buttonDisabled,
    disabled && variantStyles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variantStyles.text,
    sizeStyles.text,
    disabled && styles.textDisabled,
    disabled && variantStyles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variantStyles.loaderColor} />
      ) : (
        <>
          {leftIcon && <span style={styles.leftIcon}>{leftIcon}</span>}
          {typeof children === "string" ? (
            <ThemedText style={textStyles}>{children}</ThemedText>
          ) : (
            children
          )}
          {rightIcon && <span style={styles.rightIcon}>{rightIcon}</span>}
        </>
      )}
    </TouchableOpacity>
  );
}

function getVariantStyles(
  variant: ThemedButtonProps["variant"],
  isDark: boolean
) {
  switch (variant) {
    case "primary":
      return {
        button: {
          backgroundColor: UIColors.brandGreen,
          borderColor: "transparent",
        },
        buttonDisabled: {
          backgroundColor: isDark ? "#3A3A3A" : "#E5E5E5",
        },
        text: {
          color: "#242424",
        },
        textDisabled: {
          color: isDark ? "#707070" : "#A0A0A0",
        },
        loaderColor: "#242424",
      };

    case "secondary":
      return {
        button: {
          backgroundColor: isDark ? "#2A2A2A" : "#F5F5F5",
          borderColor: "transparent",
        },
        buttonDisabled: {
          backgroundColor: isDark ? "#3A3A3A" : "#E5E5E5",
        },
        text: {
          color: isDark ? UIColors.dark.text : UIColors.light.text,
        },
        textDisabled: {
          color: isDark ? "#707070" : "#A0A0A0",
        },
        loaderColor: isDark ? UIColors.dark.text : UIColors.light.text,
      };

    case "outline":
      return {
        button: {
          backgroundColor: "transparent",
          borderColor: UIColors.brandGreen,
          borderWidth: 1,
        },
        buttonDisabled: {
          borderColor: isDark ? "#3A3A3A" : "#E5E5E5",
        },
        text: {
          color: UIColors.brandGreen,
        },
        textDisabled: {
          color: isDark ? "#707070" : "#A0A0A0",
        },
        loaderColor: UIColors.brandGreen,
      };

    case "ghost":
      return {
        button: {
          backgroundColor: "transparent",
          borderColor: "transparent",
        },
        buttonDisabled: {},
        text: {
          color: UIColors.brandGreen,
        },
        textDisabled: {
          color: isDark ? "#707070" : "#A0A0A0",
        },
        loaderColor: UIColors.brandGreen,
      };

    default:
      return {
        button: {},
        buttonDisabled: {},
        text: {},
        textDisabled: {},
        loaderColor: "white",
      };
  }
}

function getSizeStyles(size: ThemedButtonProps["size"]) {
  switch (size) {
    case "small":
      return {
        button: {
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 4,
        },
        text: {
          fontSize: 12,
        },
      };

    case "large":
      return {
        button: {
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 8,
        },
        text: {
          fontSize: 18,
        },
      };

    case "medium":
    default:
      return {
        button: {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 6,
        },
        text: {
          fontSize: 16,
        },
      };
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  textDisabled: {},
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
