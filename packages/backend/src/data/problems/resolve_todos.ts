import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const filePath = path.resolve(__dirname, "all_problems.ts");

async function resolveTodos() {
    console.log("Reading all_problems.ts...");
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Extract the array of problems
    const startMarker = "export const importedProblems: Problem[] = ";
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
        throw new Error("Could not find importedProblems export in all_problems.ts");
    }
    
    const arrayPart = content.substring(startIndex + startMarker.length).trim();
    const endIndex = arrayPart.lastIndexOf("];");
    if (endIndex === -1) {
        throw new Error("Could not find end of array in all_problems.ts");
    }
    
    const arrayString = arrayPart.substring(0, endIndex + 1);
    
    // Using eval to parse the TS literal array into a JS object
    let problems;
    try {
        problems = eval(`(${arrayString})`);
    } catch (err) {
        console.error("Failed to parse problems array. Ensure it is a valid JS/TS array literal.");
        throw err;
    }

    console.log(`Found ${problems.length} problems. Starting processing separately...`);

    for (let i = 0; i < problems.length; i++) {
        const problem = problems[i];
        
        // Check if there are TODOs to resolve
        if (!problem.starterCode || !problem.starterCode.includes("TODO")) {
            console.log(`[${i+1}/${problems.length}] Skipping ${problem.id} (No TODOs)`);
            continue;
        }

        console.log(`[${i+1}/${problems.length}] Resolving TODOs for: ${problem.id}`);

        const prompt = `
You are an expert C++ developer. Your task is to update the 'starterCode' for a coding problem to resolve the TODOs.

Problem Context:
- ID: ${problem.id}
- Title: ${problem.title}
- Description: ${problem.description}
- Test Cases (for I/O format): ${JSON.stringify(problem.testCases)}

Current Starter Code:
\`\`\`cpp
${problem.starterCode}
\`\`\`

Instructions:
1. Update the 'Solution' class method signature (name should stay similar, but return type and parameters must match the problem).
2. Implement the 'main' function to:
   - Parse input from 'cin' exactly as described in the 'testCases'.
   - Call the solution method.
   - Print the output to 'cout' exactly as expected in 'testCases'.
3. DO NOT implement the core logic. Keep the body of the solution method as '// Write your code here' or similar.
4. Include all necessary headers (like <iostream>, <vector>, <string>, etc. or just <bits/stdc++.h>).
5. Ensure the code is complete and compilable.
6. Return ONLY the code inside a \`\`\`cpp block. No explanation.
`;

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a C++ boilerplate generator for coding platforms." },
                    { role: "user", content: prompt }
                ],
                temperature: 0,
            });

            const choice = completion.choices[0].message.content;
            if (choice) {
                const codeMatch = choice.match(/```cpp\n([\s\S]*?)\n```/) || choice.match(/```([\s\S]*?)\n```/);
                const newCode = codeMatch ? codeMatch[1].trim() : choice.trim();
                
                if (newCode) {
                    problem.starterCode = newCode;
                    console.log(`Updated starterCode for ${problem.id}`);
                }
            }
        } catch (err: any) {
            console.error(`Error processing ${problem.id}: ${err.message}`);
        }

        // Save progress every 10 problems or at the end
        if ((i + 1) % 10 === 0 || i === problems.length - 1) {
            console.log("Saving progress...");
            const header = content.substring(0, startIndex + startMarker.length);
            const newContent = `${header}${JSON.stringify(problems, null, 4)};\n`;
            fs.writeFileSync(filePath, newContent, "utf-8");
        }
    }

    console.log("Done! all_problems.ts has been updated.");
}

resolveTodos().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
