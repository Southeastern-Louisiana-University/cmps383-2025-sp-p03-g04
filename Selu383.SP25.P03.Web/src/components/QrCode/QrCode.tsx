import React from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  color = "#000000",
  backgroundColor = "#FFFFFF",
}) => {
  const generatePattern = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    const grid = [];
    const cellSize = size / 25;

    // Finder pattern logic (top-left, top-right, bottom-left)
    const addFinder = (xOffset: number, yOffset: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const isFrame = i === 0 || i === 6 || j === 0 || j === 6;
          const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
          if (isFrame || isInner) {
            grid.push({
              x: (j + xOffset) * cellSize,
              y: (i + yOffset) * cellSize,
              size: cellSize,
            });
          }
        }
      }
    };

    addFinder(0, 0);        // Top-left
    addFinder(18, 0);       // Top-right
    addFinder(0, 18);       // Bottom-left

    // Fill rest of grid pseudo-randomly
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i < 7 && j < 7) || (i < 7 && j > 17) || (i > 17 && j < 7)) continue;

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

  const pattern = generatePattern(value);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
      }}
    >
      <svg width={size} height={size}>
        {pattern.map((cell, index) => (
          <rect
            key={index}
            x={cell.x}
            y={cell.y}
            width={cell.size}
            height={cell.size}
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
};

export default QRCode;
