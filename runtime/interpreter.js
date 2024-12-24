"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = evaluate;
var process_1 = require("process");
var expressions_1 = require("./eval/expressions");
var statements_1 = require("./eval/statements");
function evaluate(astNode, env) {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { type: "number", value: (astNode.value) };
        case "Identifier":
            return (0, expressions_1.eval_identifier)(astNode, env);
        case "BinaryExpr":
            return (0, expressions_1.evaluate_binary_expr)(astNode, env);
        case "Program":
            return (0, statements_1.eval_program)(astNode, env);
        case "VarDeclaration":
            return (0, statements_1.eval_var_declaration)(astNode, env);
        case "AssignmentExpr":
            return (0, expressions_1.eval_assignment_expr)(astNode, env);
        default:
            console.log("This AST Node can't be interpreted: ", astNode);
            (0, process_1.exit)();
    }
}
