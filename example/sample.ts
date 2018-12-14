import {CssInfo} from "../src";

console.debug = () => {};
const info = new CssInfo({
    appendContentToFeature: true
});
info.parseFile('test.scss')
    .then((result) => {
        console.log(result.colors.size + ' Farben gefunden:');
        result.colors.forEach((value, key) => {
            console.log('= Farbe ' + key + ' =');
            for (let color of value) {
                console.log(color.context.file + ':' + color.line + ' - ' + color.selector.prettified + ' { ' + color.property_type + ': ' + color.original + ' }');
            }
        });
    })
    .catch((error) => console.error('Error: ', error));
