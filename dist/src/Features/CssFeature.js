"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CssSelector = /** @class */ (function () {
    function CssSelector(selectorFragments) {
        this.selector = selectorFragments.join('');
        this.prettified = selectorFragments.filter(function (x) { return x !== ' '; }).join(' ');
    }
    return CssSelector;
}());
exports.CssSelector = CssSelector;
var CssFeature = /** @class */ (function () {
    function CssFeature() {
    }
    return CssFeature;
}());
exports.CssFeature = CssFeature;
