import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const files = [
    'easy.ts',
    'medium1.ts',
    'medium2.ts',
    'hard1.ts',
    'hard2.ts',
    'all_problems.ts'
];

const writeYourCodeRegex = /\/\/\s*Write\s+your\s+code\s+here\r?\n?/gi;
const placeholderReturnRegex = /\s*\/\/\s*Placeholder\s+return/gi;

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove "// Write your code here" and the following newline if present
        content = content.replace(writeYourCodeRegex, '');
        
        // Remove " // Placeholder return"
        content = content.replace(placeholderReturnRegex, '');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned up ${file}`);
    } else {
        console.warn(`File ${file} not found`);
    }
});
