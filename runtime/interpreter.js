"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = evaluate;
var process_1 = require("process");
function eval_program(program, env) {
    var lastEvaluated = { type: "null", value: null };
    for (var _i = 0, _a = program.body; _i < _a.length; _i++) {
        var statement = _a[_i];
        lastEvaluated = evaluate(statement, env);
    }
    return lastEvaluated;
}
function evaluate_binary_expr(binop, env) {
    var lhs = evaluate(binop.left, env);
    var rhs = evaluate(binop.right, env);
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
function evaluate(astNode, env) {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { type: "number", value: (astNode.value) };
        case "Identifier":
            return eval_identifier(astNode, env);
        case "BinaryExpr":
            return evaluate_binary_expr(astNode, env);
        case "Program":
            return eval_program(astNode, env);
        default:
            console.log("This AST Node can't be interpreted: ", astNode);
            (0, process_1.exit)();
    }
}
