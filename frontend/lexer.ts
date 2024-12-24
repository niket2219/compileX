// let x = 45 + (23 * 89)

const fs = require('fs')

export enum TokenType {
    Number,
    Identifier,
    Equals,
    Comma, Colon,
    OpenParam,   // (
    CloseParam,  // )
    OpenBrace, // {}
    ClosedBrace, // }
    BinaryOperator,
    Let,
    Const,
    Semicolon,
    EOF
}


export interface Token {
    value: string,
    type : TokenType
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    const : TokenType.Const
}

function isalpha(src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isint(src: string) {
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

    return c >= bounds[0] && c <= bounds[1];
}

function isskippable(src: string) {
    return src == " " || src == "\n" || src == "\t";
}

function token(value = "", type: TokenType): Token {
    return { value, type };
}

export function tokenize(sourceCode: string) : Token[] {
    
    const tokens = new Array<Token>();

    const src = sourceCode.split("");

    // Build each Token until the end of the file

    while (src.length > 0) {
        if (src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParam));
        }
        else if (src[0] == ')') {
            tokens.push(token(src.shift(), TokenType.CloseParam));
        }
        else if (src[0] == '{') {
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        }
        else if (src[0] == '}') {
            tokens.push(token(src.shift(), TokenType.ClosedBrace));
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
        else if (src[0] == ":") {
            tokens.push(token(src.shift(), TokenType.Colon));
            }
        else if (src[0] == ",") {
            tokens.push(token(src.shift(), TokenType.Comma));
            }
        else {
            // Building MultiCharacters tokens

            if (isint(src[0])) {
                let num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            }
            else if (isalpha(src[0])){
                let ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }

                // check if identifier is a reserved keyword
                const reserved = KEYWORDS[ident];
                if (typeof reserved == "number") {
                    tokens.push(token(ident, reserved));
                }
                else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            
            }
            else if (isskippable(src[0])) {
                src.shift();          // Skip the current character
            }
            else {
                console.log("An undefined character found in the code : ", src[0]);
                break;
            }
        }
    }
    tokens.push(token("EndOfFile",TokenType.EOF))
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