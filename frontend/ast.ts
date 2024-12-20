// Defining the types of Nodes

export type NodeType = "Program" | "NumericLiteral" | "Identifier" | "BinaryExpr";

export interface Stat {
    kind: NodeType;
}

export interface Program extends Stat {
    kind: "Program",
    body : Stat[]
}

export interface Expr extends Stat { }

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr"
    left: Expr;
    right: Expr;
    operator: string;
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expr{
    kind: "NumericLiteral";
    value : Number
}

// export interface NullLiteral extends Expr{
//     kind: "NullLiteral";
//     value : "null"
// }