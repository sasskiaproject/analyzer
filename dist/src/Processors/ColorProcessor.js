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
var toHex = require("colornames");
var hexRgb = require("hex-rgb");
var ColorFeature_1 = require("../Features/ColorFeature");
var AbstractProcessor_1 = require("./AbstractProcessor");
var VariableStorage_1 = require("../Storages/VariableStorage");
var Configuration_1 = require("../Configuration");
var ColorProcessor = /** @class */ (function (_super) {
    __extends(ColorProcessor, _super);
    function ColorProcessor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorProcessor.prototype.isProcessable = function (property_type, object) {
        return /color/.test(property_type) || property_type === 'border';
    };
    ColorProcessor.prototype.extract_border_colors = function (valueObj) {
        var colorObjs = valueObj[0].children.filter(function (x) { return ['color', 'function', 'variable', 'ident'].indexOf(x.type) !== -1; });
        // ident can also be a non-color like "solid" – check if it is a valid color
        var removeNonColors = colorObjs.filter(function (x) { return x.type !== 'ident' || toHex(x.value); });
        return removeNonColors[0]; // todo: check if looping over all entries makes sense
    };
    ColorProcessor.prototype.newFeature = function () {
        return new ColorFeature_1.ColorFeature();
    };
    ColorProcessor.prototype.getRGBAForHexColor = function (hexColor) {
        var color = new ColorFeature_1.RGBColor();
        var rgb = hexRgb(hexColor);
        color.r = rgb.red;
        color.g = rgb.green;
        color.b = rgb.blue;
        color.a = rgb.alpha;
        return color;
    };
    ColorProcessor.prototype.process = function (property_type, valueObj, selector) {
        var valueObject = valueObj[0].children[0]; // todo: check if looping over all entries makes sense
        if (property_type === 'border') {
            valueObject = this.extract_border_colors(valueObj);
            if (!valueObject) {
                return null;
            }
        }
        var color = _super.prototype.process.call(this, property_type, valueObj, selector);
        switch (valueObject.type) {
            case 'ident': // basic string, e.g. black
                color.original = valueObject.value;
                color.original_type = 'name';
                color.rgba = this.getRGBAForHexColor(toHex(valueObject.value));
                break;
            case 'variable': // SCSS variable, e.g. $black
                if (Configuration_1.Configuration.skip_variables) {
                    return null;
                }
                var variable_name = valueObject.children[0].value;
                if (!VariableStorage_1.VariableStorage.map.has(variable_name)) {
                    throw new Error('Missing variable ' + variable_name + '!');
                }
                color.rgba = Object.assign(color.rgba, VariableStorage_1.VariableStorage.map.get(variable_name).rgba);
                color.original = '$' + variable_name;
                color.original_type = 'variable';
                break;
            case 'color': // HEX color, e.g. #000 or #000000
                color.original = '#' + valueObject.value;
                color.original_type = 'hex';
                color.rgba = this.getRGBAForHexColor(valueObject.value);
                break;
            case 'function': // RGB color, e.g. rgb(10, 10, 10) or rgba(10, 10, 10, 0.1)
                var function_name = valueObject.children[0].value;
                var function_args = valueObject.children[1].children;
                if (function_name === 'rgb' || function_name === 'rgba') {
                    var numbers = function_args.filter(function (color) { return color.type === 'number'; }).map(function (x) { return Number(x.value); });
                    color.original_type = 'rgba';
                    color.original = function_name + '(' + numbers.join(',') + ')';
                    color.rgba.r = numbers[0];
                    color.rgba.g = numbers[1];
                    color.rgba.b = numbers[2];
                    color.rgba.a = function_name === 'rgba' ? numbers[3] : 1.0;
                }
                break;
            default: // undefined - skip
                console.log('parse_declaration - undefined: ', valueObj);
                return;
        }
        return color;
    };
    return ColorProcessor;
}(AbstractProcessor_1.AbstractProcessor));
exports.ColorProcessor = ColorProcessor;
