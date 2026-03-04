export { };
import fs from 'fs';
import path from 'path';

const replacements = [
    { regex: /bg-zinc-950/g, replacement: 'bg-background' },
    { regex: /bg-zinc-900/g, replacement: 'bg-card' },
    { regex: /bg-zinc-800/g, replacement: 'bg-muted' },
    { regex: /border-zinc-800/g, replacement: 'border-border' },
    { regex: /border-zinc-700/g, replacement: 'border-border' },
    { regex: /text-zinc-100/g, replacement: 'text-foreground' },
    { regex: /text-zinc-200/g, replacement: 'text-foreground' },
    { regex: /text-zinc-300/g, replacement: 'text-muted-foreground' },
    { regex: /text-zinc-400/g, replacement: 'text-muted-foreground' },
    { regex: /text-zinc-500/g, replacement: 'text-muted-foreground' },
    { regex: /bg-emerald-500/g, replacement: 'bg-primary' },
    { regex: /bg-emerald-600/g, replacement: 'bg-primary' },
    { regex: /text-emerald-500/g, replacement: 'text-primary' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let newContent = content;
            for (const { regex, replacement } of replacements) {
                newContent = newContent.replace(regex, replacement);
            }
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    }
}

// Need a way to get __dirname in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

processDirectory(path.join(__dirname, 'src'));
