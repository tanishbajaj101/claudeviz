import type { Problem } from "@algoarena/shared";

export const easyProblems: Problem[] = [
    {
        id: "two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        category: "Arrays & Hashing",
        tags: ["array", "hash-table"],
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists.",
        ],
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
            { input: "nums = [3,3], target = 6", output: "[0,1]" },
        ],
        testCases: [
            { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
            { input: "3\n3 2 4\n6", expectedOutput: "1 2" },
            { input: "2\n3 3\n6", expectedOutput: "0 1" },
            { input: "4\n1 5 3 7\n8", expectedOutput: "1 2" },
            { input: "5\n-1 -2 -3 -4 -5\n-8", expectedOutput: "2 4" },
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
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    Solution sol;
    vector<int> result = sol.twoSum(nums, target);
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << " ";
        cout << result[i];
    }
    cout << endl;
    return 0;
}`,
        editorial: `### Brute Force
Check every pair — O(n²).

### Optimized: Hash Map
For each element, check if (target - element) exists in a map of already-seen values. Single pass — O(n).

### Key Insight
Complement lookup: instead of searching forward, look backward in a map of seen values.`,
        acceptanceRate: 0.52,
    },
    {
        id: "binary-search",
        title: "Binary Search",
        difficulty: "Easy",
        category: "Binary Search",
        tags: ["array", "binary-search"],
        description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with O(log n) runtime complexity.`,
        constraints: [
            "1 <= nums.length <= 10^4",
            "-10^4 < nums[i], target < 10^4",
            "All integers in nums are unique.",
            "nums is sorted in ascending order.",
        ],
        examples: [
            {
                input: "nums = [-1,0,3,5,9,12], target = 9",
                output: "4",
                explanation: "9 exists in nums and its index is 4.",
            },
            {
                input: "nums = [-1,0,3,5,9,12], target = 2",
                output: "-1",
                explanation: "2 does not exist in nums so return -1.",
            },
        ],
        testCases: [
            { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4" },
            { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1" },
            { input: "1\n5\n5", expectedOutput: "0" },
            { input: "1\n5\n-5", expectedOutput: "-1" },
            { input: "5\n2 5 8 12 16\n16", expectedOutput: "4" },
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
        // Write your code here
    }
};

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    Solution sol;
    cout << sol.search(nums, target) << endl;
    return 0;
}`,
        editorial: `### Approach
Standard binary search on sorted array.

1. Set lo=0, hi=n-1
2. While lo <= hi: mid = (lo+hi)/2
3. If nums[mid] == target → return mid
4. If nums[mid] < target → lo = mid+1
5. Else → hi = mid-1
6. Return -1 if not found

### Complexity
Time: O(log n), Space: O(1)

