import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Theater } from "../types/models/theater";
import { TheaterSelectorProps } from "../types/components/theaterComponents";
import { theaterSelectorStyles as styles } from "../styles/components/theaterSelector";

export function TheaterSelector({
  theaters,
  selectedTheater,
  onSelectTheater,
}: TheaterSelectorProps) {
  const renderTheaterItem = ({ item }: { item: Theater }) => {
    const isSelected = selectedTheater?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.theaterItem, isSelected && styles.selectedTheaterItem]}
        onPress={() => onSelectTheater(item)}
      >
        <ThemedText
          style={[styles.theaterName, isSelected && styles.selectedTheaterText]}
        >
          {item.name}
        </ThemedText>
        <ThemedText
          style={[
            styles.theaterAddress,
            isSelected && styles.selectedTheaterText,
          ]}
          numberOfLines={1}
        >
          {item.address}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.heading}>Select a Theater</ThemedText>
      <FlatList
        data={theaters}
        renderItem={renderTheaterItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}
