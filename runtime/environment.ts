import { MK_BOOL, MK_NULL, MK_NUMBER, RuntimeVal } from "./values";

function setupScope(env: Environment) {
    env.declareVar("x" , MK_NUMBER(21),true)
    env.declareVar("true" , MK_BOOL(true),true)
    env.declareVar("false" , MK_BOOL(false),true)
    env.declareVar("null" , MK_NULL(),true)
}

export default class Environment{

    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor(parENV?: Environment) {
        const global = parENV ? true : false;
        this.parent = parENV;
        this.variables = new Map();
        this.constants = new Set();

        if (global) {
            setupScope(this);
        }
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