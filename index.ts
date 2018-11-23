import * as path from 'path';
import {FileParser} from "./FileParser";
import {ColorStorage} from "./Storages/ColorStorage";

console.debug = () => {};

class CssInfo {
    parseFile() {
        new FileParser().parse(path.join('test', 'test.scss'));
    }
    displayResults() {
        console.log(ColorStorage.map.size + ' Farben gefunden:');
        ColorStorage.map.forEach((value, key) => {
            console.log(key + ' -> ' + value.length);
        });
    }
}

const info = new CssInfo();
info.parseFile();
info.displayResults();
