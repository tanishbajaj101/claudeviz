import { Problem } from "@/types";

export const hard2Problems: Problem[] = [
    {
        id: "edit-distance",
        title: "Edit Distance",
        difficulty: "Hard",
        category: "Dynamic Programming",
        tags: ["string", "dynamic-programming"],
        description: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations required to convert \`word1\` to \`word2\`.

You have the following three operations permitted on a word:
1. Insert a character
2. Delete a character
3. Replace a character`,
        constraints: [
            "0 <= word1.length, word2.length <= 500",
            "word1 and word2 consist of lowercase English letters.",
        ],
        examples: [
            {
                input: "word1 = \"horse\", word2 = \"ros\"",
                output: "3",
                explanation: "horse -> rorse (replace 'h' with 'r')\\nrorse -> rose (remove 'r')\\nrose -> ros (remove 'e')",
            },
            {
                input: "word1 = \"intention\", word2 = \"execution\"",
                output: "5",
                explanation: "intention -> inention (remove 't')\\ninention -> enention (replace 'i' with 'e')\\nenention -> exention (replace 'n' with 'x')\\nexention -> exection (replace 'n' with 'c')\\nexection -> execution (insert 'u')",
            },
        ],
        testCases: [
            { input: "horse\nros", expectedOutput: "3" },
            { input: "intention\nexecution", expectedOutput: "5" },
            { input: "\na", expectedOutput: "1" },
            { input: "a\n", expectedOutput: "1" },
            { input: "a\nb", expectedOutput: "1" },
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
    int minDistance(string word1, string word2) {
        // Write your code here
    }
};

int main() {
    string w1, w2;
    // Handle empty strings properly for judge using getline
    getline(cin, w1);
    getline(cin, w2);
    // If length is 0 due to \r, trim it
    if(!w1.empty() && w1.back()=='\r') w1.pop_back();
    if(!w2.empty() && w2.back()=='\r') w2.pop_back();

    Solution sol;
    cout << sol.minDistance(w1, w2) << endl;
    return 0;
}`,
        editorial: `### Approach
Dynamic Programming. Create a 2D \`dp\` array where \`dp[i][j]\` represents the minimum operations to convert \`word1[0..i)\` to \`word2[0..j)\`. If the characters match, \`dp[i][j] = dp[i-1][j-1]\`. Otherwise, it's 1 + the minimum of inserting ( \`dp[i][j-1]\` ), deleting ( \`dp[i-1][j]\` ), or replacing ( \`dp[i-1][j-1]\` ). 

### Complexity
Time: O(M * N), Space: O(M * N) but can be optimized to O(min(M, N)) space.`,
        acceptanceRate: 0.53,
    },
    {
        id: "regular-expression-matching",
        title: "Regular Expression Matching",
        difficulty: "Hard",
        category: "Dynamic Programming",
        tags: ["string", "dynamic-programming"],
        description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
* \`'.'\` Matches any single character.
* \`'*'\` Matches zero or more of the preceding element.

The matching should cover the **entire** input string (not partial).`,
        constraints: [
            "1 <= s.length <= 20",
            "1 <= p.length <= 20",
            "s contains only lowercase English letters.",
            "p contains only lowercase English letters, '.', and '*'.",
            "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match.",
        ],
        examples: [
            {
                input: "s = \"aa\", p = \"a\"",
                output: "false",
                explanation: "\"a\" does not match the entire string \"aa\".",
            },
            {
                input: "s = \"aa\", p = \"a*\"",
                output: "true",
                explanation: "'*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes \"aa\".",
            },
            {
                input: "s = \"ab\", p = \".*\"",
                output: "true",
                explanation: "\".*\" means \"zero or more (*) of any character (.)\".",
            },
        ],
        testCases: [
            { input: "aa\na", expectedOutput: "0" },
            { input: "aa\na*", expectedOutput: "1" },
            { input: "ab\n.*", expectedOutput: "1" },
            { input: "aab\nc*a*b", expectedOutput: "1" },
            { input: "mississippi\nmis*is*p*.", expectedOutput: "0" },
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
    bool isMatch(string s, string p) {
        // Write your code here
    }
};

int main() {
    string s, p; cin >> s >> p;
    Solution sol;
    cout << sol.isMatch(s, p) << endl;
    return 0;
}`,
        editorial: `### Approach
Dynamic Programming. \`dp[i][j]\` is true if \`s[0..i)\` matches \`p[0..j)\`. If \`p[j-1] == '*'\`, it can either match zero of the preceding element (\`dp[i][j-2]\`) or it can match one more of the preceding element if \`s[i-1]\` matches \`p[j-2]\` (\`dp[i-1][j]\`). Otherwise, if characters match (or \`p\` has a dot), \`dp[i][j] = dp[i-1][j-1]\`.

### Complexity
Time: O(S * P), Space: O(S * P)`,
        acceptanceRate: 0.28,
    },
    {
        id: "sliding-window-maximum",
        title: "Sliding Window Maximum",
        difficulty: "Hard",
        category: "Sliding Window",
        tags: ["array", "sliding-window", "queue", "monotonic-queue"],
        description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.`,
        constraints: [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4",
            "1 <= k <= nums.length",
        ],
        examples: [
            {
                input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
                output: "[3,3,5,5,6,7]",
                explanation: "Window position                Max\\n---------------               -----\\n[1  3  -1] -3  5  3  6  7       3\\n 1 [3  -1  -3] 5  3  6  7       3\\n 1  3 [-1  -3  5] 3  6  7       5\\n 1  3  -1 [-3  5  3] 6  7       5\\n 1  3  -1  -3 [5  3  6] 7       6\\n 1  3  -1  -3  5 [3  6  7]      7",
            },
            { input: "nums = [1], k = 1", output: "[1]" },
        ],
        testCases: [
            { input: "8\n1 3 -1 -3 5 3 6 7\n3", expectedOutput: "3 3 5 5 6 7" },
            { input: "1\n1\n1", expectedOutput: "1" },
            { input: "2\n1 -1\n1", expectedOutput: "1 -1" },
            { input: "2\n9 11\n2", expectedOutput: "11" },
            { input: "3\n4 -2 5\n2", expectedOutput: "4 5" },
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
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        // Write your code here
    }
};

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int i=0; i<n; ++i) cin >> nums[i];
    int k; cin >> k;
    Solution sol;
    vector<int> res = sol.maxSlidingWindow(nums, k);
    for(int i=0; i<res.size(); ++i) {
        cout << res[i] << (i+1==res.size()?"":" ");
    }
    cout << "\\n";
    return 0;
}`,
        editorial: `### Approach
Monotonic Deque. Store indices of array elements in a double-ended queue. Maintain the deque monotonically decreasing: before inserting \`i\`, remove all indices from the back of the deque whose corresponding array values are \`<= nums[i]\`. Also, remove indices from the front that are out of the window bounds (\`<= i - k\`). The maximum for every window of size \`k\` is the element at the front of the deque.

### Complexity
Time: O(N), Space: O(K)`,
        acceptanceRate: 0.46,
    },
    {
        id: "serialize-deserialize-binary-tree",
        title: "Serialize and Deserialize Binary Tree",
        difficulty: "Hard",
        category: "Trees",
        tags: ["tree", "depth-first-search", "breadth-first-search", "design", "string", "binary-tree"],
        description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

In starter code, a tree is built from an array of integers representing level-order traversal (use 'N' for null). Your job is to implement \`serialize\` and \`deserialize\`.`,
        constraints: [
            "The number of nodes in the tree is in the range [0, 10^4].",
            "-1000 <= Node.val <= 1000",
        ],
        examples: [
            {
                input: "root = [1,2,3,null,null,4,5]",
                output: "[1,2,3,null,null,4,5]",
                explanation: "Serialization returns a string, e.g., '1,2,3,N,N,4,5,N,N,N,N'. The deserializer takes this back to the tree.",
            },
            { input: "root = []", output: "[]" },
        ],
        testCases: [
            { input: "7\n1 2 3 N N 4 5", expectedOutput: "1 2 3 N N 4 5" },
            { input: "0\n", expectedOutput: "" },
            { input: "3\n1 2 N", expectedOutput: "1 2 N" },
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
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

class Codec {
public:
    // Encodes a tree to a single string.
    string serialize(TreeNode* root) {
        // Write your code here
    }

    // Decodes your encoded data to tree.
    TreeNode* deserialize(string data) {
        // Write your code here
    }
};

TreeNode* buildTree(const vector<string>& tokens) {
    if (tokens.empty() || tokens[0] == "N") return NULL;
    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < tokens.size()) {
        TreeNode* curr = q.front(); q.pop();
        if (tokens[i] != "N") {
            curr->left = new TreeNode(stoi(tokens[i]));
            q.push(curr->left);
        }
        i++;
        if (i < tokens.size() && tokens[i] != "N") {
            curr->right = new TreeNode(stoi(tokens[i]));
            q.push(curr->right);
        }
        i++;
    }
    return root;
}

void printTree(TreeNode* root) {
    if(!root) return;
    queue<TreeNode*> q;
    q.push(root);
    vector<string> res;
    while(!q.empty()) {
        TreeNode* curr = q.front(); q.pop();
        if(curr) {
            res.push_back(to_string(curr->val));
            q.push(curr->left);
            q.push(curr->right);
        } else {
            res.push_back("N");
        }
    }
    while(res.back() == "N") res.pop_back();
    for(int i=0; i<res.size(); ++i) {
        cout << res[i] << (i+1==res.size()?"":" ");
    }
    cout << "\\n";
}

int main() {
    int n; 
    if (!(cin >> n)) { cout << "\\n"; return 0; }
    if (n==0) { cout << "\\n"; return 0; }
    vector<string> tokens(n);
    for(int i=0; i<n; ++i) cin >> tokens[i];

    TreeNode* root = buildTree(tokens);
    Codec codec;
    printTree(codec.deserialize(codec.serialize(root)));
    return 0;
}`,
        editorial: `### Approach
A pre-order traversal (DFS) is often easiest for serialization. For each node, append its value to a string, followed by a delimiter like a comma. If the node is null, append "N". To deserialize, split the string by commas. Use a recursive function with a queue or pointer over the parsed tokens. It builds the root, then calls itself to build left, then right subtrees.

### Complexity
Time: O(N), Space: O(N) for string / call stack.`,
        acceptanceRate: 0.56,
    },
    {
        id: "find-median-from-data-stream",
        title: "Find Median from Data Stream",
        difficulty: "Hard",
        category: "Heap / Priority Queue",
        tags: ["two-pointers", "design", "sorting", "heap-priority-queue", "data-stream"],
        description: `The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the \`MedianFinder\` class:
* \`MedianFinder()\` initializes the \`MedianFinder\` object.
* \`void addNum(int num)\` adds the integer \`num\` from the data stream to the data structure.
* \`double findMedian()\` returns the median of all elements so far.

Starter code will read \`n\` inputs (1 means addNum followed by x. 2 means findMedian). It will print the medians.`,
        constraints: [
            "-10^5 <= num <= 10^5",
            "There will be at least one element in the data structure before calling findMedian.",
            "At most 5 * 10^4 calls will be made to addNum and findMedian.",
        ],
        examples: [
            {
                input: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()",
                output: "1.5, 2.0",
            },
            {
                input: "addNum(-1), findMedian(), addNum(-2), findMedian()",
                output: "-1.0, -1.5",
            },
        ],
        testCases: [
            { input: "5\n1 1\n1 2\n2\n1 3\n2", expectedOutput: "1.50000\n2.00000" },
            { input: "4\n1 -1\n2\n1 -2\n2", expectedOutput: "-1.00000\n-1.50000" },
            { input: "3\n1 1\n1 1\n2", expectedOutput: "1.00000" },
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

class MedianFinder {
public:
    MedianFinder() {
        
    }
    
    void addNum(int num) {
        // Write your code here
    }
    
    double findMedian() {
        // Write your code here
    }
};

int main() {
    int n; cin >> n;
    MedianFinder mf;
    cout << fixed << setprecision(5);
    for(int i=0; i<n; ++i) {
        int type; cin >> type;
        if(type == 1) {
            int num; cin >> num;
            mf.addNum(num);
        } else {
            cout << mf.findMedian() << "\\n";
        }
    }
    return 0;
}`,
        editorial: `### Approach
Use two priority queues: a max-heap to store the smaller half of the numbers, and a min-heap to store the larger half. Maintain balance such that the max-heap has either the same amount of elements as the min-heap, or 1 more. Elements are inserted into max-heap first, then its max is transferred to min-heap. If min-heap size > max-heap size, balance back.
If sizes are equal, median is average of both tops. Otherwise, it is the top of max-heap.

### Complexity
Time: O(log N) to add, O(1) to find median. Space: O(N)`,
        acceptanceRate: 0.51,
    },
    {
        id: "binary-tree-maximum-path-sum",
        title: "Binary Tree Maximum Path Sum",
        difficulty: "Hard",
        category: "Trees",
        tags: ["dynamic-programming", "tree", "depth-first-search", "binary-tree"],
        description: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the \`root\` of a binary tree, return the maximum path sum of any **non-empty** path.`,
        constraints: [
            "The number of nodes in the tree is in the range [1, 3 * 10^4].",
            "-1000 <= Node.val <= 1000",
        ],
        examples: [
            {
                input: "root = [1,2,3]",
                output: "6",
                explanation: "The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.",
            },
            {
                input: "root = [-10,9,20,null,null,15,7]",
                output: "42",
                explanation: "The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.",
            },
        ],
        testCases: [
            { input: "3\n1 2 3", expectedOutput: "6" },
            { input: "7\n-10 9 20 N N 15 7", expectedOutput: "42" },
            { input: "1\n-3", expectedOutput: "-3" },
            { input: "3\n2 -1 -2", expectedOutput: "2" },
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
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

class Solution {
public:
    int maxPathSum(TreeNode* root) {
        // Write your code here
    }
};

TreeNode* buildTree(const vector<string>& tokens) {
    if (tokens.empty() || tokens[0] == "N") return NULL;
    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < tokens.size()) {
        TreeNode* curr = q.front(); q.pop();
        if (tokens[i] != "N") {
            curr->left = new TreeNode(stoi(tokens[i]));
            q.push(curr->left);
        }
        i++;
        if (i < tokens.size() && tokens[i] != "N") {
            curr->right = new TreeNode(stoi(tokens[i]));
            q.push(curr->right);
        }
        i++;
    }
    return root;
}

int main() {
    int n; cin >> n;
    vector<string> tokens(n);
    for(int i=0; i<n; ++i) cin >> tokens[i];
    
    TreeNode* root = buildTree(tokens);
    Solution sol;
    cout << sol.maxPathSum(root) << endl;
    return 0;
}`,
        editorial: `### Approach
A path going through a node acts as an "arch" over that node. The max path sum through the node is `+ `node.val + max(0, leftPath) + max(0, rightPath)` + `. The node must also return the maximum straight path sum to its parent, which is ` + `node.val + max(0, leftPath, rightPath)` + `. Maintain a global maximum variable that tracks the best "arch" sum found at any node during standard DFS.

### Complexity
Time: O(N), Space: O(H) where H is the height of tree (call stack).`,
        acceptanceRate: 0.39,
    },
    {
        id: "minimum-cost-to-hire-k-workers",
        title: "Min Cost to Hire K Workers",
        difficulty: "Hard",
        category: "Heap / Priority Queue",
        tags: ["array", "greedy", "sorting", "heap-priority-queue"],
        description: `There are \`n\` workers. You are given two integer arrays \`quality\` and \`wage\` where \`quality[i]\` is the quality of the \`ith\` worker and \`wage[i]\` is the minimum wage expectation for the \`ith\` worker.

We want to hire exactly \`k\` workers to form a paid group. To hire a group of \`k\` workers, we must pay them according to the following rules:
1. Every worker in the paid group must be paid at least their minimum wage expectation.
2. In the group, each worker's pay must be directly proportional to their quality. This means if a worker's quality is double that of another worker in the group, then they must be paid twice as much as the other worker.

Given the integer \`k\`, return the least amount of money needed to form a paid group satisfying the above conditions. Answers within 10^-5 of the actual answer will be accepted.`,
        constraints: [
            "n == quality.length == wage.length",
            "1 <= k <= n <= 10^4",
            "1 <= quality[i], wage[i] <= 10^4",
        ],
        examples: [
            {
                input: "quality = [10,20,5], wage = [70,50,30], k = 2",
                output: "105.00000",
                explanation: "We pay 70 to 0-th worker and 35 to 2-th worker.",
            },
            {
                input: "quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3",
                output: "30.66667",
                explanation: "We pay 4 to 0-th worker, 13.33333 to 2-th and 3-th workers each.",
            },
        ],
        testCases: [
            { input: "3\n10 20 5\n70 50 30\n2", expectedOutput: "105.00000" },
            { input: "5\n3 1 10 10 1\n4 8 2 2 7\n3", expectedOutput: "30.66667" },
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
    double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {
        // Write your code here
    }
};

int main() {
    int n; if (!(cin >> n)) return 0;
    vector<int> q(n), w(n);
    for(int i=0; i<n; ++i) cin >> q[i];
    for(int i=0; i<n; ++i) cin >> w[i];
    int k; cin >> k;
    Solution sol;
    cout << fixed << setprecision(5) << sol.mincostToHireWorkers(q, w, k) << endl;
    return 0;
}`,
        editorial: `### Approach
A group's total cost is equal to its total quality multiplied by the maximum (wage/quality) ratio among the chosen workers. To minimize cost, we should try sorting workers by their ratio (wage/quality). Let's iterate through the sorted workers, treating each as the "ratio-defining" worker. A max-heap can be used to keep track of the \`k\` cheapest workers encountered so far (by tracking their quality, and evicting the maximum quality to reduce total quality).

### Complexity
Time: O(N log N) for sorting, Space: O(N) for pairs and heap.`,
        acceptanceRate: 0.62,
    }
];
