import {CssFeature} from "./CssFeature";

export class RGBColor {
    r: number;
    g: number;
    b: number;
    a: number;
    public toString(): string {
        return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
    }
}

export class ColorFeature extends CssFeature {
    public rgba: RGBColor = new RGBColor();
}
