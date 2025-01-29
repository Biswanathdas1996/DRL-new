import { Box, Button, TextField, Card } from "@mui/material";
import React, { useState } from "react";
import { LOGIN } from "../config";
import Loader from "../components/Loader";
import { useContext } from "react";
import { UserContext } from "../App";
import { useAlert } from "../hook/useAlert";
import { clearChat } from "../redux/slices/chatSlices";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";

const Login: React.FC = () => {
  const { triggerAlert } = useAlert();
  const [email, setEmail] = useState("55541");
  const [password, setPassword] = useState("drltest1234");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    event.preventDefault();
    try {
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeecode: email,
          password: password,
        }),
      });
      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data?.result[0]));
      setUser(data?.result[0]);
      setLoading(false);
      dispatch(clearChat());
      window.location.replace("/#/sql-chat");
    } catch (error) {
      triggerAlert("Please check your credentials!", "error");
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="login-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          background: "#2e2e2e",
        }}
      >
        <Card
          component="form"
          onSubmit={handleSubmit}
          style={{ padding: "3rem" }}
          noValidate
        >
          <h2>Login</h2>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Employee ID"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ textTransform: "none" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              ),
            }}
            type={showPassword ? "text" : "password"}
          />

          {loading ? (
            <Loader showIcon={false} text={"Authenticating"} />
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="warning"
              style={{ marginTop: "1rem" }}
              id="temp_login_button"
            >
              Login
            </Button>
          )}
        </Card>
      </div>
    </>
  );
};

export default Login;
