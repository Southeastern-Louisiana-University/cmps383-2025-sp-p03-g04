import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2429",
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#9BA1A6",
  },
  errorContainer: {
    backgroundColor: "rgba(220, 38, 38, 0.2)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: "100%",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
    height: 50,
  },
  inputIcon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingLeft: 10,
    color: "#FFFFFF",
  },
  visibilityIcon: {
    padding: 15,
  },
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9BA1A6",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberText: {
    color: "#9BA1A6",
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B4D335",
  },
  authButton: {
    width: "100%",
    backgroundColor: "#B4D335",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: "#4A4A4A",
    opacity: 0.7,
  },
  authButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  toggleText: {
    color: "#9BA1A6",
    fontSize: 14,
    marginRight: 4,
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B4D335",
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#9BA1A6",
    borderRadius: 8,
    marginBottom: 40,
  },
  skipButtonText: {
    color: "#9BA1A6",
    fontSize: 14,
  },
});
