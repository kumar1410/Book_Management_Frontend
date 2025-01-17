
import React from "react";
import { BookProvider } from "./Context/BookContext";
import BookList from "./Components/BookList";
import BookForm from "./Components/BookForm";
import { Container } from "@mui/material";

const App = () => {
  return (
    <BookProvider>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <BookForm />
        <BookList />
      </Container>
    </BookProvider>
  );
};

export default App;
