const fs = require('fs');

const filePath = 'app/(app)/dashboard/page.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const startIndex = content.indexOf('  // Generate daily coach using existing engine with brain context');
const endIndex = content.indexOf('  // Helper function to safely calculate score change');

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find boundaries');
    process.exit(1);
}

const beforeBlock = content.substring(0, startIndex);
const afterBlock = content.substring(endIndex);
const newBlock = fs.readFileSync('new_block.txt', 'utf8');

const finalContent = beforeBlock + newBlock + afterBlock;
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully replaced AI engines with 3 parallel stages.');
