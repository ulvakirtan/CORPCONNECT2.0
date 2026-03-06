import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password
    });

    localStorage.setItem("token", data.token);

    navigate("/dashboard");

  } catch (error) {
    alert(error.response?.data?.message || "Registration failed");
  }
};
  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <button onClick={() => navigate("/")}>Login</button>
      </p>
    </div>
  );
}

export default Register;