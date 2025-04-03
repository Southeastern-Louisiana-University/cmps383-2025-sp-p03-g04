import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const movieDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#292929",
  },
  loadingText: {
    color: "white",
    marginTop: Spacing.s,
  },
  movieHeader: {
    flexDirection: "row",
    padding: Spacing.l,
    backgroundColor: "#292929",
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: BorderRadius.s,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: Spacing.l,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: Spacing.m,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.s,
  },
  detailLabel: {
    width: 80,
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: "white",
  },
  ratingBadge: {
    backgroundColor: "#1e293b",
    paddingVertical: 2,
    paddingHorizontal: Spacing.s,
    borderRadius: BorderRadius.xs,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  trailerButton: {
    backgroundColor: "#dc2626",
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.m,
    alignSelf: "flex-start",
  },
  trailerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  synopsisContainer: {
    padding: Spacing.l,
    backgroundColor: "#333333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: Spacing.s,
  },
  synopsis: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
  },
  showtimesContainer: {
    padding: Spacing.l,
    backgroundColor: "#292929",
  },
  theaterShowtimes: {
    marginBottom: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: BorderRadius.s,
    overflow: "hidden",
  },
  theaterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  distance: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  showtimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Spacing.m,
  },
  showtimeItem: {
    width: 70,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: BorderRadius.xs,
    marginRight: Spacing.s,
    marginBottom: Spacing.s,
    padding: Spacing.s,
    alignItems: "center",
  },
  showtimeTime: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  showtimePeriod: {
    fontSize: 12,
    color: "#9BA1A6",
  },
  bookButton: {
    backgroundColor: "#65a30d",
    margin: Spacing.l,
    padding: Spacing.l,
    borderRadius: BorderRadius.s,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40, // Extra padding at bottom for scrolling
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
