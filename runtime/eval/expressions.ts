import { AssignmentExpr, BinaryExpr, Identifier } from "../../frontend/ast";
import Environment from "../environment";
import { evaluate } from "../interpreter";
import { RuntimeVal, NumberVal, NullVal } from "../values";

export function evaluate_binary_expr(binop: BinaryExpr , env : Environment): RuntimeVal {
    const lhs = evaluate(binop.left , env);
    const rhs = evaluate(binop.right ,env);

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal,binop.operator);
    }
    return { type: "null", value: null } as NullVal;
}

export function eval_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
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

export function eval_identifier(ident: Identifier , env : Environment): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function eval_assignment_expr(node: AssignmentExpr, env: Environment) : RuntimeVal {
    if (node.assigne.kind != "Identifier") {
        throw `Cannot assign value to an object like ${JSON.stringify(node.assigne)}`
    }
    const varname = (node.assigne as Identifier).symbol;
    return env.assignVar(varname, evaluate(node.value, env));
}