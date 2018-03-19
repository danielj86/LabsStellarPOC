class Helper {

    static toUTF8Buffer(str) {
        let buffer = Buffer.from(str);
        return buffer.toString('hex');
    }


    static DateBetweenRange(date, days) {
        var dDate = new Date(date);
        return new Date().getTime() - dDate > 60 * 60 * 1000 * 24 * days;
    }
}

module.exports = Helper;