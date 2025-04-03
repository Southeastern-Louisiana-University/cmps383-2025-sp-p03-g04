import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const profileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2429",
  },
  header: {
    padding: 24,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 24,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "white",
    marginLeft: 12,
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingButtonText: {
    fontSize: 16,
    color: "white",
    marginLeft: 12,
    flex: 1,
  },
  chevron: {
    marginLeft: "auto",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#9BA1A6",
    opacity: 0.7,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    color: "#9BA1A6",
    fontSize: 14,
    marginBottom: 20,
  },
});
