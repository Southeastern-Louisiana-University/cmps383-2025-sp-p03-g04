import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dropdown: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: "#65a30d",
    zIndex: 999,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  dropdownText: {
    fontSize: 16,
    color: "#242424",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#1E2429",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",

    shadowColor: "#B4D335",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: "#B4D335", // Brand green
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  movieShowtimesContainer: {
    marginBottom: 20,
    backgroundColor: "#1E2429",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#B4D335",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  screenInfo: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 12,
  },
  showtimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  showtimeBox: {
    backgroundColor: "#1E2429",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 80,
    alignItems: "center",
    shadowColor: "#B4D335",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  showtimeText: {
    color: "#B4D335",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#9BA1A6",
  },
  loginButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "bold",
  },
  staffHeader: {
    backgroundColor: "#0A7EA4",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  staffTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  staffSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  staffContent: {
    padding: 16,
  },
  statCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  statInfo: {
    flex: 1,
    marginLeft: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  quickActionsContainer: {
    marginTop: 24,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    width: "31%",
    alignItems: "center",
  },
  quickActionText: {
    color: "white",
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
  },
  managerHeader: {
    backgroundColor: "#C87000",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  managerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  managerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  managerContent: {
    padding: 16,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  overviewCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
  },
  salesCard: {
    backgroundColor: "#1E3A55",
  },
  attendanceCard: {
    backgroundColor: "#2D4263",
  },
  overviewValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  overviewLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  trendPositive: {
    color: "#4CD964",
    fontSize: 14,
    marginLeft: 4,
  },
  performanceContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    color: "#C87000",
    fontSize: 14,
  },
  performanceList: {
    paddingRight: 20,
  },
  performanceCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: "#262D33",
    padding: 12,
    borderRadius: 8,
  },
  movieMetric: {
    fontSize: 12,
    color: "#9BA1A6",
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  actionDescription: {
    fontSize: 13,
    color: "#9BA1A6",
    marginTop: 4,
  },
  chevron: {
    marginLeft: "auto",
  },
  dateTabs: {
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 10,
  },
  dateTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#262D33",
  },
  activeDateTab: {
    backgroundColor: "#B4D335",
  },
  dateTabText: {
    color: "white",
    fontSize: 14,
  },
  activeDateTabText: {
    color: "#242424",
    fontWeight: "bold",
  },
  emptyStateContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#262D33",
    borderRadius: 12,
    marginTop: 10,
  },
  emptyStateText: {
    color: "#9BA1A6",
    marginTop: 10,
    textAlign: "center",
  },
});
