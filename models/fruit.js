/////////////////////////////////////
// Import Dependencies
/////////////////////////////////////

// Import the existing connected mongoose object from connection.js
const mongoose = require("./connection")


//////////////////////////////////////
// Create our Fruits Model
/////////////////////////////////////
// pull schema and model from mongoose/ destructuring Schema and model from mongoose
const {Schema, model} = mongoose

// Make a fruits Schema 
const fruitsSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean,
    username: String
})

// Make a fruit model
const Fruit = model("Fruit", fruitsSchema)

// Log the model to make sure that it exits
// console.log(Fruit)

//////////////////////////
// Export the fruit model
/////////////////////////

module.exports = Fruit