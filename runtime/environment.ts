import { RuntimeVal } from "./values";

export default class Environment{

    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor(parENV? : Environment) {
        this.parent = parENV;
        this.variables = new Map();
        this.constants = new Set();
    }

    // Variable declaration
    public declareVar(varname: string, value: RuntimeVal , constant : boolean): RuntimeVal {
        if (this.variables.has(varname)) {
            throw `Cannot declare variable ${varname} as it is already defined :`
        }

        this.variables.set(varname, value);
        if (constant) {
            this.constants.add(varname);
        }
        return value;
    }

    // Variable assignment
    public assignVar(varname: string, value: RuntimeVal) {
        const env = this.resolve(varname);

        if (env.constants.has(varname)) {
            throw "Cannot assign a value to a constant identifier :"
        }

        env.variables.set(varname, value);
        return value;
    }

    // Return LookUp value of variables
    public lookupVar(varname: string): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }

    // Scope Resolution

    public resolve(varname: string): Environment {
        if (this.variables.has(varname)) {
            return this;
        }
        if (this.parent == undefined) {
            throw `Cannot resolve variable : ${varname} as it is undefined`
        }
        return this.parent.resolve(varname);
    }
}