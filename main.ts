import { config } from "process";
import Parser from "./frontend/parser";
const prompt = require('prompt-sync')();
const fs = require('fs').promises;

async function repl() {
    const parser = new Parser();
    console.log("Repl 1.v.0.1");

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

            console.log(program);

            await fs.writeFile('data.json', JSON.stringify(program, null, 2));
            console.log("File written successfully...");
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

repl();