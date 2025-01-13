import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // To handle error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData); // Replace with your backend API URL
      console.log("Login success:", response.data);

      // Handle successful login (e.g., save token, redirect)
      const { token } = response.data;
      localStorage.setItem("authToken", token); // Save token for future API requests
      alert("Login successful!");
      // Redirect to another page, e.g., dashboard
      window.location.href = "/dashboard"; // Replace with your dashboard route
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            type="email"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            variant="outlined"
            margin="normal"
            required
          />
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginTop: 1, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: "10px", fontSize: "16px" }}
            >
              Login
            </Button>
          </Box>
        </form>
        <Typography
          variant="body2"
          align="center"
          sx={{ marginTop: 2, color: "text.secondary" }}
        >
          © 2025 Thinkpalm
        </Typography>
      </Paper>
    </Grid>
  );
};

export default LoginPage;
