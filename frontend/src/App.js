import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', published_year: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleAddBook = () => {
    axios.post('http://localhost:5000/books', newBook)
      .then(response => {
        setBooks([...books, { id: response.data.id, ...newBook }]);
        setNewBook({ title: '', author: '', published_year: '' });
      })
      .catch(error => console.error(error));
  };

  const handleRemoveBook = (id) => {
    // Send DELETE request to remove the book from the database
    axios.delete(`http://localhost:5000/books/${id}`)
      .then(() => {
        // If deletion from the database is successful, update the table
        const updatedBooks = books.filter(book => book.id !== id);
        setBooks(updatedBooks);
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Book Management System</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Published Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published_year}</td>
              <td><button onClick={() => handleRemoveBook(book.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input type="text" name="title" placeholder="Title" value={newBook.title} onChange={handleInputChange} />
        <input type="text" name="author" placeholder="Author" value={newBook.author} onChange={handleInputChange} />
        <input type="number" name="published_year" placeholder="Published Year" value={newBook.published_year} onChange={handleInputChange} />
        <button onClick={handleAddBook}>Add Book</button>
      </div>
    </div>
  );
};

export default App;
