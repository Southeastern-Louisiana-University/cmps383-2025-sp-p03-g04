import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const ticketsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2429",
  },
  refreshButton: {
    marginRight: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#9BA1A6",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#E74C3C",
    textAlign: "center",
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#242424",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
    minHeight: "100%",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "white",
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    color: "#9BA1A6",
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#242424",
    fontWeight: "bold",
    fontSize: 16,
  },
  ticketCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
  paidBadge: {
    backgroundColor: "rgba(76, 217, 100, 0.2)",
  },
  unpaidBadge: {
    backgroundColor: "rgba(255, 204, 0, 0.2)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  ticketDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  seatsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailText: {
    fontSize: 14,
    color: "#9BA1A6",
    marginLeft: 8,
    flex: 1,
  },
  ticketFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E74C3C",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#E74C3C",
    fontWeight: "500",
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#B4D335",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#242424",
    fontWeight: "bold",
  },
});
