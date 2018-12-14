import { CssFeature } from "./CssFeature";
export declare class RGBColor {
    r: number;
    g: number;
    b: number;
    a: number;
    toString(): string;
}
export declare class ColorFeature extends CssFeature {
    rgba: RGBColor;
}
