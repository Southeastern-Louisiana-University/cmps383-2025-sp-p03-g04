import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const todaysShowsListStyles = StyleSheet.create({
  container: {
    marginVertical: Spacing.m,
    paddingBottom: Spacing.s,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 12,
  },
  movieSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  theaterName: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 10,
  },
  showtimesList: {
    marginTop: 8,
  },
  showtimeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#0a7ea4",
    marginRight: 10,
  },
  showtimeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
