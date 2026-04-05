import type { Problem } from "@algoarena/shared";

export const specialProblems: Problem[] = [
  // ─── EASY ────────────────────────────────────────────────────────────────
  {
    id: "sp-doodh-soda",
    title: "Doodh Soda",
    difficulty: "Easy",
    category: "Greedy",
    tags: ["greedy", "sorting", "scheduling"],
    description: `Welcome to Lyari.

Help Aalam bhai serve Doodh Soda to his customers with minimum waiting time across all orders. You are given an array \`orders\` of \`n\` customers where \`orders[i]\` is the preparation time of the i-th order. Find the **minimum total waiting time** across all orders.
The waiting time of an order is the total time it spends waiting before it starts being prepared. All customers arrive at time 0.`,
    constraints: [
      "1 <= n <= 10^5",
      "1 <= orders[i] <= 10^4",
    ],
    examples: [
      {
        input: "orders = [3, 1, 2]",
        output: "4",
        explanation: "Sort: [1, 2, 3]. Waiting times: [0, 1, 3]. Total = 4.",
      },
      {
        input: "orders = [1, 2, 3, 4]",
        output: "10",
        explanation: "Already sorted. Waiting times: [0, 1, 3, 6]. Total = 10.",
      },
    ],
    testCases: [
      { input: "3\n3 1 2", expectedOutput: "4" },
      { input: "4\n1 2 3 4", expectedOutput: "10" },
      { input: "1\n5", expectedOutput: "0" },
      { input: "5\n4 2 1 3 5", expectedOutput: "20" },
      { input: "2\n10 1", expectedOutput: "1" },
    ],
    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 256000,
      stack_limit: 64000,
    },
    languageId: 54,
    starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int minimumWaitingTime(vector<int>& orders) {

    }
};

int main() {
    int n;
    cin >> n;
    vector<int> orders(n);
    for (int i = 0; i < n; i++) cin >> orders[i];
    Solution sol;
    cout << sol.minimumWaitingTime(orders) << endl;
    return 0;
}`,
    editorial: `### Key Insight
SJF minimizes total waiting time because each process's burst time is added to the waiting time of every process that runs after it. Sorting in ascending order ensures the shortest jobs contribute to the fewest subsequent waits.

### Approach: Sort + Prefix Sum
Sort burst times ascending. For each process at index i, its waiting time = sum of burst[0..i-1]. Total = sum of all prefix sums — O(n log n) time, O(1) extra space.

### Formula
After sorting: total_wait = burst[0]*(n-1) + burst[1]*(n-2) + ... + burst[n-2]*1`,
    acceptanceRate: 0.71,
  },
  {
    id: "sp-fibonacci-sequence",
    title: "Fibonacci Number",
    difficulty: "Easy",
    category: "Dynamic Programming",
    tags: ["math", "dynamic-programming", "recursion", "memoization"],
    description: `The Fibonacci numbers, commonly denoted \`F(n)\`, form a sequence called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.

\`F(0) = 0, F(1) = 1\`
\`F(n) = F(n - 1) + F(n - 2), for n > 1\`

Given \`n\`, calculate \`F(n)\`.`,
    constraints: ["0 <= n <= 30"],
    examples: [
      {
        input: "n = 2",
        output: "1",
        explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1.",
      },
      {
        input: "n = 3",
        output: "2",
        explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2.",
      },
      {
        input: "n = 4",
        output: "3",
        explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3.",
      },
    ],
    testCases: [
      { input: "0", expectedOutput: "0" },
      { input: "1", expectedOutput: "1" },
      { input: "5", expectedOutput: "5" },
      { input: "10", expectedOutput: "55" },
      { input: "30", expectedOutput: "832040" },
    ],
    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 256000,
      stack_limit: 64000,
    },
    languageId: 54,
    starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int fib(int n) {

    }
};

int main() {
    int n;
    cin >> n;
    Solution sol;
    cout << sol.fib(n) << endl;
    return 0;
}`,
    editorial: `### Brute Force: Recursion
Directly translate the recurrence — O(2^n) due to repeated subproblems.

### Optimized: Bottom-Up DP
Iterate from 0 to n, keeping only the last two values — O(n) time, O(1) space.

