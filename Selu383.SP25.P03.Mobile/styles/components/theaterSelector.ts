import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const theaterSelectorStyles = StyleSheet.create({
  container: {
    marginVertical: Spacing.m,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: Spacing.l,
    marginBottom: Spacing.m,
  },
  list: {
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
  },
  theaterItem: {
    padding: Spacing.m,
    marginHorizontal: Spacing.xs,
    borderRadius: BorderRadius.s,
    backgroundColor: "#f0f0f0",
    minWidth: 160,
    maxWidth: 200,
  },
  selectedTheaterItem: {
    backgroundColor: "#0a7ea4",
  },
  theaterName: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  theaterAddress: {
    fontSize: 14,
    opacity: 0.7,
  },
  selectedTheaterText: {
    color: "white",
  },
});
