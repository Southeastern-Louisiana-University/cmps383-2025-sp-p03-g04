import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const toggleLoginMode = () => {
    setIsLogin((prev) => !prev);
  };

  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("sorry bro. shits broke");

    if (!username) {
      setError("Username is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (!isLogin) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    try {
      if (isLogin) {
        await signIn(username, password);
        if (rememberMe) {
          localStorage.setItem("savedUsername", username);
        } else {
          localStorage.removeItem("savedUsername");
        }
        navigate(location.state?.from || "/");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="username">Username:</label>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      <button type="button" onClick={toggleLoginMode}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <label htmlFor="password">Password:</label>
      {!isLogin && (
        <div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password:</label>
        </div>
      )}
    </form>
  );
};
export default LoginPage;