### Key Insight
Avoid recomputation: once you realize you only need the previous two values, you can eliminate the array entirely.`,
    acceptanceRate: 0.68,
  },

  // ─── MEDIUM ───────────────────────────────────────────────────────────────
  {
    id: "sp-monsters",
    title: "Monsters",
    difficulty: "Medium",
    category: "Graphs",
    tags: ["bfs", "grid", "shortest-path"],
    description: `You and some monsters are in a grid. Each turn, you take one step and every monster also takes one step. A monster moves optimally to reach you as fast as possible.

Your goal is to **escape the grid** by reaching any border cell (first/last row or column). A monster blocks a cell if it arrives there at the same time as you or earlier.

The grid contains:
- \`A\` — your starting position
- \`M\` — a monster's starting position
- \`.\` — an empty cell

Determine if escape is possible. If yes, print \`YES\` followed by the move sequence on the next line (using characters \`U\`, \`D\`, \`L\`, \`R\`). If no, print \`NO\`.`,
    constraints: [
      "1 <= n, m <= 1000",
      "The grid contains exactly one 'A'",
      "The grid contains at least one 'M'",
    ],
    examples: [
      {
        input: "3 1\nM\nA\n.",
        output: "YES\nD",
        explanation: "A moves down to the border. The monster is 2 steps away, so it cannot block.",
      },
      {
        input: "3 3\nMMM\nMAM\nMMM",
        output: "NO",
        explanation: "A is completely surrounded by monsters with no escape route.",
      },
    ],
    testCases: [
      { input: "3 1\nM\nA\n.", expectedOutput: "YES\nD" },
      { input: "3 3\nMMM\nMAM\nMMM", expectedOutput: "NO" },
      { input: "5 1\nM\n.\nA\n.\n.", expectedOutput: "YES\nDD" },
      { input: "3 3\n.M.\nMAM\n.M.", expectedOutput: "NO" },
      { input: "7 1\nM\n.\n.\nA\n.\n.\n.", expectedOutput: "YES\nDDD" },
    ],
    judge0Limits: {
      cpu_time_limit: 3,
      wall_time_limit: 6,
      memory_limit: 256000,
      stack_limit: 64000,
    },
    languageId: 54,
    starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string escape(int n, int m, vector<string>& grid) {

    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    cin >> n >> m;
    vector<string> grid(n);
    for (int i = 0; i < n; i++) cin >> grid[i];

    Solution sol;
    cout << sol.escape(n, m, grid) << endl;
    return 0;
}`,
    editorial: `### Approach: Multi-source BFS (Two-pass)

**Step 1 — Monster BFS:**
Run a single BFS simultaneously from all monster starting positions. This gives \`monsterDist[i][j]\` — the minimum time any monster can reach cell \`(i, j)\`.

**Step 2 — Player BFS:**
BFS from \`A\`'s start. Only enqueue a neighbor \`(r, c)\` if \`playerDist[r][c] < monsterDist[r][c]\` (you arrive strictly before any monster). Store parent pointers for path reconstruction.

**Step 3 — Path reconstruction:**
If BFS reaches any border cell, backtrack parent pointers and reverse to get the move sequence. Print \`YES\` + path. Otherwise print \`NO\`.

### Key Insight
Monsters are optimal — the earliest any monster reaches a cell is exactly its BFS distance from the nearest monster start. Precomputing all monster distances in one pass lets you check each cell in O(1) during the player BFS.

### Complexity
O(n × m) time and space for both BFS passes.`,
    acceptanceRate: 0.38,
  },
  {
    id: "sp-merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Arrays & Sorting",
    tags: ["array", "sorting"],
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4",
    ],
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    testCases: [
      { input: "4\n1 3\n2 6\n8 10\n15 18", expectedOutput: "1 6\n8 10\n15 18" },
      { input: "2\n1 4\n4 5", expectedOutput: "1 5" },
      { input: "1\n1 4", expectedOutput: "1 4" },
      { input: "3\n1 4\n0 2\n3 5", expectedOutput: "0 5" },
      { input: "2\n1 4\n2 3", expectedOutput: "1 4" },
    ],
    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 256000,
      stack_limit: 64000,
    },
    languageId: 54,
    starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {

    }
};

