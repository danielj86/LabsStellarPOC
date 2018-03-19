const http = require('http');
const CRC = require('crc-32');
const port = 3000
const CryptoService = require('./Services/CryptoService')
const Helper = require('./Helpers/Helper');

const CurrentStellarAccount = require('./Stellar/CurrentAccount');

var pendingTransactions = [];

function incomingTransaction(message) {
    message.transaction().then(transaction => {
        if (transaction.hasOwnProperty('memo')) {

            var hash = transaction.memo;

            //compare to hash on the list
            for (var i = 0; i < pendingTransactions.length; i++) {
                var item = pendingTransactions[i]
                if (item.crc == hash) {
                    console.log("Valid transaction!");
                }
            }
        }
    });
}

CurrentStellarAccount.load(incomingTransaction).then(account => {

    var keys = CryptoService.generateKeys();
    var myAddress = account.account_id;
    var private = keys.privated;

    const requestHandler = (req, res) => {
        if (req.method == "POST") {
            let body = '';

            req.on('data', function (data) {
                body += data;
                console.log("Partial body: " + body);
            });

            req.on('end', function () {

                var bodyObj = JSON.parse(body);
                var transactionValid = true;

                if (bodyObj.address !== myAddress) {
                    transactionValid = false;
                }

                if (bodyObj.amount * 1 < 100) {
                    transactionValid = false;
                }

                if (!Helper.DateBetweenRange(bodyObj.expiry, 30)) {
                    transactionValid = false;
                }

                if (transactionValid) {
                    var signature = CryptoService.sign(body, private);
                    pendingTransactions.push({ signature: signature, crc: CRC.str(signature) });

                    res.end(JSON.stringify({ status: 'OK', signature: signature }));
                }
                else {
                    res.end(JSON.stringify({ status: 'error', message: "Invalid transaction request" }));
                }
            });
        }
    }

    const server = http.createServer(requestHandler)
    server.listen(port, (err) => {
        if (err) {
            return console.log('something bad happened', err)
        }

        console.log(`server is listening on ${port}`)
    })

});



