import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const showtimesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2429",
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#262D33",
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#9BA1A6",
    marginLeft: 8,
  },
  theaterInfo: {
    padding: 16,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  screenName: {
    fontSize: 16,
    color: "#B4D335",
    marginBottom: 16,
  },
  showTimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  timeSlot: {
    backgroundColor: "#0A7EA4",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontWeight: "600",
  },
  seatingContainer: {
    flex: 1,
    padding: 16,
  },
  seatMapContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
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
    color: "white",
    fontSize: 12,
  },
  seatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  seatRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  rowLabel: {
    width: 20,
    color: "white",
    marginRight: 10,
    textAlign: "center",
  },
  seat: {
    width: 30,
    height: 30,
    borderRadius: 5,
    margin: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  seatAvailable: {
    backgroundColor: "#1E3A55",
  },
  seatSelected: {
    backgroundColor: "#B4D335",
  },
  seatUnavailable: {
    backgroundColor: "#666666",
  },
  seatText: {
    color: "white",
    fontSize: 12,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
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
  legendText: {
    color: "white",
    fontSize: 12,
  },
  ticketCount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#262D33",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  ticketCountText: {
    color: "white",
    fontSize: 16,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    width: 32,
    height: 32,
    backgroundColor: "#1E3A55",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  counterValue: {
    color: "white",
    fontSize: 18,
    marginHorizontal: 15,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#262D33",
    marginVertical: 20,
    borderRadius: 8,
  },
  totalText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    color: "#B4D335",
    fontSize: 18,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#B4D335",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "bold",
  },
});
