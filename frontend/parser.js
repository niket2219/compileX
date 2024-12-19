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
        return this.parse_expr();
    };
    Parser.prototype.parse_expr = function () {
        // return this.parse_primary_expr();
        return this.parse_additive_expr();
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
            case lexer_1.TokenType.Null:
                this.eat(); // Consume the null value
                return { kind: "NullLiteral", value: "null" };
            case lexer_1.TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value };
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
