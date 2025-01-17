import { createContext, useEffect, useState } from "react";

// Create Context
const BookContext = createContext();

// Book Provider Component
const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  // Fetch books on component mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchBooks();
    } else {
      setBooks([]); // Clear books if the token is missing
    }
  }, []);

  const logout = () => {
    setBooks([]);
    setError(null);
  };

   const createAuthHeaders = () => {
     const token = getAuthToken();
     return {
       "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
     };
   };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/books", {
        method: "GET",
        headers: createAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/add/books", {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      // Fetch updated book list
      await fetchBooks();
    } catch (err) {
      setError(err.message);
      throw err; // Rethrow to handle in the form component
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider
      value={{ books, addBook, loading, error, logout, fetchBooks }}
    >
      {children}
    </BookContext.Provider>
  );
};

export { BookProvider, BookContext };
