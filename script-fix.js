const fs = require('fs');
const files = [
    'src/components/contests/ContestLeaderboard.tsx',
    'src/app/contests/[id]/page.tsx',
    'src/components/contests/InviteFriendsDropdown.tsx',
    'src/components/contests/CreateContestModal.tsx',
    'src/app/contests/page.tsx',
    'src/components/problems/ProblemWorkspace.tsx'
];
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\\\`/g, '\`').replace(/\\\$/g, '$');
    fs.writeFileSync(file, content);
}
