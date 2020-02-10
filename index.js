// implement your API here
const express = require('express');

const Database = require('./data/db.js');

const server = express();
server.use(express.json());

//Endpoints vvv

//Get to '/'
server.get('/', (req, res) => {
    res.send({ hello: "It's alive" })
})

//Create user
server.post('/api/users', (req, res) => {
    const userData = req.body

    if (!userData.name || !userData.bio)
        res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
    Database.insert(userData)
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database"});
        })
})

//Get all users in database
server.get('/api/users', (req, res) => {
    Database.find()
        .then(users => {
            console.log('Users: ' + users);
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The users information could not be retrieved."})
        })
})

//Get a user with specified ID
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    Database.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            } else {
                console.log('User: ' + user)
                res.status(200).json(user)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: "The user information could not be retrieved."})
        })
})

//Deletes a user with specified ID
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    Database.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => console.log(err));
    Database.remove(id)
        .then(deleted => res.status(200).json(deleted))
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The user could not be removed" })
        })
})

//Updates a user by specified ID
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const userData = req.body;

    if (!userData.name || !userData.bio)
        res.status(400).json({ errorMessage: "Please provide name and bio for the user."})

    Database.findById(id)
    .then(user => {
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err => console.log(err));
    
    Database.update(id, userData)
        .then(update => res.status(200).json(update))
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The user information could not be modified." })
        })
})

const port = 8000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));

// fork > clone > type: "npm i" in the project folder to get the dependencies.
// type: "npm i express" (no quotes) to install the express library
// add the "index.js" file with code the root folder
// to run the server type: "npm run server"
// make a GET request to localhost:8000 using Postman or Insomnia

// to solve the sqlite3 error just do npm i sqlite3