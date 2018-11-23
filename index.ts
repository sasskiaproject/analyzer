import * as path from 'path';
import {FileParser} from "./FileParser";
import {ColorStorage} from "./Storages/ColorStorage";

console.debug = () => {};

class CssInfo {
    displayResults() {
        console.log(ColorStorage.map.size + ' Farben gefunden:');
        // ColorStorage.map.forEach((value, key) => {
        //     console.log(key + ' -> ' + value.length);
        // });
        ColorStorage.map.forEach((value, key) => {
            console.log('= Farbe ' + key + ' =');
            for (let color of value) {
                console.log(color.context + ' - ' + color.selector.prettified + ' { ' + color.property_type + ': ' + color.original + ' }');
            }
        });
    }
}

const info = new CssInfo();
new FileParser().parse(path.join('test', 'test.scss'))
    .then(() => info.displayResults())
    .catch((error) => console.error('Error: ', error));
