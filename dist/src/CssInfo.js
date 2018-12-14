"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColorStorage_1 = require("./Storages/ColorStorage");
var FileParser_1 = require("./FileParser");
var CssInfo = /** @class */ (function () {
    function CssInfo() {
    }
    CssInfo.prototype.parseFile = function (file) {
        return new Promise(function (resolve, reject) {
            new FileParser_1.FileParser().parse(file)
                .then(function () { return resolve({
                colors: ColorStorage_1.ColorStorage.map
            }); })
                .catch(function (error) { return reject(error); });
        });
    };
    return CssInfo;
}());
exports.CssInfo = CssInfo;
