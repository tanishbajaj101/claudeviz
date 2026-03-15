import type { Problem } from "@algoarena/shared";

export const hard1Problems: Problem[] = [
    {
        id: "trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "Hard",
        category: "Two Pointers",
        tags: ["array", "two-pointers", "dynamic-programming", "stack"],
        description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
        constraints: [
            "n == height.length",
            "1 <= n <= 2 * 10^4",
            "0 <= height[i] <= 10^5",
        ],
        examples: [
            {
                input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
                output: "6",
                explanation: "The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.",
            },
            {
                input: "height = [4,2,0,3,2,5]",
                output: "9",
            },
        ],
        testCases: [
            { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
            { input: "6\n4 2 0 3 2 5", expectedOutput: "9" },
            { input: "1\n5", expectedOutput: "0" },
            { input: "3\n2 0 2", expectedOutput: "2" },
            { input: "5\n5 4 3 2 1", expectedOutput: "0" },
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
        // Write your code here
    }
};

int main() {
    int n; cin >> n;
    vector<int> h(n);
    for(int i=0; i<n; ++i) cin >> h[i];
    Solution sol;
    cout << sol.trap(h) << endl;
    return 0;
}`,
        editorial: `### Approach
Two Pointers. Maintain \`left\` and \`right\` pointers, and track \`maxLeft\` and \`maxRight\` heights seen so far. If \`maxLeft < maxRight\`, the water trapped at \`left\` depends purely on \`maxLeft\`, so we add \`maxLeft - height[left]\` to total and advance \`left\`. Vice versa for \`right\`.

### Complexity
Time: O(N), Space: O(1)`,
        acceptanceRate: 0.58,
    },
    {
        id: "median-of-two-sorted-arrays",
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        category: "Binary Search",
        tags: ["array", "binary-search", "divide-and-conquer"],
        description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
        constraints: [
            "nums1.length == m",
            "nums2.length == n",
            "0 <= m <= 1000",
            "0 <= n <= 1000",
            "1 <= m + n <= 2000",
            "-10^6 <= nums1[i], nums2[i] <= 10^6",
        ],
        examples: [
            {
                input: "nums1 = [1,3], nums2 = [2]",
                output: "2.00000",
                explanation: "merged array = [1,2,3] and median is 2.",
            },
            {
                input: "nums1 = [1,2], nums2 = [3,4]",
                output: "2.50000",
                explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
            },
        ],
        testCases: [
            { input: "2\n1 3\n1\n2", expectedOutput: "2.00000" },
            { input: "2\n1 2\n2\n3 4", expectedOutput: "2.50000" },
            { input: "0\n\n1\n1", expectedOutput: "1.00000" },
            { input: "1\n2\n0\n", expectedOutput: "2.00000" },
            { input: "2\n1 2\n1\n3", expectedOutput: "2.00000" },
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
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Write your code here
    }
};

int main() {
    int m; cin >> m;
    vector<int> nums1(m);
    for(int i=0; i<m; ++i) cin >> nums1[i];
    int n; cin >> n;
    vector<int> nums2(n);
    for(int i=0; i<n; ++i) cin >> nums2[i];
    
    Solution sol;
    cout << fixed << setprecision(5) << sol.findMedianSortedArrays(nums1, nums2) << endl;
    return 0;
}`,
        editorial: `### Approach
Binary Search. We want to partition both arrays such that the total number of elements on the left side is equal to (or one more than) the right side, and all elements on the left are <= elements on the right. Binary search on the smaller array for the correct partition index.

### Complexity
Time: O(log(min(M, N))), Space: O(1)`,
        acceptanceRate: 0.38,
    },
    {
        id: "merge-k-sorted-lists",
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        category: "Linked List",
        tags: ["linked-list", "divide-and-conquer", "heap-priority-queue"],
        description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
        constraints: [
            "k == lists.length",
            "0 <= k <= 10^4",
            "0 <= lists[i].length <= 500",
            "-10^4 <= lists[i][j] <= 10^4",
            "lists[i] is sorted in ascending order.",
            "The sum of lists[i].length will not exceed 10^4.",
        ],
        examples: [
            {
                input: "lists = [[1,4,5],[1,3,4],[2,6]]",
                output: "[1,1,2,3,4,4,5,6]",
                explanation: "The linked-lists are:\\n[\\n  1->4->5,\\n  1->3->4,\\n  2->6\\n]\\nmerging them into one sorted list:\\n1->1->2->3->4->4->5->6",
            },
            { input: "lists = []", output: "[]" },
            { input: "lists = [[]]", output: "[]" },
        ],
        testCases: [
            { input: "3\n3\n1 4 5\n3\n1 3 4\n2\n2 6", expectedOutput: "1 1 2 3 4 4 5 6" },
            { input: "0", expectedOutput: "" },
            { input: "1\n0", expectedOutput: "" },
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

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Write your code here
    }
};

int main() {
    int k; if (!(cin >> k)) return 0;
    vector<ListNode*> lists(k);
    for(int i=0; i<k; ++i) {
        int sz; cin >> sz;
        ListNode* dummy = new ListNode(0);
        ListNode* curr = dummy;
        for(int j=0; j<sz; ++j) {
            int x; cin >> x;
            curr->next = new ListNode(x);
            curr = curr->next;
        }
        lists[i] = dummy->next;
    }
    
    Solution sol;
    ListNode* res = sol.mergeKLists(lists);
    while (res != nullptr) {
        cout << res->val << (res->next ? " " : "");
        res = res->next;
    }
    cout << endl;
    return 0;
}`,
        editorial: `### Approach
Method 1: Min-Heap (Priority Queue). Insert the head of every list into the queue. Repeatedly pop the smallest element, append it to the result list, and if that element has a next, push its next to the queue.
Method 2: Divide and Conquer. Recursively merge adjacent pairs of lists (using merge 2 sorted lists) until only 1 list remains.

### Complexity
Time: O(N log K), where N is total number of nodes and K is number of lists. Space: O(K) for priority queue or O(1) iterative divide and conquer.`,
        acceptanceRate: 0.50,
    },
    {
        id: "reverse-nodes-in-k-group",
        title: "Reverse Nodes in k-Group",
        difficulty: "Hard",
        category: "Linked List",
        tags: ["linked-list", "recursion"],
        description: `Given the \`head\` of a linked list, reverse the nodes of the list \`k\` at a time, and return the modified list.

\`k\` is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of \`k\` then left-out nodes, in the end, should remain as it is.

You may not alter the values in the list's nodes, only nodes themselves may be changed.`,
        constraints: [
            "The number of nodes in the list is n.",
            "1 <= k <= n <= 5000",
            "0 <= Node.val <= 1000",
        ],
        examples: [
            {
                input: "head = [1,2,3,4,5], k = 2",
                output: "[2,1,4,3,5]",
            },
            {
                input: "head = [1,2,3,4,5], k = 3",
                output: "[3,2,1,4,5]",
            },
        ],
        testCases: [
            { input: "5\n1 2 3 4 5\n2", expectedOutput: "2 1 4 3 5" },
            { input: "5\n1 2 3 4 5\n3", expectedOutput: "3 2 1 4 5" },
            { input: "5\n1 2 3 4 5\n1", expectedOutput: "1 2 3 4 5" },
            { input: "1\n1\n1", expectedOutput: "1" },
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

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        // Write your code here
    }
};

