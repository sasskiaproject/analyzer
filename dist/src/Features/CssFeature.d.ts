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
    content: string[];
}
export declare class CssFeature {
    uuid: string;
    context: CssContext;
    selector: CssSelector;
    property_type: string;
    original: string;
    original_type: string;
    line: number;
}
