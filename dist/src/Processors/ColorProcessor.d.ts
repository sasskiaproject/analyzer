import { ColorFeature } from "../Features/ColorFeature";
import { AbstractProcessor } from "./AbstractProcessor";
export declare class ColorProcessor extends AbstractProcessor {
    isProcessable(property_type: string, object: any): boolean;
    extract_border_colors(valueObj: any): any;
    process(property_type: any, valueObj: any): ColorFeature;
}
