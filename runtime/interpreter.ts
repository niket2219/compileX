import { ValueType, RuntimeVal, NumberVal, NullVal, MK_NULL } from "./values";
import { BinaryExpr, Identifier, NodeType, NumericLiteral, Program, Stat } from '../frontend/ast'
import { exit } from "process";
import Environment from "./environment";

function eval_program(program: Program , env : Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = { type: "null", value: null } as NullVal;

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement,env);
    }

    return lastEvaluated;
}

function evaluate_binary_expr(binop: BinaryExpr , env : Environment): RuntimeVal {
    const lhs = evaluate(binop.left , env);
    const rhs = evaluate(binop.right ,env);

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal,binop.operator);
    }
    return { type: "null", value: null } as NullVal;
}

function eval_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
    let result = 0;

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

    return { value: result, type: "number" } as NumberVal;
}

function eval_identifier(ident: Identifier , env : Environment): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function evaluate(astNode: Stat , env : Environment): RuntimeVal {
    
    switch (astNode.kind) {
        case "NumericLiteral":
            return { type: "number", value: ((astNode as NumericLiteral).value) } as NumberVal;
        
        case "Identifier":
            return eval_identifier(astNode as Identifier, env);
        
        case "BinaryExpr":
            return evaluate_binary_expr(astNode as BinaryExpr , env);
        
        case "Program":
            return eval_program(astNode as Program , env);
        
        default:
            console.log("This AST Node can't be interpreted: ", astNode)
            exit();
    }
}