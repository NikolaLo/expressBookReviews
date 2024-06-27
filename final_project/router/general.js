const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
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

const getBooksAsync = async () => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(Object.values(books));
        } else {
            reject(new Error('Failed to fetch books'));
        }
    });
};
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const all_Books = await getBooksAsync();
        res.json(all_Books);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write in local variable
    let i_isbn=req.params.isbn;
    //Get the book with requested isbn with promise
    let output_book= new Promise((resolve,reject)=>{
        if(books[i_isbn]){
            resolve(books[i_isbn]);
        }else {
            reject("Book with isbn:" + (i_isbn) + " doesn't exist!");
        }
    });
    // Execute the promise
    output_book.then((book) => {
        res.send(book);
    }).catch((error) => {
        res.send(error);
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write in local variable
    let i_author=req.params.author;
    //Get the book with requested author with promise
    let output_book= new Promise((resolve,reject)=>{
        let book=Object.values(books).filter((book)=>book.author===i_author);
        if(book[0]){
            resolve(book);
        }else {
            reject("Book with author:" + (i_author) + " doesn't exist!");
        }
    });
    // Execute the promise
    output_book.then((book) => {
        res.send(book);
    }).catch((error) => {
        res.send(error);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write in local variable
    let i_title=req.params.title;
    //Get the book with requested title with promise
    let output_book= new Promise((resolve,reject)=>{
        let book=Object.values(books).filter((book)=>book.title===i_title);
        if(book[0]){
            resolve(book);
        }else {
            reject("Book with title:" + (i_title) + " doesn't exist!");
        }
    });
    // Execute the promise
    output_book.then((book) => {
        res.send(book);
    }).catch((error) => {
        res.send(error);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write in local variable
    let i_isbn=req.params.isbn;
    //Get the book with requested isbn
    let output_book=books[i_isbn];
    //If the book exists send it
    if (output_book){
        res.send(output_book.reviews[0]);  
    }
    //If the book doesn't exist 
    res.send("Book with isbn:"+(i_isbn)+" doesn't exist!");
});

module.exports.general = public_users;
