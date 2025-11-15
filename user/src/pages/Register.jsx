import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import userImage from "../assets/user_blue.svg";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [hover, setHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/enrollment/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await response.json();
      setMessage(data.message);
      setSuccess(data.success);

      if (data.success) {
        // Remove automatic navigation
        setMessage("Registration successful! Please login.");
        // Form values stay the same
      }
    } catch (error) {
      setMessage("Error connecting to server.");
      setSuccess(false);
    }
  };

  // Button hover style
  const buttonStyle = {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "12px",
    fontWeight: "600",
    fontSize: "16px",
    color: "#fff",
    background: hover
      ? "linear-gradient(135deg, #00c6ff, #007bff)"
      : "linear-gradient(135deg, #007bff, #00c6ff)",
    boxShadow: hover ? "0 4px 15px rgba(0,198,255,0.5)" : "none",
    transform: hover ? "translateY(-2px)" : "translateY(0)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const eyeButtonStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#00c6ff",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0e1f33",
        padding: "40px",
      }}
    >
      <Row
        className="w-100"
        style={{
          maxWidth: "1000px",
          color: "#fff",
        }}
      >
        {/* Left Section */}
        <Col
          md={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 30px",
            textAlign: "center",
            backgroundColor: "#0e1f33",
          }}
        >
          <img
            src={userImage}
            alt="User Illustration"
            style={{ width: "100px", marginBottom: "25px" }}
          />
          <h1 style={{ color: "#00c6ff", fontWeight: "700" }}>
            Welcome To AI Page
          </h1>
          <p style={{ color: "#ccc", fontSize: "14px", maxWidth: "400px" }}>
            hmmmm
          </p>
        </Col>

        {/* Right Section - Register Form */}
        <Col
          md={6}
          style={{
            padding: "60px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              color: "#00c6ff",
              fontWeight: "700",
              marginBottom: "25px",
              textAlign: "center",
            }}
          >
            Register for Enrollment
          </h2>

          {message && (
            <p
              className="text-center"
              style={{
                color: success ? "#28a745" : "#dc3545",
                fontWeight: "500",
                marginBottom: "20px",
              }}
            >
              {message}
            </p>
          )}

          <Form
            onSubmit={handleRegister}
            className="d-flex flex-column"
            style={{ gap: "25px" }}
          >
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                style={{
                  borderRadius: "12px",
                  padding: "12px",
                  border: "none",
                  outline: "none",
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderRadius: "12px",
                  padding: "12px",
                  border: "none",
                  outline: "none",
                }}
              />
            </Form.Group>

            <Form.Group style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  borderRadius: "12px",
                  padding: "12px 44px 12px 12px",
                  border: "none",
                  outline: "none",
                }}
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                style={eyeButtonStyle}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                  >
                    <path
                      d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z"
                      stroke="#00c6ff"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#00c6ff"
                      strokeWidth="1.2"
                      fill="none"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                  >
                    <path
                      d="M2 2l20 20"
                      stroke="#00c6ff"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7a13.3 13.3 0 0 1 5.06-6.46"
                      stroke="#00c6ff"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M9.88 9.88A3 3 0 0 0 14.12 14.12"
                      stroke="#00c6ff"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                )}
              </button>
            </Form.Group>

            <Button
              type="submit"
              style={buttonStyle}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Register
            </Button>
          </Form>

          <p className="text-center mt-4 mb-0" style={{ color: "#ccc" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "#00c6ff", fontWeight: "500" }}>
              Login
            </Link>
          </p>
        </Col>
      </Row>
    </div>
  );
}
