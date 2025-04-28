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
  const safeValue =
    value ||
    JSON.stringify({
      type: "ticket",
      reservationId: Date.now(),
      fallback: true,
    });

  const generatePattern = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    const grid = [];
    const cellSize = size / 25;

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

    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7)) {
          continue;
        }

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
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
