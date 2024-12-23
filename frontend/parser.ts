import { tokenize, TokenType, Token } from './lexer';
import { Stat, Program, Expr, BinaryExpr, NumericLiteral, Identifier, VarDeclaration, AssignmentExpr } from './ast';
import { exit } from 'process';

// Order of precedence :
// PrimaryExpr > UnaryExpr > MultExpr > AddExpr > comparison > Logical > Functioncall
// > Member > assignment ...

export default class Parser {

    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private eat() {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type : TokenType , err : any) {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.log("Parse Error : ", err);
        }
        return prev;
    }

    public produceAST(sourceCode: string): Program {

        this.tokens = tokenize(sourceCode);        
        const program: Program = {
            kind: "Program",
            body : []
        }

        // Parse till the End of the File
        while (this.not_eof()) {
            program.body.push(this.parse_stat());
        }

        return program;
    }

    private parse_stat(): Stat {
        // skip to parse expression
        switch (this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration()
            default:
                return this.parse_expr();
        }
    }

    // let | const niket ;
    // let | const item = "value";
    private parse_var_declaration(): Stat {
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(TokenType.Identifier, "Expected an Identifier after let | const").value;

        if (this.at().type == TokenType.Semicolon) {
            this.eat();
            if (isConstant) {
                throw "Expected a Value to be assigned to a Constnt expression"
            }
            return {kind : "VarDeclaration",constant : false , identifier} as VarDeclaration;
        }
        
        this.expect(TokenType.Equals, `Expected an Equal sign after ${identifier}`);

        const declration = { kind: "VarDeclaration", identifier,constant: isConstant, value: this.parse_expr()} as VarDeclaration;
        this.expect(TokenType.Semicolon, "Declaration Statement should end with ;");

        return declration;
    }

    private parse_expr(): Expr {
        // return this.parse_primary_expr();
        // assignment has lowest precedence so called first....
        return this.parse_assignment_expr();
    }
    
    private parse_assignment_expr(): Expr {
        const left = this.parse_additive_expr();

        if (this.at().type == TokenType.Equals) {
            this.eat();
            const value = this.parse_additive_expr();
            return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
        }
        return left;
    }

    private parse_additive_expr(): Expr {

        let left = this.parse_multiplicative_expr();

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right =  this.parse_multiplicative_expr();

            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr;
        }
        return left;
    }
    
    private parse_multiplicative_expr(): Expr {

        let left = this.parse_primary_expr();

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();

            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr;
        }
        return left;
    }

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) {
            
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;
            
            // case TokenType.Null:
            //     this.eat()          // Consume the null value
            //     return { kind: "NullLiteral", value: "null" } as NullLiteral;
            
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;
            
            case TokenType.OpenParam:
                this.eat();   // Consume the opening param
                const value = this.parse_expr();
                this.expect(TokenType.CloseParam , "Unexpected token Found : Expected a closed Parenthesis at end >");   // Consume the closing param
                return value;
            
            default:
                console.error("Unexpected token found during parsing", this.at());
                exit(1);
                return {} as Stat;
        }
    }
}