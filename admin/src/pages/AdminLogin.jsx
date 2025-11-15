import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaKey, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notify, setNotify] = useState("");
  const [showNotify, setShowNotify] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.logoutSuccess) {
      triggerNotification("Successfully logged out!");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const triggerNotification = (message) => {
    setNotify(message);
    setShowNotify(true);
    setTimeout(() => setShowNotify(false), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const adminUsername = "Joshua";
    const adminPassword = "123";

    if (username === adminUsername && password === adminPassword) {
      navigate("/admin/dashboard", { state: { loginSuccess: true } });
    } else {
      triggerNotification("Invalid username or password!");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        position: "relative",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      {/* ✅ Smooth Notification at the Top */}
      <div
        style={{
          position: "fixed",
          top: showNotify ? "30px" : "0px",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "rgba(30, 30, 30, 0.8)",
          color: "#fff",
          padding: "12px 25px",
          borderRadius: "10px",
          fontWeight: "500",
          fontSize: "0.9rem",
          boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
          zIndex: 999,
          opacity: showNotify ? 1 : 0,
          transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
          backdropFilter: "blur(8px)",
          textAlign: "center",
          width: "90%",
          maxWidth: "350px",
        }}
      >
        {notify}
      </div>

      {/* ✅ Responsive Login Form */}
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#111",
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "30px 25px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        <div className="text-center mb-4">
          <FaKey size={45} color="#fff" />
          <h4
            className="mt-3"
            style={{
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "1px",
              fontSize: "1.2rem",
            }}
          >
            ADMIN PANEL
          </h4>
        </div>

        <Form onSubmit={handleLogin}>
          {/* Username */}
          <Form.Group className="mb-4" controlId="formUsername">
            <Form.Label
              style={{
                color: "#aaa",
                fontSize: "12px",
                letterSpacing: "1px",
              }}
            >
              USERNAME
            </Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "2px solid #fff",
                color: "#fff",
                borderRadius: 0,
                outline: "none",
                fontSize: "0.95rem",
              }}
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-5" controlId="formPassword">
            <Form.Label
              style={{
                color: "#aaa",
                fontSize: "12px",
                letterSpacing: "1px",
              }}
            >
              PASSWORD
            </Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid #fff",
                  color: "#fff",
                  borderRadius: 0,
                  outline: "none",
                  paddingRight: "40px",
                  fontSize: "0.95rem",
                }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </Form.Group>

          {/* Login Button */}
          <div className="d-grid">
            <Button
              type="submit"
              style={{
                background: "transparent",
                border: "1px solid #fff",
                color: "#fff",
                borderRadius: "5px",
                fontWeight: "600",
                fontSize: "0.95rem",
                padding: "10px",
                transition: "0.3s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#fff";
                e.target.style.color = "#111";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#fff";
              }}
            >
              LOGIN
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
