const User = require('../models/user');
const  braintree = require('braintree');
require('dotenv').config();

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "YOUR_PRODUCTION_MERCHANT_ID",
    publicKey: "YOUR_PRODUCTION_PUBLIC_KEY",
    privateKey: "YOUR_PRODUCTION_PRIVATE_KEY"
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
   let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
           }
        }
    );
};



//BRAINTREE_MARCHANT_ID=pt7gt4rzzjvjr46t
//BRAINTREE_PUBLIC_KEY=kq8g5nq9f747x62y
//BRAINTREE_PRIVATE_KEY=69e7f1ac0fb14ddcd690d07ecda8f8ae