import { CssFeature, CssSelector } from "../Features/CssFeature";
export declare abstract class AbstractProcessor<T extends CssFeature> {
    abstract newFeature(): T;
    abstract isProcessable(property_type: any, object: any): any;
    process(property_type: any, object: any, selector: CssSelector): T;
}
