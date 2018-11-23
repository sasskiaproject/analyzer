import * as toHex from 'colornames';
import * as hexRgb from 'hex-rgb';
import {ColorFeature} from "../Features/ColorFeature";
import {AbstractProcessor} from "./AbstractProcessor";
import {VariableStorage} from "../Storages/VariableStorage";
import {Configuration} from "../Configuration";

export class ColorProcessor extends AbstractProcessor {
    isProcessable(property_type: string, object): boolean {
        return /color/.test(property_type) || property_type === 'border';
    }

    extract_border_colors(valueObj) {
        const colorObjs = valueObj[0].children.filter(x => ['color', 'function', 'variable', 'ident'].indexOf(x.type) !== -1);
        // ident can also be a non-color like "solid" – check if it is a valid color
        const removeNonColors = colorObjs.filter(x => x.type !== 'ident' || toHex(x.value) );
        return removeNonColors[0]; // todo: check if looping over all entries makes sense
    }

    process(property_type, valueObj): ColorFeature {
        let color = new ColorFeature();
        let rgb;

        let valueObject = valueObj[0].children[0]; // todo: check if looping over all entries makes sense
        if (property_type === 'border') {
            valueObject = this.extract_border_colors(valueObj);
            if (!valueObject) {
                return null;
            }
        }

        switch (valueObject.type) {
            case 'ident': // basic string, e.g. black
                color.original = valueObject.value;
                color.original_type = 'name';
                rgb = hexRgb(toHex(valueObject.value));
                color.rgba.r = rgb.red;
                color.rgba.g = rgb.green;
                color.rgba.b = rgb.blue;
                color.rgba.a = rgb.alpha / 255;
                break;
            case 'variable': // SCSS variable, e.g. $black
                if (Configuration.skip_variables) {
                    return null;
                }
                const variable_name = valueObject.children[0].value;
                if (!VariableStorage.map.has(variable_name)) {
                    throw new Error('Missing variable ' + variable_name + '!');
                }
                color = Object.assign( color, VariableStorage.map.get(variable_name) );
                color.original = '$' + variable_name;
                color.original_type = 'variable';
                // todo: deal with variables
                break;
            case 'color': // HEX color, e.g. #000 or #000000
                color.original = '#' + valueObject.value;
                color.original_type = 'hex';
                rgb = hexRgb(valueObject.value);
                color.rgba.r = rgb.red;
                color.rgba.g = rgb.green;
                color.rgba.b = rgb.blue;
                color.rgba.a = rgb.alpha / 255;
                break;
            case 'function': // RGB color, e.g. rgb(10, 10, 10) or rgba(10, 10, 10, 0.1)
                const function_name = valueObject.children[0].value;
                const function_args = valueObject.children[1].children;
                if (function_name === 'rgb' || function_name === 'rgba') {
                    const numbers = function_args.filter(color => color.type === 'number').map(x => Number(x.value));
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
        color.property_type = property_type;
        return color;
    }
}
