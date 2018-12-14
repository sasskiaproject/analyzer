export class CssSelector {
    selector: string;
    prettified: string;
    constructor(selectorFragments) {
        this.selector = selectorFragments.join('');
        this.prettified = selectorFragments.filter(x => x !== ' ').join(' ');
    }
}

export interface CssContext {
    file: string;
    start: {line: number; column: number};
    end: {line: number; column: number};
}

export class CssFeature {
    public context: CssContext;
    public selector: CssSelector;
    public property_type: string;
    public original: string;
    public original_type: string;
}
