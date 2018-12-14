import {CssFeature} from "../Features/CssFeature";

export abstract class AbstractProcessor {
    abstract isProcessable(property_type, object);
    abstract process(property_type, object): CssFeature;
}
