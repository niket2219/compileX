import Parser from "./frontend/parser";
const prompt = require('prompt-sync')();
const fs = require('fs').promises;
import { evaluate } from "./runtime/interpreter";
import Environment from "./runtime/environment";
import { MK_NULL, MK_NUMBER, MK_BOOL } from "./runtime/values";

async function repl() {
    const parser = new Parser();
    console.log("Repl 1.v.0.1");

    const env = new Environment();
    env.declareVar("x" , MK_NUMBER(21))
    env.declareVar("true" , MK_BOOL(true))
    env.declareVar("false" , MK_BOOL(false))
    env.declareVar("null" , MK_NULL())

    while (true) {
        const ip = prompt("> ");
        if (!ip || ip.includes("exit")) {
            break;
        }

        try {
            const program = await parser.produceAST(ip);

            if (!program) {
                console.error("Invalid input or AST generation failed.");
                continue;
            }

            const interpreted = await evaluate(program,env);

            console.log(program);

            await fs.writeFile('data.json', JSON.stringify(program, null, 2),{flag : 'a'});
            await fs.writeFile('data.json', JSON.stringify(interpreted, null, 2),{flag : 'a'});
            console.log("File written successfully...");
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

repl();
