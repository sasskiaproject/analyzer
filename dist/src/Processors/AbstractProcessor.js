"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractProcessor = /** @class */ (function () {
    function AbstractProcessor() {
    }
    AbstractProcessor.prototype.process = function (property_type, object, selector) {
        var feature = this.newFeature();
        feature.selector = selector;
        feature.property_type = property_type;
        feature.line = object[0].position.start.line; // assume that start and end line are be the same...
        return feature;
    };
    return AbstractProcessor;
}());
exports.AbstractProcessor = AbstractProcessor;
