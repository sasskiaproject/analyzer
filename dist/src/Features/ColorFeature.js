"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CssFeature_1 = require("./CssFeature");
var RGBColor = /** @class */ (function () {
    function RGBColor() {
    }
    RGBColor.prototype.toString = function () {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    };
    return RGBColor;
}());
exports.RGBColor = RGBColor;
var ColorFeature = /** @class */ (function (_super) {
    __extends(ColorFeature, _super);
    function ColorFeature() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rgba = new RGBColor();
        return _this;
    }
    return ColorFeature;
}(CssFeature_1.CssFeature));
exports.ColorFeature = ColorFeature;
