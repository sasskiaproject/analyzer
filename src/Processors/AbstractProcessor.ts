import {CssFeature, CssSelector} from "../Features/CssFeature";

export abstract class AbstractProcessor<T extends CssFeature> {
    abstract newFeature(): T;
    abstract isProcessable(property_type, object);

    process(property_type, object, selector: CssSelector): T {
        const feature = this.newFeature();
        feature.selector = selector;
        feature.property_type = property_type;
        return feature;
    }
}
