import { tokenize, TokenType, Token } from './lexer';
import { Stat, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral } from './ast';
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
        return this.parse_expr();
    }

    private parse_expr(): Expr {
        // return this.parse_primary_expr();
        return this.parse_additive_expr();
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
            
            case TokenType.Null:
                this.eat()          // Consume the null value
                return { kind: "NullLiteral", value: "null" } as NullLiteral;
            
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