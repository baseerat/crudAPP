const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models"); // models path depend on your structure
const { USER } = require("./config/config");
const User = db.user;

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


/**
 *  @method             GET
 *  @description        Get all users
 *  @input              none
 *  @output             [ User ]
 *  @access             private
 */
app.get("/getallusers", (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
});

/**
 *  @method             POST
 *  @description        Create a user
 *  @input              {firstname,lastname,password,email}
 *  @output             User
 *  @access             private
 */
app.post("/createUser", (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.password || !req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password ,
    email:req.body.email
  };

  // Save Tutorial in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
});
});



/**
 *  @method             GET
 *  @description        Get a user
 *  @input              
 *  @param              id
 *  @output             User
 *  @access             private
 */
app.get("/getSingleUser/:id", (req, res) => {

  
  const id = req.params.id;

 User.findByPk(id)
    .then(data => {
      if(data){
        res.status(200).send(data);
      }else{
        res.status(404).send("User not found");
      }
      
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
});

/**
 *  @method             DELETE
 *  @description        Delete a user
 *  @input              
 *  @param              id
 *  @output             User
 *  @access             private
 */
app.delete("/deleteSingleUser/:id", (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
});


/**
 *  @method             PUT
 *  @description        Update a user
 *  @input              {firstname,lastname,password,email}
 *  @param              id
 *  @output             User
 *  @access             private
 */
app.put("/updateSingleUser/:id", (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });

});


db.sequelize.sync().then(()=>{}).catch((err)=>{
  console.log(err)
  });;
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});