import { ColorFeature } from "../Features/ColorFeature";
import { AbstractProcessor } from "./AbstractProcessor";
import { CssSelector } from "../Features/CssFeature";
export declare class ColorProcessor extends AbstractProcessor<ColorFeature> {
    isProcessable(property_type: string, object: any): boolean;
    extract_border_colors(valueObj: any): any;
    newFeature(): ColorFeature;
    process(property_type: any, valueObj: any, selector: CssSelector): ColorFeature;
}
