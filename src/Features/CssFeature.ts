export interface CssSelector { selector: string; prettified: string }

export class CssFeature {
    public context: string;
    public selector: CssSelector;
    public property_type: string;
    public original: string;
    public original_type: string;
}