int main() {
    int n;
    cin >> n;
    vector<vector<int>> intervals(n, vector<int>(2));
    for (int i = 0; i < n; i++) cin >> intervals[i][0] >> intervals[i][1];

    Solution sol;
    auto result = sol.merge(intervals);
    for (auto& iv : result) {
        cout << iv[0] << " " << iv[1] << "\\n";
    }
    return 0;
}`,
    editorial: `### Approach: Sort then Sweep
Sort intervals by start time. Iterate and merge if the current interval overlaps with the last merged interval (start <= last end). Update last end to max of both ends — O(n log n) time.

### Key Insight
After sorting, you only ever need to compare with the last merged interval — no need for nested loops.`,
    acceptanceRate: 0.46,
  },
  {
    id: "sp-rotate-matrix",
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Arrays & Math",
    tags: ["array", "math", "matrix"],
    description: `You are given an \`n x n\` 2D matrix representing an image. Rotate the image by 90 degrees clockwise.

You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. Do NOT allocate another 2D matrix.`,
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20",
      "-1000 <= matrix[i][j] <= 1000",
    ],
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]",
      },
      {
        input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
      },
    ],
    testCases: [
      { input: "3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "7 4 1\n8 5 2\n9 6 3" },
      { input: "4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16", expectedOutput: "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "2\n1 2\n3 4", expectedOutput: "3 1\n4 2" },
    ],
    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 256000,
      stack_limit: 64000,
    },
    languageId: 54,
    starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {

    }
};

int main() {
    int n;
    cin >> n;
    vector<vector<int>> matrix(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> matrix[i][j];

    Solution sol;
    sol.rotate(matrix);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (j > 0) cout << " ";
            cout << matrix[i][j];
        }
        cout << "\\n";
    }
    return 0;
}`,
    editorial: `### Approach: Transpose + Reverse Rows
1. Transpose the matrix (swap matrix[i][j] with matrix[j][i]).
2. Reverse each row.
This achieves a 90° clockwise rotation in-place — O(n²) time, O(1) space.

### Key Insight
Clockwise 90° = transpose followed by horizontal flip. Counter-clockwise = transpose + vertical flip.`,
    acceptanceRate: 0.72,
  },

  // ─── HARD ────────────────────────────────────────────────────────────────
  {
    id: "sp-word-break",
    title: "Word Break",
    difficulty: "Hard",
    category: "Dynamic Programming",
    tags: ["hash-table", "string", "dynamic-programming", "trie", "memoization"],
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of only lowercase English letters.",
      "All the strings of wordDict are unique.",
    ],
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: 'Return true because "leetcode" can be segmented as "leet code".',
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: "true",
        explanation: '"applepenapple" can be segmented as "apple pen apple".',
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: "false",
      },
    ],
    testCases: [
      { input: "leetcode\n2\nleet\ncode", expectedOutput: "true" },
      { input: "applepenapple\n2\napple\npen", expectedOutput: "true" },
      { input: "catsandog\n5\ncats\ndog\nsand\nand\ncat", expectedOutput: "false" },
      { input: "a\n1\na", expectedOutput: "true" },
      { input: "aaaaaaa\n2\naaaa\naaa", expectedOutput: "true" },
    ],
    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 256000,
      stack_limit: 64000,
    },
    languageId: 54,
    starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {

    }
};

int main() {
    string s;
    cin >> s;
    int k;
    cin >> k;
    vector<string> wordDict(k);
    for (int i = 0; i < k; i++) cin >> wordDict[i];

    Solution sol;
    cout << (sol.wordBreak(s, wordDict) ? "true" : "false") << endl;
    return 0;
}`,
    editorial: `### Brute Force: Recursion
Try every prefix, recurse on suffix if prefix is in dict — exponential without memoization.

### Optimized: Bottom-Up DP
\`dp[i]\` = can string \`s[0..i-1]\` be segmented. Transition: \`dp[i] = true\` if any \`dp[j]\` is true and \`s[j..i-1]\` is in the dict. Use an unordered_set for O(1) lookups — O(n² * m) time overall.

### Key Insight
Think of \`dp[i]\` as "can I reach position i by valid words?" rather than as a substring problem.`,
    acceptanceRate: 0.45,
  },
  {
    id: "sp-trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Two Pointers",
    tags: ["array", "two-pointers", "dynamic-programming", "stack", "monotonic-stack"],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
    ],
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The elevation map (shown in the diagram) traps 6 units of rain water.",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
      },
    ],
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9" },
      { input: "1\n0", expectedOutput: "0" },
      { input: "3\n3 0 3", expectedOutput: "3" },
      { input: "4\n0 1 0 0", expectedOutput: "0" },
    ],
    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 256000,
      stack_limit: 64000,
    },
    languageId: 54,
    starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {

    }
};

