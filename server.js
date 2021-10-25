///////////////////////////////////
// Import our Dependencies
///////////////////////////////////
require("dotenv").config() // brings in .env vars
const express = require("express") // web framework
const morgan = require("morgan") // logger
const methodOverride = require("method-override") // to swap request methods
const mongoose = require("mongoose") // our database library
const path = require("path") // helper functions for file paths



///////////////////////////////////
// Establish Database Connection
//////////////////////////////////
// setup the inputs for mongoose connect
const DATABASE_URL = process.env.DATABASE_URL // url from .env
//This is a second argument to stop all the warnings from popping up when running node or nodemon
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Connect to Mongo
mongoose.connect(DATABASE_URL, CONFIG)

//our connection messages
mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("disconnected from mongo"))
.on("error", (error) => console.log(error))

//////////////////////////////////////
// Create our Fruits Model
/////////////////////////////////////
// pull schema and model from mongoose/ destructuring Schema and model from mongoose
const {Schema, model} = mongoose

// Make a fruits Schema 
const fruitsSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})

// Make a fruit model
const Fruit = model("Fruit", fruitsSchema)

// Log the model to make sure that it exits
// console.log(Fruit)

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

///////////////////////////////////////////
// Routes
///////////////////////////////////

app.get("/", (req, res) => {
    res.send("Your server is running... better catch it ")
})

//////////////////////////
// Fruits Routes
/////////////////////////
// Seed Route - This will delete the data everytime it runs or refreshes in the data
app.get("/fruits/seed", (req, res) => {
    // array of starter fruits
    const startFruits = [
      { name: "Orange", color: "orange", readyToEat: false },
      { name: "Grape", color: "purple", readyToEat: false },
      { name: "Banana", color: "orange", readyToEat: false },
      { name: "Strawberry", color: "red", readyToEat: false },
      { name: "Coconut", color: "brown", readyToEat: false },
    ];

    // Delete all fruits
    Fruit.deleteMany({})
    .then((data) => {
        // seed the starter fruits
        Fruit.create(startFruits)
        .then((data) => {
            // send created fruis back as json
            res.json(data)
        })
    })
})

// index route - get - /fruts 
app.get("/fruits", (req, res) => {
    // find all the fruits
    Fruit.find({})
    //variable at the end of res.render
    .then((fruits) => {
        //render the templete
        res.render("fruits/index.liquid", {fruits})
    })
    // error handeling
    .catch((error) => {
        res.json((error))
    })
})


// New Route
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.liquid")
})

// Create Route
app.post("/fruits", (req, res) => {
    // convert the checkbox property to true or false 
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
     // create the new fruit
    Fruit.create(req.body)
       .then((fruits) => {
    // redirect user to index page if successfully created item
    res.redirect("/fruits")
  })
  // send error as json
  .catch((error) => {
    // console.log(error)  to console.log errors and test 
    res.json({ error })
  });
})


// Edit route - get request to /fruits/:id/edit
app.get("/fruits/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // get the fruit from the database
    Fruit.findById(id)
      .then((fruit) => {
        // render edit page and send fruit data
        res.render("fruits/edit.liquid", { fruit });
      })
      // send error as json
      .catch((error) => {
        //console.log(error); show error in console.log
        res.json({ error });
      });
  });

// Update Route
app.put("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // convert the checkbox property to true or false 
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
    // Updating the item with the matching id
    Fruit.findByIdAndUpdate(id, req.body, {new: true})
    .then((fruit) => {
        //redirect user back to index 
        res.redirect("/fruits")
    })
    // send error as json
    .catch((error) => {
        //console.log(error); show error in console.log
        res.json({ error });
      });
})

// Delete / Destory Route - delete request - /fruits/:id
app.delete("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // Delete the fruit
    Fruit.findByIdAndRemove(id)
    .then((fruit) => {
        res.redirect("/fruits")
    })
    // send error as json
    .catch((error) => {
        //console.log(error); show error in console.log
        res.json({ error });
      });
})


// Show Route - get- /fruits/:id
app.get("/fruits/:id", (req, res) => {
    const id = req.params.id

  // find the particular fruit from the database
  Fruit.findById(id)
    .then((fruit) => {
      // render the template with the data from the database
      res.render("fruits/show.liquid", { fruit });
    })
    .catch((error) => {
      console.log(error);
      res.json({ error });
    });
});


//////////////////////
// Set up listener
/////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))