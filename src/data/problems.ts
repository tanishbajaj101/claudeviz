import { Problem } from "@/types";

export const problems: Problem[] = [
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
];

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getProblems(): Problem[] {
  return problems;
}
