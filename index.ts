import * as path from 'path';
import {FileParser} from "./FileParser";
import {ColorStorage} from "./Storages/ColorStorage";

//console.debug = () => {};

class CssInfo {
    parseFile() {
        new FileParser().parse(path.join('test', 'test2.scss'));
    }
    displayResults() {
        console.log(ColorStorage.map.size + ' Farben gefunden:');
        // ColorStorage.map.forEach((value, key) => {
        //     console.log(key + ' -> ' + value.length);
        // });
        ColorStorage.map.forEach((value, key) => {
            console.log('= Farbe ' + key + ' =');
            for (let color of value) {
                console.log(color.selector.prettified + ' { ' + color.property_type + ': ' + color.original + ' }');
            }
        });
    }
}

const info = new CssInfo();
info.parseFile();
info.displayResults();
