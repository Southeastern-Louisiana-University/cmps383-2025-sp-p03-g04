import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const concessionsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2429",
    padding: 16,
  },
  loadingText: {
    color: "#9BA1A6",
    marginTop: 10,
    textAlign: "center",
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#262D33",
  },
  selectedCategory: {
    backgroundColor: "#B4D335",
  },
  categoryText: {
    fontSize: 14,
    color: "white",
  },
  selectedCategoryText: {
    color: "#242424",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginVertical: 16,
  },
  foodItemCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    flexDirection: "row",
  },
  foodImage: {
    width: 100,
    height: 100,
  },
  foodItemContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  foodItemDescription: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 8,
  },
  foodItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B4D335",
  },
  addButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#242424",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#262D33",
    borderRadius: 12,
  },
  emptyStateText: {
    color: "#9BA1A6",
    marginTop: 10,
    textAlign: "center",
  },
  cartContainer: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  cartItemName: {
    color: "white",
    fontSize: 14,
  },
  cartItemPrice: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  cartTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  cartTotalText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartTotalPrice: {
    color: "#B4D335",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#242424",
    fontWeight: "bold",
    fontSize: 16,
  },
});
