import { CssFeature, CssSelector } from "./Features/CssFeature";
import { CssInfoConfig } from "./CssInfo";
export declare class FileParser {
    protected config: CssInfoConfig;
    protected filePath: string;
    protected fileContent: string[];
    constructor(config: any);
    parse(filepath: any): Promise<void>;
    /**
     * A ruleset is a block of CSS statements grouped by a selector
     * @param item
     * @param parentSelector
     */
    parse_ruleset(item: any, parentSelector?: CssSelector): void;
    /**
     * Process CSS selector elements
     * @param selector
     */
    parse_selector(selector: any): CssSelector;
    parse_block(block: any, selector: CssSelector): CssFeature[];
    parse_variable_declaration(declaration: any): any;
    parse_declaration(declaration: any, selector: CssSelector): CssFeature;
}