int main() {
    int n;
    cin >> n;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    Solution sol;
    cout << sol.trap(height) << endl;
    return 0;
}`,
    editorial: `### Brute Force
For each position, find max left and max right, compute water as min(maxL, maxR) - height[i] — O(n²).

### DP Precomputation
Precompute \`leftMax[i]\` and \`rightMax[i]\` arrays, then sweep — O(n) time, O(n) space.

### Optimized: Two Pointers
Use left and right pointers. Whichever side has the smaller max, process that side — water = max - height. No extra space — O(n) time, O(1) space.

### Key Insight
Water at position i is fully determined by the minimum of the highest walls on either side. The two-pointer approach exploits this: always process the side where you know the "height ceiling".`,
    acceptanceRate: 0.58,
  },
  {
    id: "sp-serialize-tree",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    category: "Trees",
    tags: ["string", "tree", "depth-first-search", "breadth-first-search", "design", "binary-tree"],
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

**Input format:** Level-order traversal where \`null\` is represented as \`-1\`.
**Output:** Level-order traversal of deserialized tree (same format).`,
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-1000 <= Node.val <= 1000",
    ],
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
      },
      {
        input: "root = []",
        output: "[]",
      },
    ],
    testCases: [
      { input: "7\n1 2 3 -1 -1 4 5", expectedOutput: "1 2 3 -1 -1 4 5" },
      { input: "1\n1", expectedOutput: "1" },
      { input: "0", expectedOutput: "" },
      { input: "3\n1 2 3", expectedOutput: "1 2 3" },
    ],
    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 256000,
      stack_limit: 64000,
    },
    languageId: 54,
    starterCode: `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Codec {
public:
    string serialize(TreeNode* root) {

    }

    TreeNode* deserialize(string data) {

    }
};

int main() {
    int n;
    cin >> n;
    if (n == 0) { cout << "" << endl; return 0; }

    vector<int> vals(n);
    for (int i = 0; i < n; i++) cin >> vals[i];

    // Build tree from level-order (-1 = null)
    TreeNode* root = vals[0] == -1 ? nullptr : new TreeNode(vals[0]);
    queue<TreeNode*> q;
    if (root) q.push(root);
    int idx = 1;
    while (!q.empty() && idx < n) {
        TreeNode* cur = q.front(); q.pop();
        if (idx < n && vals[idx] != -1) { cur->left = new TreeNode(vals[idx]); q.push(cur->left); }
        idx++;
        if (idx < n && vals[idx] != -1) { cur->right = new TreeNode(vals[idx]); q.push(cur->right); }
        idx++;
    }

    Codec codec;
    string serialized = codec.serialize(root);
    TreeNode* result = codec.deserialize(serialized);

    // Print level-order
    queue<TreeNode*> out;
    if (result) out.push(result);
    bool first = true;
    while (!out.empty()) {
        TreeNode* cur = out.front(); out.pop();
        if (!first) cout << " ";
        if (cur) { cout << cur->val; out.push(cur->left); out.push(cur->right); }
        else cout << -1;
        first = false;
    }
    // Trim trailing -1s
    cout << endl;
    return 0;
}`,
    editorial: `### Approach: BFS Serialization
Serialize using BFS (level-order), encoding null nodes as a sentinel (e.g., "#"). Deserialize by rebuilding level by level using a queue.

### Alternative: DFS (Preorder)
Preorder serialization: write val, recurse left, recurse right. Null = "#". Deserialize by reading tokens in the same order.

### Key Insight
The challenge is encoding structure, not values. Any traversal works as long as nulls are explicitly encoded — preorder is often simplest to implement.`,
    acceptanceRate: 0.56,
  },
];
