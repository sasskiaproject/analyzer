import {ColorStorage} from "./Storages/ColorStorage";
import {FileParser} from "./FileParser";
import {ColorFeature} from "./Features/ColorFeature";

export interface CssInfoResult {
    colors: Map<string, ColorFeature[]>
}

export interface CssInfoConfig {
    appendContentToFeature: boolean;
}

export class CssInfo {
    config: CssInfoConfig = {
        appendContentToFeature: false
    };
    constructor(config: CssInfoConfig = null) {
        if (config) {
            this.config = config;
        }
    }
    parseFile(file): Promise<CssInfoResult> {
        return new Promise<CssInfoResult>((resolve, reject) => {
            new FileParser(this.config).parse(file)
                .then(() => resolve({
                    colors: ColorStorage.map
                }))
                .catch((error) => reject(error))
        });
    }
}
