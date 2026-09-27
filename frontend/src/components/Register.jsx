import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../templates/Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    console.log({
      username,
      email,
      password,
    });
  };

  return (
    <main className="auth-page">

      {/* Background */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      {/* Back Button */}
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
            Create
            <br />
            <span>account.</span>
          </h1>

          <p>
            Create your account to manage assessments
            and analyze student attainment.
          </p>

        </div>

        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          <div className="input-group">
            <label>USERNAME</label>

            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>EMAIL</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>PASSWORD</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Create Account
            <span>↗</span>
          </button>

        </form>

        <div className="register-link">

          <span>Already have an account?</span>

          <button
            onClick={() => navigate("/login")}
          >
            Sign in →
          </button>

        </div>

      </section>

    </main>
  );
};

export default Register;