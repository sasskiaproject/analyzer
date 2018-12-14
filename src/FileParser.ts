import * as sast from 'sast';
import {ColorFeature} from "./Features/ColorFeature";
import {CssFeature, CssSelector} from "./Features/CssFeature";
import {ColorProcessor} from "./Processors/ColorProcessor";
import {VariableStorage} from "./Storages/VariableStorage";
import {ColorStorage} from "./Storages/ColorStorage";
import {CssInfoConfig} from "./CssInfo";
import * as fs from "fs";

export class FileParser {
    protected config: CssInfoConfig;
    protected filePath: string;
    protected fileContent: string[] = null;

    constructor(config) {
        this.config = config;
    }

    parse(filepath): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.filePath = filepath;
            if (this.config.appendContentToFeature) {
                // Load file contents
                this.fileContent = fs.readFileSync(filepath, 'utf8').split("\n");
            }

            sast.parseFile(filepath)
                .then((tree) => {
                    if (tree.type !== 'stylesheet') {
                        // error
                        throw new Error('Invalid type.');
                    }
                    for (const item of tree.children) {
                        if (item.type === 'ruleset') {
                            this.parse_ruleset(item);
                        } else if(item.type === 'declaration') { // SCSS variables
                            this.parse_variable_declaration(item);
                        } else {
                            console.debug(item);
                        }
                    }
                    resolve();
                })
                .catch((error) => reject(error));
        })
    }

    /**
     * A ruleset is a block of CSS statements grouped by a selector
     * @param item
     * @param parentSelector
     */
    parse_ruleset(item, parentSelector: CssSelector = null) {
        let selector = this.parse_selector(item.children[0]); // first child is always selector
        if (parentSelector) {
            selector.selector = parentSelector.selector + ' ' + selector.selector;
            selector.prettified = parentSelector.prettified + ' ' + selector.prettified;
            // remove spaces and parentSelector
            selector.prettified = selector.prettified.replace(' & ', '');
        }

        // get block
        const blockObjs = item.children.filter(child => child.type === 'block');
        const properties = this.parse_block(blockObjs[0], selector);

        for (const prop of properties) {
            prop.context = { file: this.filePath, start: item.position.start, end: item.position.end, content: null};
            if (this.config.appendContentToFeature) {
                if (this.fileContent.length >= item.position.start.line && this.fileContent.length >= item.position.end.line) {
                    prop.context.content = this.fileContent.filter((value, index) => index+1 >= item.position.start.line && index+1 <= item.position.end.line).join("\n");
                }
            }
            if (prop instanceof ColorFeature) {
                const rgba_string = prop.rgba.toString();
                if (!ColorStorage.map.has(rgba_string)) {
                    ColorStorage.map.set(rgba_string, []);
                }
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
        for (const selectorFragment of selector.children) {
            // keep spaces and >
            if (selectorFragment.type === 'space' || selectorFragment.type === 'combinator') {
                selectorFragments.push(selectorFragment.value);
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
                case 'parentSelector': // &
                    selectorFragments.push('&');
                    continue;
                case 'pseudoClass':
                    const identObjs = selectorFragment.children.filter(child => child.type === 'ident');
                    selectorFragments.push(':' + identObjs[0].value);
                    continue;
                default:
                    console.debug('Unknown selector type "' + selectorFragment.type + '"');
                    prefix = '???';
                    break;
            }
            const part = prefix + selectorFragment.children[0].value;
            selectorFragments.push(part);
        }
        return new CssSelector(selectorFragments);
    }

    parse_block(block, selector: CssSelector): CssFeature[] {
        const rulesetObjs = block.children.filter(child => child.type === 'ruleset');
        for (const ruleset of rulesetObjs) {
            this.parse_ruleset(ruleset, selector);
        }

        const declarationObjs = block.children.filter(child => child.type === 'declaration');
        const properties = [];
        for (const declaration of declarationObjs) {
            const parsed = this.parse_declaration(declaration, selector);
            if (parsed) {
                properties.push(parsed);
            }
        }
        return properties;
    }

    parse_variable_declaration(declaration) {
        const propertyObjs = declaration.children.filter(child => child.type === 'property');
        const valueObjs = declaration.children.filter(child => child.type === 'value');
        const colorProcessor = new ColorProcessor();
        if (propertyObjs[0].children[0].type !== 'variable') {
            return null;
        }
        const identObjs = propertyObjs[0].children[0].children.filter(child => child.type === 'ident');
        if (colorProcessor.isProcessable('color', valueObjs)) {
            const color = colorProcessor.process('color', valueObjs, null);
            // Add color to variablemap
            VariableStorage.map.set(identObjs[0].value, color);
        }
    }

    parse_declaration(declaration, selector: CssSelector): CssFeature {
        const propertyObjs = declaration.children.filter(child => child.type === 'property');
        const valueObjs = declaration.children.filter(child => child.type === 'value');
        const colorProcessor = new ColorProcessor();
        switch (propertyObjs[0].children[0].type) {
            case 'ident':
                const property_type = propertyObjs[0].children[0].value;
                console.debug('Parsing declaration of type ident – property_type=' + property_type);
                if (colorProcessor.isProcessable(property_type, valueObjs)) {
                    return colorProcessor.process(property_type, valueObjs, selector);
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
