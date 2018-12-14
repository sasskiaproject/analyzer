"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sast = require("sast");
var ColorFeature_1 = require("./Features/ColorFeature");
var CssFeature_1 = require("./Features/CssFeature");
var ColorProcessor_1 = require("./Processors/ColorProcessor");
var VariableStorage_1 = require("./Storages/VariableStorage");
var ColorStorage_1 = require("./Storages/ColorStorage");
var FileParser = /** @class */ (function () {
    function FileParser() {
    }
    FileParser.prototype.parse = function (filepath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.context = filepath;
            sast.parseFile(filepath)
                .then(function (tree) {
                if (tree.type !== 'stylesheet') {
                    // error
                    throw new Error('Invalid type.');
                }
                for (var _i = 0, _a = tree.children; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.type === 'ruleset') {
                        _this.parse_ruleset(item);
                    }
                    else if (item.type === 'declaration') { // SCSS variables
                        _this.parse_variable_declaration(item);
                    }
                    else {
                        console.debug(item);
                    }
                }
                resolve();
            })
                .catch(function (error) { return reject(error); });
        });
    };
    /**
     * A ruleset is a block of CSS statements grouped by a selector
     * @param item
     * @param parentSelector
     */
    FileParser.prototype.parse_ruleset = function (item, parentSelector) {
        if (parentSelector === void 0) { parentSelector = null; }
        var selector = this.parse_selector(item.children[0]); // first child is always selector
        if (parentSelector) {
            selector.selector = parentSelector.selector + ' ' + selector.selector;
            selector.prettified = parentSelector.prettified + ' ' + selector.prettified;
            // remove spaces and parentSelector
            selector.prettified = selector.prettified.replace(' & ', '');
        }
        // get block
        var blockObjs = item.children.filter(function (child) { return child.type === 'block'; });
        var properties = this.parse_block(blockObjs[0], selector);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop = properties_1[_i];
            prop.context = { file: this.context, start: item.position.start, end: item.position.end };
            if (prop instanceof ColorFeature_1.ColorFeature) {
                var rgba_string = prop.rgba.toString();
                if (!ColorStorage_1.ColorStorage.map.has(rgba_string)) {
                    ColorStorage_1.ColorStorage.map.set(rgba_string, []);
                }
                ColorStorage_1.ColorStorage.map.get(rgba_string).push(prop);
            }
        }
    };
    /**
     * Process CSS selector elements
     * @param selector
     */
    FileParser.prototype.parse_selector = function (selector) {
        if (selector.type !== 'selector') {
            throw new Error('parse_selector - Invalid structure...');
        }
        var selectorFragments = [];
        for (var _i = 0, _a = selector.children; _i < _a.length; _i++) {
            var selectorFragment = _a[_i];
            // keep spaces and >
            if (selectorFragment.type === 'space' || selectorFragment.type === 'combinator') {
                selectorFragments.push(selectorFragment.value);
                continue;
            }
            var prefix = void 0;
            switch (selectorFragment.type) {
                case 'class': // .class
                    prefix = '.';
                    break;
                case 'id': // #id
                    prefix = '#';
                    break;
                case 'typeSelector': // HTML tag
                    prefix = '';
                    break;
                case 'parentSelector': // &
                    selectorFragments.push('&');
                    continue;
                case 'pseudoClass':
                    var identObjs = selectorFragment.children.filter(function (child) { return child.type === 'ident'; });
                    selectorFragments.push(':' + identObjs[0].value);
                    continue;
                default:
                    console.debug('Unknown selector type "' + selectorFragment.type + '"');
                    prefix = '???';
                    break;
            }
            var part = prefix + selectorFragment.children[0].value;
            selectorFragments.push(part);
        }
        return new CssFeature_1.CssSelector(selectorFragments);
    };
    FileParser.prototype.parse_block = function (block, selector) {
        var rulesetObjs = block.children.filter(function (child) { return child.type === 'ruleset'; });
        for (var _i = 0, rulesetObjs_1 = rulesetObjs; _i < rulesetObjs_1.length; _i++) {
            var ruleset = rulesetObjs_1[_i];
            this.parse_ruleset(ruleset, selector);
        }
        var declarationObjs = block.children.filter(function (child) { return child.type === 'declaration'; });
        var properties = [];
        for (var _a = 0, declarationObjs_1 = declarationObjs; _a < declarationObjs_1.length; _a++) {
            var declaration = declarationObjs_1[_a];
            var parsed = this.parse_declaration(declaration, selector);
            if (parsed) {
                properties.push(parsed);
            }
        }
        return properties;
    };
    FileParser.prototype.parse_variable_declaration = function (declaration) {
        var propertyObjs = declaration.children.filter(function (child) { return child.type === 'property'; });
        var valueObjs = declaration.children.filter(function (child) { return child.type === 'value'; });
        var colorProcessor = new ColorProcessor_1.ColorProcessor();
        if (propertyObjs[0].children[0].type !== 'variable') {
            return null;
        }
        var identObjs = propertyObjs[0].children[0].children.filter(function (child) { return child.type === 'ident'; });
        if (colorProcessor.isProcessable('color', valueObjs)) {
            var color = colorProcessor.process('color', valueObjs, null);
            // Add color to variablemap
            VariableStorage_1.VariableStorage.map.set(identObjs[0].value, color);
        }
    };
    FileParser.prototype.parse_declaration = function (declaration, selector) {
        var propertyObjs = declaration.children.filter(function (child) { return child.type === 'property'; });
        var valueObjs = declaration.children.filter(function (child) { return child.type === 'value'; });
        var colorProcessor = new ColorProcessor_1.ColorProcessor();
        switch (propertyObjs[0].children[0].type) {
            case 'ident':
                var property_type = propertyObjs[0].children[0].value;
                console.debug('Parsing declaration of type ident – property_type=' + property_type);
                if (colorProcessor.isProcessable(property_type, valueObjs)) {
                    return colorProcessor.process(property_type, valueObjs, selector);
                }
                else {
                    console.debug('Skipping property of type ' + property_type + '.');
                }
                break;
            default:
                console.debug('Unknown type of first declaration child ' + propertyObjs[0].children[0].type);
                break;
        }
        return null;
    };
    return FileParser;
}());
exports.FileParser = FileParser;
