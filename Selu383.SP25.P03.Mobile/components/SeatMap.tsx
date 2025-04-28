import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ThemedText } from "./ThemedText";
import { SeatingLayout } from "../types/models/theater";
import { useTheme } from "../components/ThemeProvider";

interface SeatMapProps {
  seatingLayout: SeatingLayout;
  selectedSeats: number[];
  onSeatPress: (seatId: number) => void;
}

export function SeatMap({
  seatingLayout,
  selectedSeats,
  onSeatPress,
}: SeatMapProps) {
  const { isTheaterMode } = useTheme();

  const sortedRowKeys = Object.keys(seatingLayout.rows).sort();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.seatMap}>
        {sortedRowKeys.map((rowKey) => (
          <View key={rowKey} style={styles.row}>
            <View style={styles.rowLabel}>
              <ThemedText style={styles.rowLabelText}>{rowKey}</ThemedText>
            </View>

            <View style={styles.seats}>
              {seatingLayout.rows[rowKey].map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isTaken = seat.status === "Taken";

                return (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.seat,
                      isTaken && styles.takenSeat,
                      isSelected && styles.selectedSeat,
                      isTheaterMode && styles.theaterModeSeat,
                    ]}
                    onPress={() => !isTaken && onSeatPress(seat.id)}
                    disabled={isTaken}
                  >
                    <ThemedText
                      style={[
                        styles.seatText,
                        isSelected && styles.selectedSeatText,
                        isTaken && styles.takenSeatText,
                      ]}
                    >
                      {seat.number}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  seatMap: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  rowLabel: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  seats: {
    flexDirection: "row",
  },
  seat: {
    width: 30,
    height: 30,
    borderRadius: 6,
    margin: 3,
    backgroundColor: "#1E3A55",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSeat: {
    backgroundColor: "#B4D335",
  },
  takenSeat: {
    backgroundColor: "#666666",
  },
  theaterModeSeat: {
    opacity: 0.7,
  },
  seatText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  selectedSeatText: {
    color: "#242424",
  },
  takenSeatText: {
    color: "#999999",
  },
});
