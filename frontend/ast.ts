// Defining the types of Nodes

export type NodeType =
    // Statemnets
    "Program" | "VarDeclaration" |
    // Expressions
    "AssignmentExpr" | "NumericLiteral" | "Identifier" | "BinaryExpr" | "Property" | "ObjectLiteral"

export interface Stat {
    kind: NodeType;
}

export interface Program extends Stat {
    kind: "Program",
    body : Stat[]
}

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr",
    assigne: Expr,       // it is an expr because object.key = value can also be handled
    value : Expr
}

export interface VarDeclaration extends Stat {
    kind: "VarDeclaration",
    constant: boolean,
    identifier: string,
    value? : Expr
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

export interface Property extends Expr{
    kind: "Property";
    key: string,
    value? : Expr
}

export interface ObjectLiteral extends Expr{
    kind: "ObjectLiteral";
    properties : Property[]
}

// export interface NullLiteral extends Expr{
//     kind: "NullLiteral";
//     value : "null"
// }