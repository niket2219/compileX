"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var process_1 = require("process");
// Order of precedence :
// PrimaryExpr > UnaryExpr > MultExpr > AddExpr > comparison > Logical > Functioncall
// > Member > assignment ...
var Parser = /** @class */ (function () {
    function Parser() {
        this.tokens = [];
    }
    Parser.prototype.not_eof = function () {
        return this.tokens[0].type != lexer_1.TokenType.EOF;
    };
    Parser.prototype.at = function () {
        return this.tokens[0];
    };
    Parser.prototype.eat = function () {
        var prev = this.tokens.shift();
        return prev;
    };
    Parser.prototype.expect = function (type, err) {
        var prev = this.tokens.shift();
        if (!prev || prev.type != type) {
            console.log("Parse Error : ", err);
        }
        return prev;
    };
    Parser.prototype.produceAST = function (sourceCode) {
        this.tokens = (0, lexer_1.tokenize)(sourceCode);
        var program = {
            kind: "Program",
            body: []
        };
        // Parse till the End of the File
        while (this.not_eof()) {
            program.body.push(this.parse_stat());
        }
        return program;
    };
    Parser.prototype.parse_stat = function () {
        // skip to parse expression
        switch (this.at().type) {
            case lexer_1.TokenType.Let:
            case lexer_1.TokenType.Const:
                return this.parse_var_declaration();
            default:
                return this.parse_expr();
        }
    };
    // let | const niket ;
    // let | const item = "value";
    Parser.prototype.parse_var_declaration = function () {
        var isConstant = this.eat().type == lexer_1.TokenType.Const;
        var identifier = this.expect(lexer_1.TokenType.Identifier, "Expected an Identifier after let | const").value;
        if (this.at().type == lexer_1.TokenType.Semicolon) {
            this.eat();
            if (isConstant) {
                throw "Expected a Value to be assigned to a Constnt expression";
            }
            return { kind: "VarDeclaration", constant: false, identifier: identifier };
        }
        this.expect(lexer_1.TokenType.Equals, "Expected an Equal sign after ".concat(identifier));
        var declration = { kind: "VarDeclaration", identifier: identifier, constant: isConstant, value: this.parse_expr() };
        this.expect(lexer_1.TokenType.Semicolon, "Declaration Statement should end with ;");
        return declration;
    };
    Parser.prototype.parse_expr = function () {
        // return this.parse_primary_expr();
        // assignment has lowest precedence so called first....
        return this.parse_assignment_expr();
    };
    Parser.prototype.parse_assignment_expr = function () {
        var left = this.parse_additive_expr();
        if (this.at().type == lexer_1.TokenType.Equals) {
            this.eat();
            var value = this.parse_additive_expr();
            return { value: value, assigne: left, kind: "AssignmentExpr" };
        }
        return left;
    };
    Parser.prototype.parse_additive_expr = function () {
        var left = this.parse_multiplicative_expr();
        while (this.at().value == "+" || this.at().value == "-") {
            var operator = this.eat().value;
            var right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_multiplicative_expr = function () {
        var left = this.parse_primary_expr();
        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            var operator = this.eat().value;
            var right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_primary_expr = function () {
        var tk = this.at().type;
        switch (tk) {
            case lexer_1.TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value };
            // case TokenType.Null:
            //     this.eat()          // Consume the null value
            //     return { kind: "NullLiteral", value: "null" } as NullLiteral;
            case lexer_1.TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) };
            case lexer_1.TokenType.OpenParam:
                this.eat(); // Consume the opening param
                var value = this.parse_expr();
                this.expect(lexer_1.TokenType.CloseParam, "Unexpected token Found : Expected a closed Parenthesis at end >"); // Consume the closing param
                return value;
            default:
                console.error("Unexpected token found during parsing", this.at());
                (0, process_1.exit)(1);
                return {};
        }
    };
    return Parser;
}());
exports.default = Parser;
