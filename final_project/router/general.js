const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios"); //Requiring axois module to make Http request Task 11
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

{/* Task 1
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
        const response = await axios.get("https://bluefrog79sl-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai");
        if (response){
            return res.status(200).send(books[isbn])
            }else {
            return res.status(404).send(`No book found with ISBN ${isbn}`);
        }
    }catch(error){
        console.error(error);
        return res.status(500).send("Interal Server Error");
    }
});

{/* Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
      // Retrieve the isbn parameter from the request URL and send the corresponding isbn's details
const isbn = req.params.isbn;
  res.send(books[isbn])
 });
*/}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if (books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({
        "isbn": isbn,
        "title": books[isbn]["title"],
        "reviews": books[isbn]["reviews"]
      });
    } 
  });
  res.send(JSON.stringify({ booksbyauthor }, null, 4));
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn]["title"] === req.params.title) {
        booksbytitle.push({
          "isbn": isbn,
          "author": books[isbn]["author"],
          "reviews": books[isbn]["reviews"]
        });
      } 
    });
    res.send(JSON.stringify({ booksbytitle }, null, 4));
    });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
