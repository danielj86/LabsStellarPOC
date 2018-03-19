const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const Helper = require('../Helpers/Herlpers');

StellarSdk.Network.useTestNetwork();

class StellarAPI {

    constructor() { }

    static registerIncomingPayments(callback) {
        server.payments()
            .cursor('now')
            .stream({
                onmessage: function (message) {
                    callback(message);
                }
            })
    }

    static createRandomKeyPair() {
        return StellarSdk.Keypair.random();
    }

    static async createAccount(newAccountPublicKey, amount) {
        var faucetKeys = StellarSdk.Keypair.fromSecret("SA3W53XXG64ITFFIYQSBIJDG26LMXYRIMEVMNQMFAQJOYCZACCYBA34L"); //faucet secret key
        var faucetpublicKey = faucetKeys.publicKey();

        return server.loadAccount(faucetpublicKey).then(function (faucetAccount) {

            var transaction = new StellarSdk.TransactionBuilder(faucetAccount)
                .addOperation(StellarSdk.Operation.createAccount({
                    destination: newAccountPublicKey,
                    startingBalance: amount.toString()
                })).build();

            transaction.sign(faucetKeys);

            return server.submitTransaction(transaction);
        });
    }

    static async loadAccount(publicKey) {
        return server.loadAccount(publicKey);
    }

    static async createPaymentTransaction(secret, destinantion, amount, hashMemo) {

        var originKeys = StellarSdk.Keypair.fromSecret(secret);

        return server.loadAccount(originKeys.publicKey()).then(function (account) {

            var transactionBuilder = new StellarSdk.TransactionBuilder(account)
                .addOperation(StellarSdk.Operation.payment({
                    destination: destinantion,
                    asset: StellarSdk.Asset.native(),
                    amount: amount.toString(),
                }));

            if (hashMemo) {
                transactionBuilder.addMemo(StellarSdk.Memo.text(hashMemo.toString()));
            }

            var transaction = transactionBuilder.build();

            transaction.sign(originKeys);

            return server.submitTransaction(transaction);
        });
    }
}

module.exports = StellarAPI;