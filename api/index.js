const connection = require("../config/dbConnect");
const middleWare = require("./middleWare");
const payment = require("./payment");
const config = require('../config/security')

function api() {
  this.register = function (req, res, errors, data) {
    //console.log("API Called");
    // initialize database connection
    connection.init();
    connection.acquire(function (err, con) {
      //console.log("We are Connected to the database! Let's try Searching for data");
      var email = req.body.emailAddress;
      con.query('SELECT * FROM user_details WHERE email_address = ?', [email], function (err, results, fields) {
        if (err) {
          //console.log("error ocurred while searching for users", err);
          res.send({
            "status": 400,
            "failed": "error ocurred"
          })
        }
        var isTaken;
        if (results.length > 0) {
          //console.log("User already exist");
          isTaken = true;
          var errTaken = "This email address is already registered"
          // render the error in form 
          return res.render("register", {
            data: req.body,
            alreadyRegistered: true,
            errors: errTaken,
            teamType: req.body.isTeam
          });
        } else {
          //console.log("New User registeration");
          isTaken = false;

          // generating new user registeration id
          middleWare.newRegisteration(req, res, data);

          // firing the payment api, creating a payment request and check if the payment is done----------?
          payment.createPayment(req, res, data, getId);

          // if payment fails serving the filled form to the user again--------------?
          // if succedded, Adding the sanitized data into our database via our API
          //middleWare.addUser(req, res, data, getId);

          // sending the data to redirected page via flash
          //req.flash("success", "Great!");
          //req.flash("registration", getId);
          // redirecting -- currently rendering the same page need to change to redirect--------------?
          //res.render("success", {
          //  yourId: getId,
          //  data: data
          //});
        }
      });
    });


  }
}
module.exports = new api();