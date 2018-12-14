import { CssFeature } from "../Features/CssFeature";
export declare abstract class AbstractProcessor {
    abstract isProcessable(property_type: any, object: any): any;
    abstract process(property_type: any, object: any): CssFeature;
}
