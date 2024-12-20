"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Environment = /** @class */ (function () {
    function Environment(parENV) {
        this.parent = parENV;
        this.variables = new Map();
    }
    // Variable declaration
    Environment.prototype.declareVar = function (varname, value) {
        if (this.variables.has(varname)) {
            throw "Cannot declare variable ".concat(varname, " as it is already defined :");
        }
        this.variables.set(varname, value);
        return value;
    };
    // Variable assignment
    Environment.prototype.assignVar = function (varname, value) {
        var env = this.resolve(varname);
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
