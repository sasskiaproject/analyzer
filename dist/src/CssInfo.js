"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ColorStorage_1 = require("./Storages/ColorStorage");
var FileParser_1 = require("./FileParser");
var CssInfo = /** @class */ (function () {
    function CssInfo(config) {
        if (config === void 0) { config = null; }
        this.config = {
            appendContentToFeature: false
        };
        if (config) {
            this.config = config;
        }
    }
    CssInfo.prototype.parseFile = function (file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            new FileParser_1.FileParser(_this.config).parse(file)
                .then(function () { return resolve({
                colors: ColorStorage_1.ColorStorage.map
            }); })
                .catch(function (error) { return reject(error); });
        });
    };
    return CssInfo;
}());
exports.CssInfo = CssInfo;
