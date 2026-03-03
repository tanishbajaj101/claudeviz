const code = `
vector<int> v;
map<int, int> m;
set<int> s;
queue<int> q;
vector<vector<int>> vv;
map<int, vector<int>> mv;
map<int, int> mp, mp2;
`;
const variables = new Map();
const lines = code.split('\n');

lines.forEach((line) => {
    const containerRegex = /\b(vector|map|unordered_map|set|unordered_set|stack|queue|priority_queue|deque|list)\s*<(?:[^<>]+|<[^<>]*>)+>\s+(\w+)/g;
    for (const match of line.matchAll(containerRegex)) {
        variables.set(match[2], match[1]);
    }
});
console.dir(variables);
