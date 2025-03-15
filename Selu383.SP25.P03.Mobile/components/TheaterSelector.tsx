import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

// Define the theater type
export interface Theater {
  id: number;
  name: string;
  address: string;
}

interface TheaterSelectorProps {
  theaters: Theater[];
  selectedTheater: Theater | null;
  onSelectTheater: (theater: Theater) => void;
}

export function TheaterSelector({ theaters, selectedTheater, onSelectTheater }: TheaterSelectorProps) {
  const renderTheaterItem = ({ item }: { item: Theater }) => {
    const isSelected = selectedTheater?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.theaterItem,
          isSelected && styles.selectedTheaterItem
        ]}
        onPress={() => onSelectTheater(item)}
      >
        <ThemedText 
          style={[
            styles.theaterName, 
            isSelected && styles.selectedTheaterText
          ]}
        >
          {item.name}
        </ThemedText>
        <ThemedText 
          style={[
            styles.theaterAddress,
            isSelected && styles.selectedTheaterText
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

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  theaterItem: {
    padding: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    minWidth: 160,
    maxWidth: 200,
  },
  selectedTheaterItem: {
    backgroundColor: '#0a7ea4',
  },
  theaterName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  theaterAddress: {
    fontSize: 14,
    opacity: 0.7,
  },
  selectedTheaterText: {
    color: 'white',
  }
});