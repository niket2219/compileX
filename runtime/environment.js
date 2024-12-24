"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var values_1 = require("./values");
function setupScope(env) {
    env.declareVar("x", (0, values_1.MK_NUMBER)(21), true);
    env.declareVar("true", (0, values_1.MK_BOOL)(true), true);
    env.declareVar("false", (0, values_1.MK_BOOL)(false), true);
    env.declareVar("null", (0, values_1.MK_NULL)(), true);
}
var Environment = /** @class */ (function () {
    function Environment(parENV) {
        var global = parENV ? true : false;
        this.parent = parENV;
        this.variables = new Map();
        this.constants = new Set();
        if (global) {
            setupScope(this);
        }
    }
    // Variable declaration
    Environment.prototype.declareVar = function (varname, value, constant) {
        if (this.variables.has(varname)) {
            throw "Cannot declare variable ".concat(varname, " as it is already defined :");
        }
        this.variables.set(varname, value);
        if (constant) {
            this.constants.add(varname);
        }
        return value;
    };
    // Variable assignment
    Environment.prototype.assignVar = function (varname, value) {
        var env = this.resolve(varname);
        if (env.constants.has(varname)) {
            throw "Cannot assign a value to a constant identifier :";
        }
        env.variables.set(varname, value);
        return value;
    };
    // Return LookUp value of variables
    Environment.prototype.lookupVar = function (varname) {
        var env = this.resolve(varname);
        return env.variables.get(varname);
    };
    // Scope Resolution
    Environment.prototype.resolve = function (varname) {
        if (this.variables.has(varname)) {
            return this;
        }
        if (this.parent == undefined) {
            throw "Cannot resolve variable : ".concat(varname, " as it is undefined");
        }
        return this.parent.resolve(varname);
    };
    return Environment;
}());
exports.default = Environment;
