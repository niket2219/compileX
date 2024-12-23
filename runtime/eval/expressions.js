"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate_binary_expr = evaluate_binary_expr;
exports.eval_numeric_binary_expr = eval_numeric_binary_expr;
exports.eval_identifier = eval_identifier;
exports.eval_assignment_expr = eval_assignment_expr;
var interpreter_1 = require("../interpreter");
function evaluate_binary_expr(binop, env) {
    var lhs = (0, interpreter_1.evaluate)(binop.left, env);
    var rhs = (0, interpreter_1.evaluate)(binop.right, env);
    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs, rhs, binop.operator);
    }
    return { type: "null", value: null };
}
function eval_numeric_binary_expr(lhs, rhs, operator) {
    var result = 0;
    if (operator == "+") {
        result = lhs.value + rhs.value;
    }
    else if (operator == "-") {
        result = lhs.value - rhs.value;
    }
    else if (operator == "*") {
        result = lhs.value * rhs.value;
    }
    else if (operator == "/") {
        result = lhs.value / rhs.value;
    }
    else {
        result = lhs.value % rhs.value;
    }
    return { value: result, type: "number" };
}
function eval_identifier(ident, env) {
    var val = env.lookupVar(ident.symbol);
    return val;
}
function eval_assignment_expr(node, env) {
    if (node.assigne.kind != "Identifier") {
        throw "Cannot assign value to an object like ".concat(JSON.stringify(node.assigne));
    }
    var varname = node.assigne.symbol;
    return env.assignVar(varname, (0, interpreter_1.evaluate)(node.value, env));
}
