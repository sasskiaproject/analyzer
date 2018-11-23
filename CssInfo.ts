import {ColorStorage} from "./Storages/ColorStorage";
import {FileParser} from "./FileParser";
import {ColorFeature} from "./Features/ColorFeature";

export interface CssInfoResult {
    colors: Map<string, ColorFeature[]>
}

export class CssInfo {
    parseFile(file): Promise<CssInfoResult> {
        return new Promise<CssInfoResult>((resolve, reject) => {
            new FileParser().parse(file)
                .then(() => resolve({
                    colors: ColorStorage.map
                }))
                .catch((error) => reject(error))
        });
    }
}
