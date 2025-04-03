import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const roleSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: "white",
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    color: "#9BA1A6",
  },
  rolesContainer: {
    width: "100%",
    marginVertical: 32,
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#1E2429",
    borderWidth: 1,
    borderColor: "#333333",
  },
  selectedRole: {
    backgroundColor: "#B4D335",
    borderColor: "#B4D335",
  },
  roleTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  roleDescription: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  selectedRoleText: {
    color: "white",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#B4D335",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  nextButton: {
    width: "100%",
    backgroundColor: "#B4D335",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#4A4A4A",
  },
  nextButtonText: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    fontSize: 12,
    color: "#9BA1A6",
  },
});
