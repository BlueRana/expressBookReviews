const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios"); //Requiring axois module to make Http request Task 11 & 13
const public_users = express.Router();




// Register a new user
// Code from PracticeProject - index - app.post(/"register"...
public_users.post("/register", (req,res) => {
   const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Task 10
// Get the book list available in the shop by promise
public_users.get('/', function (req, res) {  
    const getAllBooks = new Promise((resolve, reject) => {
        
        try {  
            const get_books = res.send(JSON.stringify({books}, null, 4));
            resolve(get_books);
        } catch (error) {
            reject(error);
        }
    });
    
    getAllBooks.then(
       (get_books) => console.log("Books Found"),
       (error) => console.error(res.status(500).json({ message: "No Books Found" }))
    );
});

{/*
// Task 1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send JSON response with formatted books data
  res.send(JSON.stringify({books}, null, 4));
});
*/}

//Task 11
// Get book details based on ISBN with async/await with axios
// Make sure to install axois in package.json command npm install axios
public_users.get('/isbn/:isbn', async function (req, res) {
        const isbn = req.params.isbn;

    try{  
        // const response = await axios.get(url)
        const response = await axios.get("http://localhost:5000");
        if(books[isbn]){
            return res.status(200).send(books[isbn]),
            console.log(`Book with ISBN ${isbn}`);
            }else{
            return res.status(404).send(`No book found with ISBN ${isbn}`),
            console.log(`No book with ISBN ${isbn}`);
        }
    }catch(error){
        console.error(error);
        return res.status(500).send("Interal Server Error");
    }
    
});

{/*
 //Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
      // Retrieve the isbn parameter from the request URL and send the corresponding isbn's details
const isbn = req.params.isbn;
  res.send(books[isbn])
 });
*/}

//Task 12
// Get book details based on author by async
 //.toLowerCase() is needed so [] of unknown authors will be returned
public_users.get('/author/:author', async (req, res) => {
    try{
    const author = req.params.author.toLowerCase();
    const booksByAuthor = Object.keys(books)
      .filter(isbn => books[isbn].author.toLowerCase() === author)
      .map(isbn => ({
        isbn,
        author: books[isbn].author,
        title: books[isbn].title,
        reviews: books[isbn].reviews,
      }));

    if (booksByAuthor.length > 0) {
      res.json({ booksByAuthor });
      console.log(`${author} : Found`);

    } else {
      res.status(404).json({ message: `No books found by author ${author}.` });
      console.log(`${auhtor} : No Found`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

{/*
//Task 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
const author = req.params.author.toLowerCase();
    let booksByAuthor = [];
    let isbns = Object.keys(books);

    isbns.forEach(isbn => {
        //.toLowerCase() is needed so [] of unknown authors will be returned
        if(books[isbn]['author'].toLowerCase() === author.toLowerCase()){
            booksByAuthor.push({
                 "isbn": isbn,
                "author": books[isbn]["author"],
                "title": books[isbn]["title"],
                "reviews": books[isbn]["reviews"]
              });
        }
    });
    res.json({booksByAuthor});
});
*/}

//Task 13
// Get all books based on title by async await
public_users.get('/title/:title', async function (req, res) {
   try {
    const title = req.params.title;
    const response = await axios.get('http://localhost:5000');
    const {books} = response.data; //data assumed to be an object where each key is an ISBN and each value is a book object.

    // Filter and map books by title
    const booksByTitle = Object.keys(books)
      .filter(isbn => books[isbn].title === title)
      .map(isbn => ({
        isbn,
        author: books[isbn].author,
        title: books[isbn].title,
        reviews: books[isbn].reviews,
      }));

    if (booksByTitle.length > 0) {
      res.json({ booksByTitle });
      console.log(`${title} : Found`);

    } else {
      res.status(404).json({ message: `No books found by the titled ${title}.` });
      console.log (`${title} : No Found`)
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    console.error(error);
  }
});

{/*
// Task 4
// Get book details based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    let isbns = Object.keys(books);
    isbns.forEach(isbn => {
        //.toLowerCase() is needed so [] of unknown authors will be returned
        if(books[isbn]['title'].toLowerCase() === title.toLowerCase()){
            booksByTitle.push({
                "isbn": isbn,
                "author": books[isbn]["author"],
                 "title": books[isbn]["title"],
                "reviews": books[isbn]["reviews"]
              });
        }
    });
    res.send(JSON.stringify({booksByTitle}, null, 4));
});
*/}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
