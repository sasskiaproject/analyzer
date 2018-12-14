export interface CssSelector {
    selector: string;
    prettified: string;
}
export declare class CssFeature {
    context: string;
    selector: CssSelector;
    property_type: string;
    original: string;
    original_type: string;
}
