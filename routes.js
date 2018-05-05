//custom route for fetching data
const express = require("express");
const middleWare = require("./api/middleWare");
const api = require("./api/index");
const router = express.Router();

const { check, validationResult } = require("express-validator/check");
const { matchedData } = require("express-validator/filter");

// Serving home page
router.get("/", function (req, res) {
  res.render("index");
});

// Serving the registration form
router.get('/register', function (req, res) {
  res.render('register', {
    data: {},
    errors: {},
    alreadyRegistered: false,
    teamType: req.query.isTeam  // requesting the query param from URL
  });
});

// Saving the user data (registration)
router.post(
  "/submit", [
  check("firstName")
    .isLength({ min: 3 })
    .withMessage("Valid First Name is required")
    .trim(),
  check("middleName").trim(),
  check("lastName")
    .isLength({ min: 1 })
    .withMessage("Last Name is required")
    .trim(),
  check("phoneNumber")
    .isMobilePhone('en-IN')
    .withMessage("Valid Phone Number is required")
    .trim(),
  check("emailAddress")
    .isEmail()
    .withMessage("A valid Email Address is required")
    .trim(),
  check("birthDate")
    .isISO8601()
    .withMessage("A valid DOB is required")
    .trim(),
  check("qualification")
    .not()
    .isEmpty()
    .withMessage("Please choose an option")
    .trim(),
  check("currentStatus")
    .not()
    .isEmpty()
    .withMessage("Please choose an option")
    .trim(),
  check("passedOn")
    .isInt({ min: 1990, max: 2022 })
    .withMessage("Please tell us when did you passed")
    .trim(),
  check("pinCode")
    .isPostalCode('IN')
    .withMessage("A valid Pincode is required")
    .trim(),
  check("addressLine")
    .isLength({ min: 1, max: 60 })
    .withMessage("Address is required")
    .trim(),
  check("teamCount")
    .not()
    .isEmpty()
    .withMessage("Please choose an option")
    .trim(),
  check("teamMembers")
    .isLength({ min: 3 })
    .withMessage("Please enter your team members name")
    .trim()
  ],
  (req, res, next) => {

    // requesting validation errors from express-validator
    const errors = validationResult(req);

    // if there was validation errors or user is already registered we show the filled form with relavant errors
    if (!errors.isEmpty()) {
      return res.render("register", {
        data: req.body,
        errors: errors.mapped(),
        alreadyRegistered: false,
        teamType: req.body.isTeam
      });
    }

    // creating an object for our form data if everything is fine
    const data = matchedData(req);
    //console.log("Sanitized:", data);

    // calling our API & registering user
    api.register(req, res, errors, data);

    //console.log("response", res); ----- for dev only, so that we can check what data is being sent through the form

  }
);

// Adding the user registration
router.post('/paymentSuccess', function (req, res, data, getId) {
  console.log('Payment succeded, so lets add the user data');
  
});


router.get('/success', function (req, res, data, getId) {
  console.log('User was added so lets redirect the user to success page');
  req.flash("success", "Great!");
  req.flash("registration", getId);
  res.redirect('index', {
    data: data,
    yourId: getId
  });
});

module.exports = router;