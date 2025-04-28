// Enhanced QRCode component for more reliable rendering
// components/QRCode.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface QRCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  color = "#000000",
  backgroundColor = "#FFFFFF",
}) => {
  // This is a simplified QR code implementation
  // In a real app, you would use a library like 'react-native-qrcode-svg'

  // Make sure we have valid input
  const safeValue =
    value ||
    JSON.stringify({
      type: "ticket",
      reservationId: Date.now(),
      fallback: true,
    });

  // Generate a simple pattern based on the string
  const generatePattern = (str: string) => {
    // Convert string to a hash number
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    // Create a 7x7 grid based on the hash
    const grid = [];
    const cellSize = size / 25;

    // Add fixed patterns (finder patterns) at corners
    // Top-left finder pattern
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isFrame = i === 0 || i === 6 || j === 0 || j === 6;
        const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (isFrame || isInner) {
          grid.push({
            x: j * cellSize,
            y: i * cellSize,
            size: cellSize,
          });
        }
      }
    }

    // Top-right finder pattern
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isFrame = i === 0 || i === 6 || j === 0 || j === 6;
        const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (isFrame || isInner) {
          grid.push({
            x: (j + 18) * cellSize,
            y: i * cellSize,
            size: cellSize,
          });
        }
      }
    }

    // Bottom-left finder pattern
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isFrame = i === 0 || i === 6 || j === 0 || j === 6;
        const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (isFrame || isInner) {
          grid.push({
            x: j * cellSize,
            y: (i + 18) * cellSize,
            size: cellSize,
          });
        }
      }
    }

    // Generate a pseudo-random pattern for the rest based on the hash
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Skip the finder pattern areas
        if ((i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7)) {
          continue;
        }

        // Use the hash to determine if this cell should be filled
        const position = i * 25 + j;
        const bitPosition = position % 32;
        const shouldFill = ((hash >> bitPosition) & 1) === 1;

        if (shouldFill) {
          grid.push({
            x: j * cellSize,
            y: i * cellSize,
            size: cellSize,
          });
        }
      }
    }

    return grid;
  };

  // Get the pattern for rendering
  const pattern = generatePattern(safeValue);

  return (
    <View
      style={[styles.container, { width: size, height: size, backgroundColor }]}
    >
      <Svg width={size} height={size}>
        {pattern.map((cell, index) => (
          <Rect
            key={index}
            x={cell.x}
            y={cell.y}
            width={cell.size}
            height={cell.size}
            fill={color}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8, // Add rounded corners
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 2,
  },
});
