const rsa = require('node-rsa');

class CryptoService {

    constructor() { }

    static sign(message, privateKey) {
        var pk = new rsa(privateKey);
        var signature = pk.sign(message, 'base64');
        return signature;
    }

    static veirfy(message, signature, publicKey) {
        var pk = new rsa(publicKey);
        var res = pk.verify(message, signature, 'utf8', 'base64');
        return res;
    }

    static generateKeys() {
        this._privateKey = new rsa({ b: 1024 });
        var publicd = this._privateKey.exportKey('pkcs8-public-pem');
        var exported = this._privateKey.exportKey('pkcs8-private-pem');


        return { privated: exported, publicd: publicd };
    }

}

module.exports = CryptoService;