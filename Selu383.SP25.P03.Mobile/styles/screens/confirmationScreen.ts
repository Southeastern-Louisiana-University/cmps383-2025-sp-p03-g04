import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const confirmationScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2429",
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
    alignItems: "center",
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: "#9BA1A6",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  ticketContainer: {
    width: "100%",
    backgroundColor: "#262D33",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    // Shadow for iOS
    shadowColor: "#B4D335",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 5,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E3A55",
    padding: 16,
  },
  theaterInfo: {
    flex: 1,
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  screenName: {
    fontSize: 14,
    color: "#B4D335",
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E2429",
    alignItems: "center",
    justifyContent: "center",
  },
  ticketBody: {
    padding: 16,
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },
  showtimeDate: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  showtimeTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B4D335",
    marginBottom: 16,
  },
  ticketsInfo: {
    width: "100%",
    marginBottom: 16,
  },
  ticketsLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ticketsList: {
    paddingLeft: 16,
  },
  ticketItem: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 4,
  },
  confirmationContainer: {
    width: "100%",
    marginBottom: 16,
    alignItems: "center",
  },
  confirmationLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  confirmationCode: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B4D335",
    letterSpacing: 2,
  },
  qrContainer: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginVertical: 16,
  },
  ticketFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    padding: 16,
    alignItems: "center",
  },
  ticketFooterText: {
    fontSize: 12,
    color: "#9BA1A6",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A55",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 8,
  },
  foodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B4D335",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  foodButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E2429",
    marginLeft: 8,
  },
  doneButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9BA1A6",
    width: "100%",
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9BA1A6",
  },
});
