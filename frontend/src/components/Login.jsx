import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../templates/Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Temporary hardcoded user
  const validUser = {
    username: "admin",
    password: "admin123",
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (
      username === validUser.username &&
      password === validUser.password
    ) {
      navigate("/portal");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <section className="auth-container">

        <div className="auth-heading">

          <span className="auth-eyebrow">
            STUDENT ATTAINMENT SYSTEM
          </span>

          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <p>
            Sign in to access your attainment dashboard
            and academic insights.
          </p>

        </div>

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          <div className="input-group">

            <label>USERNAME</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

          </div>

          <div className="input-group">

            <div className="password-label">

              <label>PASSWORD</label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>

            </div>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>

          {/* Error */}
          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Sign In
            <span>↗</span>
          </button>

        </form>

        <div className="register-link">

          <span>
            Don't have an account?
          </span>

          <button
            onClick={() => navigate("/register")}
          >
            Create account →
          </button>

        </div>

      </section>

    </main>
  );
};

export default Login;