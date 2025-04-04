import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Spacing, BorderRadius } from "../theme/spacing";

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#1E2429",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#9BA1A6",
    marginBottom: 24,
    textAlign: "center",
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
  inputGroup: {
    width: "100%",
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
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
    color: "white",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#B4D335",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: "#9BA1A6",
    fontSize: 16,
  },
  successContainer: {
    alignItems: "center",
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: "#9BA1A6",
    textAlign: "center",
    marginBottom: 30,
  },
  backToLoginButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToLoginText: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "bold",
  },
});
