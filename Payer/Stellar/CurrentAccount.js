const fs = require('fs');
const StellarAPI = require('./StellarAPI');
let account = null;
let publicKey = '';
let secretKey = '';


class CurrentAccount {

    constructor() { }

    static async load(callback) {
        if (!fs.existsSync('./public.key') && !fs.existsSync('./secret.key')) {
            let pair = StellarAPI.createRandomKeyPair();

            publicKey = pair.publicKey();
            secretKey = pair.secret();

            let transaction = await StellarAPI.createAccount(publicKey, "100");

            if (transaction.hasOwnProperty('hash')) {
                fs.writeFileSync('./public.key', publicKey, 'utf8');
                fs.writeFileSync('./secret.key', secretKey, 'utf8');

                console.log("New account created and funded");
            } else {
                console.log('Failed to create new account');
            }

        } else {
            publicKey = fs.readFileSync('./public.key', 'utf8');
            secretKey = fs.readFileSync('./secret.key', 'utf8');
            console.log("Wallet loaded");
        }

        account = await StellarAPI.loadAccount(publicKey);
        StellarAPI.registerIncomingPayments(callback);
    }

    static getAccount() {
        return account;
    }

    static async WireFunds(destinantion, amount, signatureHash) {
        return await StellarAPI.createPaymentTransaction(secretKey, destinantion, amount, signatureHash);
    }
}


module.exports = CurrentAccount;