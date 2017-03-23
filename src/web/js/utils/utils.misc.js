'use strict';

class Misc {
    static convertToObj(obj, labelName, valueName) {
        let result = {};
        for (let key in obj) {
            let item = obj[key];
            result[item[labelName]] = item[valueName];
        }

        return result;
    }
}


module.exports = Misc;
