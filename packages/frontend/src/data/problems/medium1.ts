import { Problem } from "@/types";

export const medium1Problems: Problem[] = [
    {
        id: "add-two-numbers",
        title: "Add Two Numbers",
        difficulty: "Medium",
        category: "Linked List",
        tags: ["linked-list", "math"],
        description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
        constraints: [
            "The number of nodes in each linked list is in the range [1, 100].",
            "0 <= Node.val <= 9",
            "It is guaranteed that the list represents a number that does not have leading zeros.",
        ],
        examples: [
            {
                input: "l1 = [2,4,3], l2 = [5,6,4]",
                output: "[7,0,8]",
                explanation: "342 + 465 = 807.",
            },
            { input: "l1 = [0], l2 = [0]", output: "[0]" },
            { input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", output: "[8,9,9,9,0,0,0,1]" },
        ],
        testCases: [
            { input: "3\n2 4 3\n3\n5 6 4", expectedOutput: "7 0 8" },
            { input: "1\n0\n1\n0", expectedOutput: "0" },
            { input: "7\n9 9 9 9 9 9 9\n4\n9 9 9 9", expectedOutput: "8 9 9 9 0 0 0 1" },
            { input: "2\n1 8\n1\n0", expectedOutput: "1 8" },
            { input: "2\n5 5\n2\n5 5", expectedOutput: "0 1 1" },
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
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
            }
};

int main() {
    int n1; cin >> n1;
    ListNode* dummy1 = new ListNode(0);
    ListNode* curr1 = dummy1;
    for(int i=0; i<n1; ++i) {
        int x; cin >> x;
        curr1->next = new ListNode(x);
        curr1 = curr1->next;
    }
    
    int n2; cin >> n2;
    ListNode* dummy2 = new ListNode(0);
    ListNode* curr2 = dummy2;
    for(int i=0; i<n2; ++i) {
        int x; cin >> x;
        curr2->next = new ListNode(x);
        curr2 = curr2->next;
    }

    Solution sol;
    ListNode* res = sol.addTwoNumbers(dummy1->next, dummy2->next);
    while (res != nullptr) {
        cout << res->val << (res->next ? " " : "");
        res = res->next;
    }
    cout << endl;
    return 0;
}`,
        editorial: `### Approach
Simulate addition digit by digit. Maintain a carry to add to the next positional value. Handle edge cases where one list is longer or where a carry is remaining after both lists are exhausted.

### Complexity
Time: O(max(N, M)), Space: O(max(N, M)) for result list.`,
        acceptanceRate: 0.42,
    },
    {
        id: "longest-substring-without-repeating-characters",
        title: "Longest Substring Without Repeating",
        difficulty: "Medium",
        category: "Sliding Window",
        tags: ["hash-table", "string", "sliding-window"],
        description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
        constraints: [
            "0 <= s.length <= 5 * 10^4",
            "s consists of English letters, digits, symbols and spaces.",
        ],
        examples: [
            {
                input: "s = \"abcabcbb\"",
                output: "3",
                explanation: "The answer is \"abc\", with the length of 3.",
            },
            {
                input: "s = \"bbbbb\"",
                output: "1",
                explanation: "The answer is \"b\", with the length of 1.",
            },
            {
                input: "s = \"pwwkew\"",
                output: "3",
                explanation: "The answer is \"wke\", with the length of 3.",
            },
        ],
        testCases: [
            { input: "abcabcbb", expectedOutput: "3" },
            { input: "bbbbb", expectedOutput: "1" },
            { input: "pwwkew", expectedOutput: "3" },
            { input: "a", expectedOutput: "1" },
            { input: "au", expectedOutput: "2" },
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
    int lengthOfLongestSubstring(string s) {
            }
};

int main() {
    string s;
    if (!(cin >> s)) s = "";
    Solution sol;
    cout << sol.lengthOfLongestSubstring(s) << endl;
    return 0;
}`,
        editorial: `### Approach
Use sliding window technique combined with a character index map. Maintain a \`left\` and \`right\` pointer. If character at \`right\` is already in map and its recorded index >= \`left\`, advance \`left\` to recorded index + 1. Update the map with \`right\` index and calculate max length.

### Complexity
Time: O(n), Space: O(1) (charset size is 256).`,
        acceptanceRate: 0.34,
    },
    {
        id: "longest-palindromic-substring",
        title: "Longest Palindromic Substring",
        difficulty: "Medium",
        category: "Dynamic Programming",
        tags: ["string", "dynamic-programming"],
        description: `Given a string \`s\`, return the longest palindromic substring in \`s\`.`,
        constraints: [
            "1 <= s.length <= 1000",
            "s consist of only digits and English letters.",
        ],
        examples: [
            {
                input: "s = \"babad\"",
                output: "\"bab\"",
                explanation: "\"bab\" is also a valid answer.",
            },
            {
                input: "s = \"cbbd\"",
                output: "\"bb\"",
            },
        ],
        testCases: [
            { input: "babad", expectedOutput: "bab" },
            { input: "cbbd", expectedOutput: "bb" },
            { input: "a", expectedOutput: "a" },
            { input: "ac", expectedOutput: "a" },
            { input: "racecar", expectedOutput: "racecar" },
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
    string longestPalindrome(string s) {
            }
};

int main() {
    string s;
    cin >> s;
    Solution sol;
    cout << sol.longestPalindrome(s) << endl;
    return 0;
}`,
        editorial: `### Approach
Method 1: Expand around center. Loop through each character, treating it as center for odd length palindromes and even length palindromes, expanding outwards as long as it matches. Track the max length found. O(N^2) time, O(1) space.
Method 2: DP where dp[i][j] is true if s[i..j] is palindrome. O(N^2) time & space.`,
        acceptanceRate: 0.33,
    },
    {
        id: "container-with-most-water",
        title: "Container With Most Water",
        difficulty: "Medium",
        category: "Two Pointers",
        tags: ["array", "two-pointers", "greedy"],
        description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`ith\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
        constraints: [
            "n == height.length",
            "2 <= n <= 10^5",
            "0 <= height[i] <= 10^4",
        ],
        examples: [
            {
                input: "height = [1,8,6,2,5,4,8,3,7]",
                output: "49",
                explanation: "The vertical lines are at indices 1 and 8, water height is min(8,7)=7, distance is 7 so area = 49.",
            },
            { input: "height = [1,1]", output: "1" },
        ],
        testCases: [
            { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
            { input: "2\n1 1", expectedOutput: "1" },
            { input: "3\n4 3 2", expectedOutput: "4" },
            { input: "3\n1 2 1", expectedOutput: "2" },
            { input: "5\n1 2 4 3 1", expectedOutput: "4" },
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
    int maxArea(vector<int>& height) {
            }
};

int main() {
    int n;
    cin >> n;
    vector<int> h(n);
    for(int i=0; i<n; ++i) cin >> h[i];
    Solution sol;
    cout << sol.maxArea(h) << endl;
    return 0;
}`,
        editorial: `### Approach
Two pointers technique. Start with largest width (pointers at start and end). The area is limited by shortest line. Thus, move the pointer pointing to the shorter line inward, hoping to find a taller line to compensate for decreased width. Evaluate and update max area simultaneously.

### Complexity
Time: O(n), Space: O(1)`,
        acceptanceRate: 0.54,
    },
    {
        id: "3sum",
        title: "3Sum",
        difficulty: "Medium",
        category: "Two Pointers",
        tags: ["array", "two-pointers", "sorting"],
        description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets. You can return the triplets in any order.`,
        constraints: [
            "3 <= nums.length <= 3000",
            "-10^5 <= nums[i] <= 10^5",
        ],
        examples: [
            {
                input: "nums = [-1,0,1,2,-1,-4]",
                output: "[[-1,-1,2],[-1,0,1]]",
            },
            { input: "nums = [0,1,1]", output: "[]" },
            { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
        ],
        testCases: [
            { input: "6\n-1 0 1 2 -1 -4", expectedOutput: "-1 -1 2\n-1 0 1" },
            { input: "3\n0 1 1", expectedOutput: "" },
            { input: "3\n0 0 0", expectedOutput: "0 0 0" },
            { input: "4\n-1 -1 2 0", expectedOutput: "-1 -1 2" },
            { input: "5\n-2 0 1 1 2", expectedOutput: "-2 0 2\n-2 1 1" },
        ],
        judge0Limits: {
            cpu_time_limit: 3,
            wall_time_limit: 5,
            memory_limit: 256000,
            stack_limit: 64000,
        },
        languageId: 54,
        starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
            }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for(int i=0; i<n; ++i) cin >> nums[i];
    Solution sol;
    vector<vector<int>> res = sol.threeSum(nums);
    // standardize output
    for (auto& row : res) sort(row.begin(), row.end());
    sort(res.begin(), res.end());
    for(auto& row : res) {
        cout << row[0] << " " << row[1] << " " << row[2] << "\\n";
    }
    return 0;
}`,
        editorial: `### Approach
Sort the array. Iterate through each element as the first element of triplet. Then, apply classic two pointer technique on remaining array for the two other elements to sum to 0. Skip duplicate elements to ensure unique triplets.

### Complexity
Time: O(n^2), Space: O(1) or O(n) depending on sorting implementation.`,
        acceptanceRate: 0.33,
    },
    {
        id: "letter-combinations-of-a-phone-number",
        title: "Letter Combinations of a Phone Number",
        difficulty: "Medium",
        category: "Backtracking",
        tags: ["hash-table", "string", "backtracking"],
        description: `Given a string containing digits from \`2-9\` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.

A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.
2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7: pqrs, 8: tuv, 9: wxyz`,
        constraints: [
            "0 <= digits.length <= 4",
            "digits[i] is a digit in the range ['2', '9'].",
        ],
        examples: [
            { input: "digits = \"23\"", output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]" },
            { input: "digits = \"\"", output: "[]" },
            { input: "digits = \"2\"", output: "[\"a\",\"b\",\"c\"]" },
        ],
        testCases: [
            { input: "23", expectedOutput: "ad ae af bd be bf cd ce cf" },
            { input: "\n", expectedOutput: "" },
            { input: "2", expectedOutput: "a b c" },
            { input: "9", expectedOutput: "w x y z" },
            { input: "56", expectedOutput: "jm jn jo km kn ko lm ln lo" },
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
    vector<string> letterCombinations(string digits) {
            }
};

int main() {
    string d;
    if (!(cin >> d)) {
        cout << endl;
        return 0;
    }
    Solution sol;
    vector<string> res = sol.letterCombinations(d);
    sort(res.begin(), res.end());
    for(int i=0; i<res.size(); ++i) {
        cout << res[i] << (i + 1 == res.size() ? "" : " ");
    }
    cout << endl;
    return 0;
}`,
        editorial: `### Approach
Use backtracking to build the combinations length by length. Maintain a hashmap or array of digit-to-letter mappings. In backtrack function, loop through letters of current digit, append to current combination, and recurse for next digit.

### Complexity
Time: O(4^N * N), Space: O(N)`,
        acceptanceRate: 0.58,
    },
    {
        id: "remove-nth-node-from-end",
        title: "Remove Nth Node From End of List",
        difficulty: "Medium",
        category: "Linked List",
        tags: ["linked-list", "two-pointers"],
        description: `Given the \`head\` of a linked list, remove the \`nth\` node from the end of the list and return its head.`,
        constraints: [
            "The number of nodes in the list is sz.",
            "1 <= sz <= 30",
            "0 <= Node.val <= 100",
            "1 <= n <= sz",
        ],
        examples: [
            { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
            { input: "head = [1], n = 1", output: "[]" },
            { input: "head = [1,2], n = 1", output: "[1]" },
        ],
        testCases: [
            { input: "5\n1 2 3 4 5\n2", expectedOutput: "1 2 3 5" },
            { input: "1\n1\n1", expectedOutput: "" },
            { input: "2\n1 2\n1", expectedOutput: "1" },
            { input: "2\n1 2\n2", expectedOutput: "2" },
            { input: "4\n1 2 3 4\n4", expectedOutput: "2 3 4" },
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
    ListNode* removeNthFromEnd(ListNode* head, int n) {
            }
};

int main() {
    int sz; cin >> sz;
    ListNode* dummy = new ListNode(0);
    ListNode* curr = dummy;
    for(int i=0; i<sz; ++i) {
        int x; cin >> x;
        curr->next = new ListNode(x);
        curr = curr->next;
    }
    int n; cin >> n;
    
    Solution sol;
    ListNode* res = sol.removeNthFromEnd(dummy->next, n);
    while (res != nullptr) {
        cout << res->val << (res->next ? " " : "");
        res = res->next;
    }
    cout << endl;
    return 0;
}`,
        editorial: `### Approach
Use two pointers. Maintain a \`fast\` and a \`slow\` pointer, separate them by \`N\` nodes. Then advance both until \`fast\` reaches the end of list. \`slow\` will now point to node before the \`Nth\` node. Update \`slow->next\` to bypass \`Nth\` node. Handle edge cases like removing head pointer via a dummy node.

### Complexity
Time: O(L), Space: O(1)`,
        acceptanceRate: 0.44,
    },
    {
        id: "generate-parentheses",
        title: "Generate Parentheses",
        difficulty: "Medium",
        category: "Backtracking",
        tags: ["string", "dynamic-programming", "backtracking"],
        description: `Given \`n\` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.`,
        constraints: [
            "1 <= n <= 8",
        ],
        examples: [
            { input: "n = 3", output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" },
            { input: "n = 1", output: "[\"()\"]" },
        ],
        testCases: [
            { input: "3", expectedOutput: "((()))\n(()())\n(())()\n()(())\n()()()" },
            { input: "1", expectedOutput: "()" },
            { input: "2", expectedOutput: "(())\n()()" },
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
    vector<string> generateParenthesis(int n) {
            }
};

int main() {
    int n; cin >> n;
    Solution sol;
    vector<string> res = sol.generateParenthesis(n);
    sort(res.begin(), res.end(), [](const string& a, const string& b){return a > b;}); // standardized reverse sort
    for(const string& s : res) {
        cout << s << "\\n";
    }
    return 0;
}`,
        editorial: `### Approach
Backtracking. Maintain count of \`open\` and \`close\` parentheses placed so far. Base case: \`open == n\` and \`close == n\`. Try adding '(' if \`open < n\`. Try adding ')' if \`close < open\`.

### Complexity
Time: O(4^n / sqrt(n)), Space: O(4^n / sqrt(n))`,
        acceptanceRate: 0.73,
    },
    {
        id: "search-in-rotated-sorted-array",
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        category: "Binary Search",
        tags: ["array", "binary-search"],
        description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).
Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\` (1 <= k < nums.length) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\` (0-indexed).

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
        constraints: [
            "1 <= nums.length <= 5000",
            "-10^4 <= nums[i] <= 10^4",
            "All values of nums are unique.",
            "-10^4 <= target <= 10^4",
        ],
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
            { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
            { input: "nums = [1], target = 0", output: "-1" },
        ],
        testCases: [
            { input: "7\n4 5 6 7 0 1 2\n0", expectedOutput: "4" },
            { input: "7\n4 5 6 7 0 1 2\n3", expectedOutput: "-1" },
            { input: "1\n1\n0", expectedOutput: "-1" },
            { input: "2\n3 1\n1", expectedOutput: "1" },
            { input: "5\n5 1 2 3 4\n5", expectedOutput: "0" },
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
    int search(vector<int>& nums, int target) {
            }
};

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int i=0; i<n; ++i) cin >> nums[i];
    int t; cin >> t;
    Solution sol;
    cout << sol.search(nums, t) << endl;
    return 0;
}`,
        editorial: `### Approach
Binary Search. The array is split into two sorted halves. Find the middle element. Determine which half is strictly sorted (either left to mid, or mid to right). Then, check if \`target\` lies within the bounds of the strictly sorted half. If so, restrict search to that half. Otherwise, restrict search to the other half.

### Complexity
Time: O(log N), Space: O(1)`,
        acceptanceRate: 0.40,
    },
    {
        id: "combination-sum",
        title: "Combination Sum",
        difficulty: "Medium",
        category: "Backtracking",
        tags: ["array", "backtracking"],
        description: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in any order.

The same number may be chosen from \`candidates\` an unlimited number of times.`,
        constraints: [
            "1 <= candidates.length <= 30",
            "2 <= candidates[i] <= 40",
            "All elements of candidates are distinct.",
            "1 <= target <= 40",
        ],
        examples: [
            {
                input: "candidates = [2,3,6,7], target = 7",
                output: "[[2,2,3],[7]]",
            },
            {
                input: "candidates = [2,3,5], target = 8",
                output: "[[2,2,2,2],[2,3,3],[3,5]]",
            },
        ],
        testCases: [
            { input: "4\n2 3 6 7\n7", expectedOutput: "2 2 3\n7" },
            { input: "3\n2 3 5\n8", expectedOutput: "2 2 2 2\n2 3 3\n3 5" },
            { input: "1\n2\n1", expectedOutput: "" },
            { input: "2\n2 4\n6", expectedOutput: "2 2 2\n2 4" },
            { input: "3\n1 2 3\n3", expectedOutput: "1 1 1\n1 2\n3" },
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
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
            }
};

int main() {
    int n; cin >> n;
    vector<int> candidates(n);
    for(int i=0; i<n; ++i) cin >> candidates[i];
    int t; cin >> t;
    
    Solution sol;
    vector<vector<int>> res = sol.combinationSum(candidates, t);
    for(auto& r : res) sort(r.begin(), r.end());
    sort(res.begin(), res.end());
    for(auto& r : res) {
        for(int i=0; i<r.size(); ++i) {
            cout << r[i] << (i+1==r.size()?"":" ");
        }
        cout << "\\n";
    }
    return 0;
}`,
        editorial: `### Approach
Backtracking. For each element in \`candidates\`, branch execution to either include the element (which doesn't move index since unlimited uses are allowed) or skip the element (moves index forward). Track the running sum. Prune dead branches where sum exceeds target.

### Complexity
Time: O(N * 2^T), Space: O(T)`,
        acceptanceRate: 0.70,
    }
];
