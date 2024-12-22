"use strict";
// let x = 45 + (23 * 89)
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
exports.tokenize = tokenize;
var fs = require('fs');
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["Equals"] = 2] = "Equals";
    TokenType[TokenType["OpenParam"] = 3] = "OpenParam";
    TokenType[TokenType["CloseParam"] = 4] = "CloseParam";
    TokenType[TokenType["BinaryOperator"] = 5] = "BinaryOperator";
    TokenType[TokenType["Let"] = 6] = "Let";
    TokenType[TokenType["Const"] = 7] = "Const";
    TokenType[TokenType["Semicolon"] = 8] = "Semicolon";
    TokenType[TokenType["EOF"] = 9] = "EOF";
})(TokenType || (exports.TokenType = TokenType = {}));
var KEYWORDS = {
    let: TokenType.Let,
    const: TokenType.Const
};
function isalpha(src) {
    return src.toUpperCase() != src.toLowerCase();
}
function isint(src) {
    var c = src.charCodeAt(0);
    var bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}
function isskippable(src) {
    return src == " " || src == "\n" || src == "\t";
}
function token(value, type) {
    if (value === void 0) { value = ""; }
    return { value: value, type: type };
}
function tokenize(sourceCode) {
    var tokens = new Array();
    var src = sourceCode.split("");
    // Build each Token until the end of the file
    while (src.length > 0) {
        if (src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParam));
        }
        else if (src[0] == ')') {
            tokens.push(token(src.shift(), TokenType.CloseParam));
        }
        else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == '%') {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        else if (src[0] == '=') {
            tokens.push(token(src.shift(), TokenType.Equals));
        }
        else if (src[0] == ";") {
            tokens.push(token(src.shift(), TokenType.Semicolon));
        }
        else {
            // Building MultiCharacters tokens
            if (isint(src[0])) {
                var num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            }
            else if (isalpha(src[0])) {
                var ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }
                // check if identifier is a reserved keyword
                var reserved = KEYWORDS[ident];
                if (typeof reserved == "number") {
                    tokens.push(token(ident, reserved));
                }
                else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            }
            else if (isskippable(src[0])) {
                src.shift(); // Skip the current character
            }
            else {
                console.log("An undefined character found in the code : ", src[0]);
                break;
            }
        }
    }
    tokens.push(token("EndOfFile", TokenType.EOF));
    return tokens;
}
// const filePath = 'code.txt'
// try {
//     const srcCode = fs.readFileSync(filePath, 'utf-8');
//     for (const t of tokenize(srcCode)) {
//         console.log(t);
//     }
// } catch (error) {
//     console.log(error);
// }
