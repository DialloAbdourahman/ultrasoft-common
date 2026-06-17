"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToArray = void 0;
const stringToArray = (value, separator = ',') => {
    if (!value) {
        return [];
    }
    return value
        .split(separator)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
};
exports.stringToArray = stringToArray;
//# sourceMappingURL=string-to-array.js.map