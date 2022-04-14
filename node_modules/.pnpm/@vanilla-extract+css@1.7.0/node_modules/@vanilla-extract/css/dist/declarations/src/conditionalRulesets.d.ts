interface Rule {
    selector: string;
    rule: any;
}
declare type Condition = {
    query: string;
    rules: Array<Rule>;
    children: ConditionalRuleset;
};
export declare class ConditionalRuleset {
    ruleset: Array<Condition>;
    /**
     * Stores information about where conditions must in relation to other conditions
     *
     * e.g. mobile -> tablet, desktop
     */
    precedenceLookup: Map<string, Set<String>>;
    constructor();
    findOrCreateCondition(conditionQuery: string): Condition;
    getConditionalRulesetByPath(conditionPath: Array<string>): ConditionalRuleset;
    addRule(rule: Rule, conditionQuery: string, conditionPath: Array<string>): void;
    addConditionPrecedence(conditionPath: Array<string>, conditionOrder: Array<string>): void;
    isCompatible(incomingRuleset: ConditionalRuleset): boolean;
    merge(incomingRuleset: ConditionalRuleset): void;
    /**
     * Merge another ConditionalRuleset into this one if they are compatible
     *
     * @returns true if successful, false if the ruleset is incompatible
     */
    mergeIfCompatible(incomingRuleset: ConditionalRuleset): boolean;
    sort(): void;
    renderToArray(): any;
}
export {};
