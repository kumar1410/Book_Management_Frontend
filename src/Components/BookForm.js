import { useContext, useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Modal,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { BookContext } from "../Context/BookContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const BookForm = () => {
  const { addBook, fetchBooks, logout } = useContext(BookContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Book form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Auth form state
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    name: "", // Added name field for registration
    confirmPassword: "",
  });

  const handleAuthChange = (e) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    setAuthError(null);
  };

  const validateInputs = () => {
    if (tabValue === 1) {
      // Registration validation
      if (authData.password !== authData.confirmPassword) {
        setAuthError("Passwords don't match");
        return false;
      }
      if (authData.password.length < 6) {
        setAuthError("Password must be at least 6 characters long");
        return false;
      }
      if (!authData.name) {
        setAuthError("Name is required");
        return false;
      }
    }
    return true;
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!validateInputs()) {
      return;
    }

    setAuthLoading(true);

    try {
      const endpoint =
        tabValue === 0
          ? "http://localhost:5000/api/users/login"
          : "http://localhost:5000/api/users/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: authData.name,
          email: authData.email,
          password: authData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoggedIn(true);
      setModalOpen(false);
      await fetchBooks();
      // Clear auth form
      setAuthData({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
      });
    } catch (err) {
      setAuthError(err.message || "Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      await addBook(formData);
      setFormData({ title: "", author: "", description: "" });
    } catch (err) {
      setFormError("Failed to add book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("user");
     logout(); // Clear books from context
     setIsLoggedIn(false);
  };

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // If not logged in, show auth buttons
  if (!isLoggedIn) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" gutterBottom>
            Please login to add books
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                setTabValue(0);
                setModalOpen(true);
                setAuthError(null);
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => {
                setTabValue(1);
                setModalOpen(true);
                setAuthError(null);
              }}
            >
              Register
            </Button>
          </Stack>

          <Modal
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setAuthError(null);
              setAuthData({
                email: "",
                password: "",
                name: "",
                confirmPassword: "",
              });
            }}
            aria-labelledby="auth-modal-title"
          >
            <Box sx={modalStyle}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => {
                  setTabValue(newValue);
                  setAuthError(null);
                }}
                sx={{ mb: 2 }}
              >
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>

              {authError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {authError}
                </Alert>
              )}

              <form onSubmit={handleAuthSubmit}>
                <Stack spacing={2}>
                  {tabValue === 1 && (
                    <TextField
                      label="Name"
                      name="name"
                      value={authData.name}
                      onChange={handleAuthChange}
                      required
                      fullWidth
                      disabled={authLoading}
                    />
                  )}
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={authData.email}
                    onChange={handleAuthChange}
                    required
                    fullWidth
                    disabled={authLoading}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={authData.password}
                    onChange={handleAuthChange}
                    required
                    fullWidth
                    disabled={authLoading}
                  />
                  {tabValue === 1 && (
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={authData.confirmPassword}
                      onChange={handleAuthChange}
                      required
                      fullWidth
                      disabled={authLoading}
                    />
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <CircularProgress size={24} />
                    ) : tabValue === 0 ? (
                      "Login"
                    ) : (
                      "Register"
                    )}
                  </Button>
                </Stack>
              </form>
            </Box>
          </Modal>
        </Stack>
      </Paper>
    );
  }

  // If logged in, show book form
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Add New Book</Typography>
        <Button variant="outlined" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      <form onSubmit={handleBookSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            disabled={submitting}
          />
          <TextField
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            fullWidth
            disabled={submitting}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
            disabled={submitting}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Add Book"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default BookForm;
