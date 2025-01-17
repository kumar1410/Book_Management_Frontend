import { useContext } from "react";
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { BookContext } from "../Context/BookContext";

const BookList = () => {
  const { books, loading, error } = useContext(BookContext);

  if (loading && !books.length) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Book List
      </Typography>
      <Stack spacing={2}>
        {books.map((book) => (
          <Accordion key={book.id}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`book-${book.id}-content`}
              id={`book-${book.id}-header`}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  pr: 2,
                }}
              >
                <Typography sx={{ fontWeight: "medium" }}>
                  {book.title}
                </Typography>
                <Typography color="text.secondary">{book.author}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{book.description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        {!loading && books.length === 0 && (
          <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
            No books added yet
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};
export default BookList;