### Common Mistakes
- Using lo < hi instead of lo <= hi (misses single-element case)
- Integer overflow in (lo+hi)/2 — use lo + (hi-lo)/2`,
        acceptanceRate: 0.58,
    },
    {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        category: "Stack",
        tags: ["string", "stack"],
        description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
        constraints: [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'.",
        ],
        examples: [
            { input: "s = \"()\"", output: "true" },
            { input: "s = \"()[]{}\"", output: "true" },
            { input: "s = \"(]\"", output: "false" },
        ],
        testCases: [
            { input: "()", expectedOutput: "1" },
            { input: "()[]{}", expectedOutput: "1" },
            { input: "(]", expectedOutput: "0" },
            { input: "([)]", expectedOutput: "0" },
            { input: "{[]}", expectedOutput: "1" },
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
    bool isValid(string s) {
        // Write your code here
    }
};

int main() {
    string s;
    cin >> s;

    Solution sol;
    cout << sol.isValid(s) << endl;
    return 0;
}`,
        editorial: `### Approach
Use a Stack to keep track of opening brackets.

1. Loop through the string.
2. If it is an opening bracket, push it to the stack.
3. If it is a closing bracket, check if the stack is not empty and the top of the stack is the matching opening bracket. If yes, pop it. Otherwise, return false.
4. Return true if the stack is empty at the end.

### Complexity
Time: O(n), Space: O(n)`,
        acceptanceRate: 0.40,
    },
    {
        id: "merge-two-sorted-lists",
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        category: "Linked List",
        tags: ["linked-list"],
        description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
        constraints: [
            "The number of nodes in both lists is in the range [0, 50].",
            "-100 <= Node.val <= 100",
            "Both list1 and list2 are sorted in non-decreasing order.",
        ],
        examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
            { input: "list1 = [], list2 = []", output: "[]" },
            { input: "list1 = [], list2 = [0]", output: "[0]" },
        ],
        testCases: [
            { input: "3\n1 2 4\n3\n1 3 4", expectedOutput: "1 1 2 3 4 4" },
            { input: "0\n\n0\n", expectedOutput: "" },
            { input: "0\n\n1\n0", expectedOutput: "0" },
            { input: "1\n5\n3\n1 2 4", expectedOutput: "1 2 4 5" },
            { input: "3\n1 2 3\n1\n4", expectedOutput: "1 2 3 4" },
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
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Write your code here
    }
};

int main() {
    int n1;
    cin >> n1;
    ListNode* dummy1 = new ListNode(0);
    ListNode* curr1 = dummy1;
    for(int i=0; i<n1; ++i) {
        int x; cin >> x;
        curr1->next = new ListNode(x);
        curr1 = curr1->next;
    }
    
    int n2;
    cin >> n2;
    ListNode* dummy2 = new ListNode(0);
    ListNode* curr2 = dummy2;
    for(int i=0; i<n2; ++i) {
        int x; cin >> x;
        curr2->next = new ListNode(x);
        curr2 = curr2->next;
    }

    Solution sol;
    ListNode* head = sol.mergeTwoLists(dummy1->next, dummy2->next);
    while (head != nullptr) {
        cout << head->val << (head->next ? " " : "");
        head = head->next;
    }
    cout << endl;
    return 0;
}`,
        editorial: `### Approach
Use a dummy node to form the new list.

Iterate until both lists are exhausted. At each step, compare the values of both lists. Attach the smaller value node to the trailing node of the new list, and move the pointer of the selected list forward. At the end, if any of the list is not fully consumed, attach the rest of that list to the result.

### Complexity
Time: O(n + m), Space: O(1)`,
        acceptanceRate: 0.63,
    },
    {
        id: "best-time-to-buy-and-sell-stock",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        category: "Arrays & Hashing",
        tags: ["array", "dynamic-programming"],
        description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
        constraints: [
            "1 <= prices.length <= 10^5",
            "0 <= prices[i] <= 10^4",
        ],
        examples: [
            {
                input: "prices = [7,1,5,3,6,4]",
                output: "5",
                explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
            },
            {
                input: "prices = [7,6,4,3,1]",
                output: "0",
                explanation: "In this case, no transactions are done and the max profit = 0.",
            },
        ],
        testCases: [
            { input: "6\n7 1 5 3 6 4", expectedOutput: "5" },
            { input: "5\n7 6 4 3 1", expectedOutput: "0" },
            { input: "2\n1 2", expectedOutput: "1" },
            { input: "2\n2 1", expectedOutput: "0" },
            { input: "3\n2 4 1", expectedOutput: "2" },
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
    int maxProfit(vector<int>& prices) {
        // Write your code here
    }
};

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for(int i=0; i<n; ++i) cin >> prices[i];

    Solution sol;
    cout << sol.maxProfit(prices) << endl;
    return 0;
}`,
        editorial: `### Approach
Keep track of the minimum price seen so far as you iterate through the prices. Calculate the potential profit if we sold at the current day's price, and update the maximum profit seen so far.

### Complexity
Time: O(n), Space: O(1)`,
        acceptanceRate: 0.54,
    }
];
