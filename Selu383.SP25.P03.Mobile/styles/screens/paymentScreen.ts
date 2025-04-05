import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const paymentScreenStyles = StyleSheet.create({
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
  },
  summaryContainer: {
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
  summaryContent: {
    marginTop: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  theaterInfo: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 4,
  },
  showtime: {
    fontSize: 14,
    color: "#B4D335",
    marginBottom: 16,
  },
  ticketsContainer: {
    marginBottom: 16,
  },
  ticketsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ticketItem: {
    fontSize: 14,
    color: "#9BA1A6",
    marginLeft: 16,
    marginBottom: 4,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B4D335",
  },
  paymentContainer: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  selectedPaymentMethod: {
    backgroundColor: "rgba(180, 211, 53, 0.1)",
  },
  paymentMethodIcon: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentMethodDetails: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethodLabel: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  defaultLabel: {
    color: "#9BA1A6",
    fontWeight: "normal",
  },
  cardNumber: {
    fontSize: 12,
    color: "#9BA1A6",
    marginTop: 4,
  },
  paymentMethodCheck: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  newCardForm: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1E2429",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333333",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  saveCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  saveCardText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: "#B4D335",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#4A4A4A",
    opacity: 0.7,
  },
  payButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
  },
  secureIcon: {
    marginLeft: 8,
  },
  secureNote: {
    textAlign: "center",
    color: "#9BA1A6",
    fontSize: 12,
    marginBottom: 20,
  },
});
