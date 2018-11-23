import * as sast from 'sast';
import * as fs from 'fs';
import {ColorFeature} from "./Features/ColorFeature";
import {CssFeature, CssSelector} from "./Features/CssFeature";
import {ColorProcessor} from "./Processors/ColorProcessor";
import {VariableStorage} from "./Storages/VariableStorage";
import {ColorStorage} from "./Storages/ColorStorage";
import {Configuration} from "./Configuration";

export class FileParser {
    parse(filepath) {
        const css = fs.readFileSync(filepath, "utf8");
        const tree = sast.parse(css, {syntax: 'scss'});
        if (tree.type !== 'stylesheet') {
            // error
            throw new Error('Invalid type.');
        }
        for (const item of tree.children) {
            if (item.type === 'ruleset') {
                this.parse_ruleset(item);
            } else if(item.type === 'declaration') { // SCSS variables
                this.parse_declaration(item);
            } else {
                // console.log(item);
            }
        }
    }

    /**
     * A ruleset is a block of CSS statements grouped by a selector
     * @param item
     */
    parse_ruleset(item) {
        const selector = this.parse_selector(item.children[0]); // first child is always selector

        // get block
        const blockObjs = item.children.filter(child => child.type === 'block');
        const properties = this.parse_block(blockObjs[0]);

        for (const prop of properties) {
            if (prop instanceof ColorFeature) {
                const rgba_string = prop.rgba.toString();
                if (!ColorStorage.map.has(rgba_string)) {
                    ColorStorage.map.set(rgba_string, []);
                }
                prop.selector = selector;
                ColorStorage.map.get(rgba_string).push(prop);
            }
        }
    }

    /**
     * Process CSS selector elements
     * @param selector
     */
    parse_selector(selector): CssSelector {
        if (selector.type !== 'selector') {
            throw new Error('parse_selector - Invalid structure...');
        }
        const selectorFragments = [];
        let full_selector = '';
        for (const selectorFragment of selector.children) {
            // keep spaces and >
            if (selectorFragment.type === 'space' || selectorFragment.type === 'combinator') {
                full_selector += selectorFragment.value;
                if (selectorFragment.type === 'combinator') {
                    selectorFragments.push(selectorFragment.value);
                }
                continue;
            }
            let prefix;
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
                default:
                    console.debug('Unknown selector type "' + selectorFragment.type + '"');
                    prefix = '???';
                    break;
            }
            const part = prefix + selectorFragment.children[0].value;
            selectorFragments.push(part);
            full_selector += part;
        }
        return {selector: full_selector, prettified: selectorFragments.join(' ')};
    }

    parse_block(block): CssFeature[] {
        const declarationObjs = block.children.filter(child => child.type === 'declaration');
        const properties = [];
        for (const declaration of declarationObjs) {
            const parsed = this.parse_declaration(declaration);
            if (parsed) {
                properties.push(parsed);
            }
        }
        return properties;
    }

    parse_declaration(declaration): CssFeature {
        const propertyObjs = declaration.children.filter(child => child.type === 'property');
        const valueObjs = declaration.children.filter(child => child.type === 'value');
        const colorProcessor = new ColorProcessor();
        switch (propertyObjs[0].children[0].type) {
            case 'variable':
                const identObjs = propertyObjs[0].children[0].children.filter(child => child.type === 'ident');
                if (colorProcessor.isProcessable('color', valueObjs[0].children[0])) {
                    const color = colorProcessor.process('color', valueObjs[0].children[0]);
                    // Add color to variablemap
                    VariableStorage.map.set(identObjs[0].value, color);
                }
                break;
            case 'ident':
                const property_type = propertyObjs[0].children[0].value;
                if (colorProcessor.isProcessable(property_type, valueObjs[0].children[0])) {
                    return colorProcessor.process(property_type, valueObjs[0].children[0]);
                } else {
                    console.debug('Skipping property of type ' + property_type + '.');
                }
                break;
            default:
                console.debug('Unknown type of first declaration child ' + propertyObjs[0].children[0].type);
                break;
        }
        return null;
    }
}
