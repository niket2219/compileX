import { ValueType, RuntimeVal, NumberVal, NullVal } from "./values";
import { BinaryExpr, NodeType, NullLiteral, NumericLiteral, Program, Stat } from '../frontend/ast'
import { exit } from "process";

function eval_program(program: Program): RuntimeVal {
    let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement);
    }

    return lastEvaluated;
}
function evaluate_binary_expr(binop: BinaryExpr): RuntimeVal {
    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal,binop.operator);
    }
    return { type: "null", value: "null" } as NullVal;
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
export function evaluate(astNode: Stat): RuntimeVal {
    
    switch (astNode.kind) {
        case "NumericLiteral":
            return { type: "number", value: ((astNode as NumericLiteral).value) } as NumberVal;
        
        case "NullLiteral":
            return { type: "null", value: "null" } as NullVal;
        
        case "BinaryExpr":
            return evaluate_binary_expr(astNode as BinaryExpr);
        
        case "Program":
            return eval_program(astNode as Program);
        
        default:
            console.log("This AST Node can't be interpreted: ", astNode)
            exit();
    }
}