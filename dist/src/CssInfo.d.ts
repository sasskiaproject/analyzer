import { ColorFeature } from "./Features/ColorFeature";
export interface CssInfoResult {
    colors: Map<string, ColorFeature[]>;
}
export declare class CssInfo {
    parseFile(file: any): Promise<CssInfoResult>;
}
