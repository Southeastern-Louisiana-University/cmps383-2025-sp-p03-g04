import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as authService from "../../services/auth/authService";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage: React.FC = () => {
  // const { signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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

    // try (isLogin) {
    //   await signIn(username, password);
    //   if (rememberMe){
    //     localStorage.setItem("savedUsername", username);
    //   }
    //   else{
    //     localStorage.removeItem("savedUsername");
    //   }
    //   navigate( )
    // }
  };

  return (
    <form>
      <div>
        <input type="text" id="username" name="username" required />
        <label htmlFor="username">Username:</label>
      </div>
      <div>
        <input type="text" id="password" name="password" required />
        <label htmlFor="password">Password:</label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};
