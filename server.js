///////////////////////////////////
// Import our Dependencies
///////////////////////////////////
require("dotenv").config() // brings in .env vars
const express = require("express") // web framework
const morgan = require("morgan") // logger
const methodOverride = require("method-override") // to swap request methods
//const mongoose = require("mongoose") // our database library  <<< Not needed if in MVC model
const path = require("path") // helper functions for file paths
// const Fruit = require("./models/fruit") <<<< Not needed if in MVS model 

// MVS Router Path
const FruitsRouter = require("./controllers/fruit")
// User Router
const UserRouter = require("./controllers/user")

const session = require("express-session") // session middleware
const MongoStore = require("connect-mongo") // save sessions in mongo

//////////////////////////////////////
// Create our app with object, configure liquid
////////////////////////////////////////

// Import liquid
const liquid = require("liquid-express-views")

// construct an absolute path to our views folder 
const viewsFolder = path.resolve(__dirname, "views/")
// Test run
// console.log(viewsFolder)

// create an app object with liquid, passing the path to the views folder
const app = liquid(express(), {root: viewsFolder})

// console.log app to confirm it exists
// console.log(app)

////////////////////////////////
// Register Middleware
////////////////////////////////

//logging  tiny is just a built in templete for morgan logs 
app.use(morgan("tiny"))

// override for put and delete requests from forms
app.use(methodOverride("_method"))

// parse urlencoded request bodies
app.use(express.urlencoded({ extended: true }))

// serve files from public statically
app.use(express.static("public"))

// middleware to create sessions (req.session)
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({mongoUrl: process.env.DATABASE_URL}),
    resave: false,
    saveUninitialized: true
}))

///////////////////////////////////////////
// Routes
///////////////////////////////////

app.get("/", (req, res) => {
    res.render("index.liquid")
})

// Register Fruits router 
app.use("/fruits", FruitsRouter)

// Register User router
app.use("/user", UserRouter)

//////////////////////
// Set up listener
/////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))