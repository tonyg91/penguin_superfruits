/////////////////////////////////////
// Import Dependencies
/////////////////////////////////////

// Import the existing connected mongoose object from connection.js
const mongoose = require("./connection")


//////////////////////////////////////
// Create our User Model
/////////////////////////////////////
// pull schema and model from mongoose/ destructuring Schema and model from mongoose
const {Schema, model} = mongoose

// Make a fruits Schema 
const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

// Make a user model
const User = model("User", userSchema)

// Log the model to make sure that it exits
// console.log(Fruit)

//////////////////////////
// Export the User model
/////////////////////////

module.exports = User