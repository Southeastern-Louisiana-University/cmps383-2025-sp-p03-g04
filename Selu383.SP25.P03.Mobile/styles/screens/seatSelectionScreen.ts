import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const seatSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2429",
  },
  theaterModeContainer: {
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E2429",
  },
  loadingText: {
    color: "#9BA1A6",
    marginTop: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  movieInfoContainer: {
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  showtimeInfo: {
    fontSize: 16,
    color: "#B4D335",
    marginBottom: 4,
  },
  theaterInfo: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  seatMapContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  screen: {
    width: "80%",
    height: 20,
    backgroundColor: "#0A7EA4",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  screenText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 5,
  },
  availableSeat: {
    backgroundColor: "#1E3A55",
  },
  selectedSeat: {
    backgroundColor: "#B4D335",
  },
  takenSeat: {
    backgroundColor: "#666666",
  },
  legendText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  ticketSection: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  ticketTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  seatLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    width: "30%",
  },
  ticketTypeButtons: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-around",
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#B4D335",
    minWidth: 60,
    alignItems: "center",
  },
  selectedTypeButton: {
    backgroundColor: "#B4D335",
  },
  typeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  selectedTypeText: {
    color: "#1E2429",
    fontWeight: "bold",
  },
  summaryContainer: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  summaryValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 18,
    color: "#B4D335",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#4A4A4A",
    opacity: 0.7,
  },
  continueButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
  },
});
