/////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////

// Express for router function
const express = require("express")
// Fruit Model
const Fruit = require("../models/fruit.js")

/////////////////////////////////////
// Create Router
////////////////////////////////////

// Declare router
const router = express.Router()

///////////////////////////////////
// Router Middleware
//////////////////////////////////

router.use((req, res, next) => {
  // check if logged in 
    if (req.session.loggedIn){
      // send to routes
      next()
    } else {
      res.redirect("/user/login")
    }
})

//////////////////////////
// Fruits Routes
/////////////////////////


// index route - get - /fruts 
router.get("/", (req, res) => {
    // find all the fruits
    Fruit.find({username: req.session.username})
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
router.get("/new", (req, res) => {
    res.render("fruits/new.liquid")
})

// Create Route
router.post("/", (req, res) => {
    // convert the checkbox property to true or false 
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false;

    // add the username to req.body to track user
    req.body.username = req.session.username

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
router.get("/:id/edit", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
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
router.get("/:id", (req, res) => {
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


//////////////////////////////////
// Export the router
/////////////////////////////////

module.exports = router 