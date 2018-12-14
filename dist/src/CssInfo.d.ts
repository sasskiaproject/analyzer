import { ColorFeature } from "./Features/ColorFeature";
export interface CssInfoResult {
    colors: Map<string, ColorFeature[]>;
}
export interface CssInfoConfig {
    appendContentToFeature: boolean;
}
export declare class CssInfo {
    config: CssInfoConfig;
    constructor(config?: CssInfoConfig);
    parseFile(file: any): Promise<CssInfoResult>;
}
