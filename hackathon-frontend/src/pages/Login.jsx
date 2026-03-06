import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try { 
      const { data } = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", data.token);
      navigate("/dashboard");

    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
      <p>
  Don't have an account?{" "}
  <button onClick={() => navigate("/register")}>
    Register
  </button>
</p>

    </div>
  );
}

export default Login;