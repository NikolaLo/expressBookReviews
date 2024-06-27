const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write request in local variables
    let i_isbn=req.params.isbn;
    let i_review=req.query.review;
    //Get the username if the user is ruthenticated
    let username=req.session.authorization?req.session.authorization.username:null;
    if(!username){
        return res.status(403).send("You need to login!");
    }
    if(!books[i_isbn]){
         return res.status(404).send(`The book with isbn: ${i_isbn} doesn't exist!`);
    }
    if (!i_review){
        //Write the review of the correct book
        return res.status(400).send("The review is empty!");
    }
    books[i_isbn].reviews[username] = i_review;
    return res.status(200).send(`The review from user: ${username} was successfully added!`);

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let i_isbn=req.params.isbn;
    //Get the username if the user is ruthenticated
    let username=req.session.authorization?req.session.authorization.username:null;
    if(!username){
        return res.status(403).send("You need to login!");
    }
    if(!books[i_isbn]){
         return res.status(404).send(`The book with isbn: ${i_isbn} doesn't exist!`);
    }

    delete books[i_isbn].reviews[username];
    return res.status(200).send(`The review from user: ${username} was successfully deleted!`);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
