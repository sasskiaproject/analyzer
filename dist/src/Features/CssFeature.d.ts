export declare class CssSelector {
    selector: string;
    prettified: string;
    constructor(selectorFragments: any);
}
export interface CssContext {
    file: string;
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
}
export declare class CssFeature {
    context: CssContext;
    selector: CssSelector;
    property_type: string;
    original: string;
    original_type: string;
}
