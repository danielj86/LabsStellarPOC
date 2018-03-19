class Helper {

    static toUTF8Buffer(str) {
        let buffer = Buffer.from(str);
        return buffer.toString('hex');
    }
}

module.exports = Helper;