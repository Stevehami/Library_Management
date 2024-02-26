const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'book_management',
});

db.connect();

app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

// ... (existing code)

app.post('/books', (req, res) => {
  const { title, author, published_year } = req.body;
  console.log("Received POST request with data:", { title, author, published_year });

  const sql = 'INSERT INTO books (title, author, published_year) VALUES (?, ?, ?)';
  db.query(sql, [title, author, published_year], (err, result) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      res.status(500).send(err);
    } else {
      console.log("Book inserted successfully with ID:", result.insertId);
      res.json({ id: result.insertId });
    }
  });
});


// ... (existing code)

// Add this route to handle book removal
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const sql = 'DELETE FROM books WHERE id = ?';

  console.log("Deleting book with ID:", bookId);

  db.query(sql, [bookId], (err, result) => {
    if (err) {
      console.error("Error removing book from the database:", err);
      res.status(500).send(err);
    } else {
      console.log("Book removed successfully.");
      res.status(200).send("Book removed successfully.");
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
