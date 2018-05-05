const middleWare = require("./middleWare");
const config = require('../config/security')

// Adding InstaMojo API Handler
const Insta = require('instamojo-nodejs');
Insta.setKeys(config.payments.API_KEY, config.payments.AUTH_KEY);
Insta.isSandboxMode(true);

function payment() {
    this.createPayment = function (req, res, data, getId) {
        var pay = new Insta.PaymentData();
        pay.purpose = 'Test this:' + getId;
        pay.amount = (Number(data.teamCount) + 1) * 500;
        pay.buyer_name = data.firstName + ' ' + data.lastName;
        pay.email = data.emailAddress;
        pay.phone = data.phoneNumber;
        pay.setRedirectUrl(config.payments.REDIRECT_URL);
        pay.setWebhook(config.payments.WEBHOOK_URL);

        Insta.createPayment(pay, function (error, response) {
            if (error) {
                // some error
                console.log("Payment creation failed");
            } else {
                console.log('Payment created! Redirecting to payment gateway');
                // checking MAC
                var mac_calculated = middleWare.checkHash(response, config.payments.SALT_KEY);
                if (response.mac == mac_calculated) {
                    console.log('MAC matched');
                    if (response.payment_request.status == "Credit") {
                        //res.redirect(response.payment_request.longurl);
                        console.log("Payment Done, Now Adding the user details");
                        middleWare.addUser(req, res, data, getId);
                        console.log(response);
                    } else {
                        console.log("Payment failed, Need to server the form again");
                    }
                }
            }
        });
    };
}

module.exports = new payment();