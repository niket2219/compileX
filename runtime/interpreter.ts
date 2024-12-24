import { ValueType, RuntimeVal, NumberVal, NullVal, MK_NULL } from "./values";
import { AssignmentExpr, BinaryExpr, Identifier, NodeType, NumericLiteral, Program, Stat, VarDeclaration } from '../frontend/ast'
import { exit } from "process";
import Environment from "./environment";
import { eval_assignment_expr, eval_identifier, evaluate_binary_expr } from "./eval/expressions";
import { eval_program, eval_var_declaration } from "./eval/statements";

export function evaluate(astNode: Stat , env : Environment): RuntimeVal {
    
    switch (astNode.kind) {
        case "NumericLiteral":
            return { type: "number", value: ((astNode as NumericLiteral).value) } as NumberVal;
        
        case "Identifier":
            return eval_identifier(astNode as Identifier, env);
        
        case "BinaryExpr":
            return evaluate_binary_expr(astNode as BinaryExpr , env);
        
        case "Program":
            return eval_program(astNode as Program, env);
        
        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration, env);
        
        case "AssignmentExpr":
            return eval_assignment_expr(astNode as AssignmentExpr, env);
        
        default:
            console.log("This AST Node can't be interpreted: ", astNode)
            exit();
    }
}


