const connection = require("../config/dbConnect");
const hmacsha1 = require('hmacsha1');

function middleWare() {

  this.newRegisteration = function (req, res, data) {
    console.log("Let's check what type of entry this is and assign a registeration ID accordingly");
    // checking if it's an individual entry or team entry and adding the param to registration ID
    var teamType = req.body.isTeam;
    if (teamType == 1) {
      var entryType = 'TR';
    } else {
      var entryType = 'IR'
    }

    // generating the registration ID
    function stringChar(string, place) { return string.charAt(place) }
    var registrationId = function generateRegistration() {
      var minimum = 40650;
      var maximum = 98990;
      var registrationNumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
      /* How - getting the entryType from param
                +generating a random number of five digits
                +adding users first name first charachter
                +adding users last name first charachter
                +adding users phone number fifth charachter
 
                for example INDIVIDUAL ENTRY USER - JOHN M WILSON  & PHONE - 400-2356-202 will be IE40832JW3
      */
      return entryType + registrationNumber + stringChar(data.firstName, 0) + stringChar(data.lastName, 0) + data.phoneNumber.toString()[5];
    }

    // storing the registration id so that we can display it on the redirected page
    return getId = registrationId().toUpperCase();
  }


  // adding users data
  this.addUser = function (req, res, data, getId) {
    console.log("Let's add some data");
    connection.init();
    connection.acquire(function (err, con) {
      console.log("We are Connected to the database! Let's try Searching for data");
      var values = {
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        email_address: data.emailAddress,
        birth_date: data.birthDate,
        qualification: data.qualification,
        current_status: data.currentStatus,
        passed_on: data.passedOn,
        pin_code: data.pinCode,
        address_line: data.addressLine,
        city_name: req.body.cityName,
        state_name: req.body.stateName,
        registration_id: getId
      };
      var mkusr = {
        registration_id: getId,
        is_team: req.body.isTeam,
        team_count: req.body.teamCount,
        team_members: data.teamMembers,
      };
      // adding user in user table
      con.query("INSERT INTO users SET ?", mkusr, function (err, result) {
        if (err) {
          console.log("error ocurred white adding creating a user", err);
          res.send({
            "status": 400,
            "failed": "error ocurred"
          })
        }
        console.log("User Created");
      });

      // Adding user details in user_details table
      con.query("INSERT INTO user_details SET ?", values, function (err, result) {
        if (err) {
          console.log("error ocurred while inserting user details", err);
          res.send({
            "status": 400,
            "failed": "error ocurred"
          })
        }
        console.log("User Details added");
      });
      console.log("We have added the user, now continue to success redirection");
    });
  };

  this.checkHash = function (obj, SALT_KEY) {
    var newD = function (obj) {
      return Object.keys(obj).reduce((result, key) => {
        if (key !== 'mac') {
          result[key] = obj[key];
        }
        return result;
      }, {});
    }
    var orderObj = function (newD) {

      var keys = Object.keys(newD).sort(function keyOrder(k1, k2) {
        if (k1 < k2) return -1;
        else if (k1 > k2) return +1;
        else return 0;
      });

      var i, after = {};
      for (i = 0; i < keys.length; i++) {
        after[keys[i]] = newD[keys[i]];
        delete newD[keys[i]];
      }

      for (i = 0; i < keys.length; i++) {
        newD[keys[i]] = after[keys[i]];
      }
      return newD.toLowerCase;
    }
    var macVal = Object.values(orderObj);
    var macData = macVal.join('|');

    return hmacsha1(SALT_KEY, macData);

  }

}

module.exports = new middleWare();