int main() {
    int n; if (!(cin >> n)) return 0;
    ListNode* dummy = new ListNode(0);
    ListNode* curr = dummy;
    for(int i=0; i<n; ++i) {
        int x; cin >> x;
        curr->next = new ListNode(x);
        curr = curr->next;
    }
    int k; cin >> k;
    
    Solution sol;
    ListNode* res = sol.reverseKGroup(dummy->next, k);
    while (res != nullptr) {
        cout << res->val << (res->next ? " " : "");
        res = res->next;
    }
    cout << endl;
    return 0;
}`,
        editorial: `### Approach
Check if there are at least \`k\` nodes left. If so, reverse the next \`k\` nodes, and link the boundary correctly. The old head of this group becomes the new tail of this group. Recursively process the remainder, attaching it to this new tail.

### Complexity
Time: O(N), Space: O(N/K) recursion stack or O(1) if iteratively done.`,
        acceptanceRate: 0.56,
    },
    {
        id: "minimum-window-substring",
        title: "Minimum Window Substring",
        difficulty: "Hard",
        category: "Sliding Window",
        tags: ["hash-table", "string", "sliding-window"],
        description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (**including duplicates**) is included in the window. If there is no such substring, return the empty string \`""\`.

The testcases will be generated such that the answer is **unique**.`,
        constraints: [
            "m == s.length",
            "n == t.length",
            "1 <= m, n <= 10^5",
            "s and t consist of uppercase and lowercase English letters.",
        ],
        examples: [
            {
                input: "s = \"ADOBECODEBANC\", t = \"ABC\"",
                output: "\"BANC\"",
                explanation: "The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t.",
            },
            {
                input: "s = \"a\", t = \"a\"",
                output: "\"a\"",
            },
            {
                input: "s = \"a\", t = \"aa\"",
                output: "\"\"",
                explanation: "Both 'a's from t must be included in the window. Since the largest window of s only has one 'a', return empty string.",
            },
        ],
        testCases: [
            { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC" },
            { input: "a\na", expectedOutput: "a" },
            { input: "a\naa", expectedOutput: "" },
            { input: "ab\nb", expectedOutput: "b" },
            { input: "abc\ncba", expectedOutput: "abc" },
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
    string minWindow(string s, string t) {
        // Write your code here
    }
};

int main() {
    string s, t; 
    if (!(cin >> s >> t)) return 0;
    Solution sol;
    cout << sol.minWindow(s, t) << endl;
    return 0;
}`,
        editorial: `### Approach
Sliding Window. Track frequency of needed characters from \`t\`. Expand window by moving \`right\` until all characters are found. Then progressively shrink the window by moving \`left\` as long as the window still covers all requirement characters, noting the minimum size window.

### Complexity
Time: O(M + N), Space: O(1) (size of character set is constant, 128 or 256).`,
        acceptanceRate: 0.41,
    },
    {
        id: "largest-rectangle-in-histogram",
        title: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        category: "Stack",
        tags: ["array", "stack", "monotonic-stack"],
        description: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is \`1\`, return the area of the largest rectangle in the histogram.`,
        constraints: [
            "1 <= heights.length <= 10^5",
            "0 <= heights[i] <= 10^4",
        ],
        examples: [
            {
                input: "heights = [2,1,5,6,2,3]",
                output: "10",
                explanation: "The largest rectangle is shown in the red area, which has an area = 10 units.",
            },
            {
                input: "heights = [2,4]",
                output: "4",
            },
        ],
        testCases: [
            { input: "6\n2 1 5 6 2 3", expectedOutput: "10" },
            { input: "2\n2 4", expectedOutput: "4" },
            { input: "1\n5", expectedOutput: "5" },
            { input: "3\n2 1 2", expectedOutput: "3" },
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
    int largestRectangleArea(vector<int>& heights) {
        // Write your code here
    }
};

int main() {
    int n; if (!(cin >> n)) return 0;
    vector<int> heights(n);
    for(int i=0; i<n; ++i) cin >> heights[i];
    Solution sol;
    cout << sol.largestRectangleArea(heights) << endl;
    return 0;
}`,
        editorial: `### Approach
Monotonic Stack. We want to find the first smaller element to the left and first smaller to the right for each bar, which define the maximum width for the height of that bar. Use a monotonically increasing stack to keep track of indices. When a shorter bar is encountered, pop from stack and compute area for the popped bar.

### Complexity
Time: O(N), Space: O(N)`,
        acceptanceRate: 0.43,
    },
    {
        id: "n-queens",
        title: "N-Queens",
        difficulty: "Hard",
        category: "Backtracking",
        tags: ["array", "backtracking"],
        description: `The **n-queens** puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other.

Given an integer \`n\`, return all distinct solutions to the **n-queens puzzle**. You may return the answer in **any order**.

Each solution contains a distinct board configuration of the n-queens' placement, where \`'Q'\` and \`'.'\` both indicate a queen and an empty space, respectively.`,
        constraints: [
            "1 <= n <= 9",
        ],
        examples: [
            {
                input: "n = 4",
                output: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
                explanation: "There exist two distinct solutions to the 4-queens puzzle.",
            },
            { input: "n = 1", output: "[[\"Q\"]]" },
        ],
        testCases: [
            { input: "4", expectedOutput: ".Q..\n...Q\nQ...\n..Q.\n---\n..Q.\nQ...\n...Q\n.Q..\n---" },
            { input: "1", expectedOutput: "Q\n---" },
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
    vector<vector<string>> solveNQueens(int n) {
        // Write your code here
    }
};

int main() {
    int n; if (!(cin >> n)) return 0;
    Solution sol;
    vector<vector<string>> res = sol.solveNQueens(n);
    sort(res.begin(), res.end());
    for(auto& b : res) {
        for(auto& row : b) {
            cout << row << "\\n";
        }
        cout << "---\\n";
    }
    return 0;
}`,
        editorial: `### Approach
Backtracking. Try placing a queen in each column of the current row. Use sets or boolean arrays to quickly track if a column, positive diagonal (row+col), or negative diagonal (row-col) is already occupied by a previously placed queen.

### Complexity
Time: O(N!), Space: O(N^2) for the board or O(N) using optimized sets.`,
        acceptanceRate: 0.65,
    },
    {
        id: "word-ladder",
        title: "Word Ladder",
        difficulty: "Hard",
        category: "Graphs",
        tags: ["hash-table", "string", "breadth-first-search"],
        description: `A transformation sequence from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s1 -> s2 -> ... -> sk\` such that:
* Every adjacent pair of words differs by a single letter.
* Every \`si\` for \`1 <= i <= k\` is in \`wordList\`. Note that \`beginWord\` does not need to be in \`wordList\`.
* \`sk == endWord\`

Given two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return the **number of words** in the **shortest transformation sequence** from \`beginWord\` to \`endWord\`, or \`0\` if no such sequence exists.`,
        constraints: [
            "1 <= beginWord.length <= 10",
            "endWord.length == beginWord.length",
            "1 <= wordList.length <= 5000",
            "wordList[i].length == beginWord.length",
            "beginWord, endWord, and wordList[i] consist of lowercase English letters.",
            "beginWord != endWord",
            "All the words in wordList are unique.",
        ],
        examples: [
            {
                input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
                output: "5",
                explanation: "One shortest transformation sequence is \"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> cog\", which is 5 words long.",
            },
            {
                input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
                output: "0",
                explanation: "The endWord \"cog\" is not in wordList, therefore there is no valid transformation sequence.",
            },
        ],
        testCases: [
            { input: "hit\ncog\n6\nhot dot dog lot log cog", expectedOutput: "5" },
            { input: "hit\ncog\n5\nhot dot dog lot log", expectedOutput: "0" },
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
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        // Write your code here
    }
};

int main() {
    string b, e; cin >> b >> e;
    int n; cin >> n;
    vector<string> w(n);
    for(int i=0; i<n; ++i) cin >> w[i];
    Solution sol;
    cout << sol.ladderLength(b, e, w) << endl;
    return 0;
}`,
        editorial: `### Approach
Breadth-First Search (BFS). Represent words as nodes and edges between words that differ by 1 character. Since we want the shortest path, we use BFS from \`beginWord\` while keeping track of the level (path length). To quickly check valid adjacent words, change each character of the current word with 'a'-'z' and check if it exists in the dictionary.

### Complexity
Time: O(M^2 * N), where M is word length and N is wordList size. Space: O(M * N) for dictionary lookup and queue.`,
        acceptanceRate: 0.38,
    }
];
