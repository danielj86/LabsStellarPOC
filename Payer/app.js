const CurrentAccount = require('./Stellar/CurrentAccount');
const MD5 = require('md5');
const CRC = require('crc-32');
const request = require('request');

(async () => {

    function IcomingPayment(message) {
        var transaction = await = message.transaction();
        var a = transaction;
    }

    //## Stellar account
    await CurrentAccount.load(IcomingPayment);

    //# Payment request JSON
    var now = new Date();
    var expiry = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    var address = 'GDQTTLX2TFJKPT23Q6AUFCDXE56UNYBHNXJ23QX2ZLVMRYMVMZREXY5A';
    var amount = '1';

    var paymentRequest = {
        address: address,
        amount: amount,
        expiry: expiry
    };

    //# Merchant signature request
    request.post({
        headers: {
            "Content-Type": "application/json"
        },
        url: 'http://localhost:3000',
        body: paymentRequest,
        json: true
    }, async function (err, response, body) {
        if (!err) {
            if (body.status == "OK") {

                //# Hash Signature
                let signatureHash = CRC.str(body.signature);

                //# Transfer funds
                var transaction = await CurrentAccount.WireFunds(address, amount, signatureHash);

                //# Log transaction ID
                if (transaction.hasOwnProperty('hash')) {
                    console.log('Successfull transaction: ' + transaction['hash']);
                }
            }
        }

        console.log(body);
    });


})();






