import { Problem } from "@/types";

export const medium2Problems: Problem[] = [
    {
        id: "permutations",
        title: "Permutations",
        difficulty: "Medium",
        category: "Backtracking",
        tags: ["array", "backtracking"],
        description: `Given an array \`nums\` of distinct integers, return all the possible permutations. You can return the answer in **any order**.`,
        constraints: [
            "1 <= nums.length <= 6",
            "-10 <= nums[i] <= 10",
            "All the integers of nums are unique.",
        ],
        examples: [
            {
                input: "nums = [1,2,3]",
                output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
            },
            { input: "nums = [0,1]", output: "[[0,1],[1,0]]" },
        ],
        testCases: [
            { input: "3\n1 2 3", expectedOutput: "1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1" },
            { input: "2\n0 1", expectedOutput: "0 1\n1 0" },
            { input: "1\n1", expectedOutput: "1" },
            { input: "4\n4 3 2 1", expectedOutput: "1 2 3 4\n1 2 4 3\n1 3 2 4\n1 3 4 2\n1 4 2 3\n1 4 3 2\n2 1 3 4\n2 1 4 3\n2 3 1 4\n2 3 4 1\n2 4 1 3\n2 4 3 1\n3 1 2 4\n3 1 4 2\n3 2 1 4\n3 2 4 1\n3 4 1 2\n3 4 2 1\n4 1 2 3\n4 1 3 2\n4 2 1 3\n4 2 3 1\n4 3 1 2\n4 3 2 1" },
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
    vector<vector<int>> permute(vector<int>& nums) {
        // Write your code here
    }
};

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for(int i=0; i<n; ++i) cin >> nums[i];
    Solution sol;
    vector<vector<int>> res = sol.permute(nums);
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
Backtracking. Select one choice out of the available elements, put it into the current permutation, then recursively call the function. Use a visited array, or simply swap elements in-place to avoid extra space for the \`visited\` array.

### Complexity
Time: O(N * N!), Space: O(N) for recursion stack.`,
        acceptanceRate: 0.78,
    },
    {
        id: "rotate-image",
        title: "Rotate Image",
        difficulty: "Medium",
        category: "Math & Geometry",
        tags: ["array", "math", "matrix"],
        description: `You are given an \`n x n\` 2D \`matrix\` representing an image, rotate the image by **90** degrees (clockwise).

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.`,
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
            { input: "2\n1 2\n3 4", expectedOutput: "3 1\n4 2" },
            { input: "1\n1", expectedOutput: "1" },
            { input: "4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16", expectedOutput: "15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11" },
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
        // Write your code here
    }
};

int main() {
    int n; cin >> n;
    vector<vector<int>> matrix(n, vector<int>(n));
    for(int i=0; i<n; ++i) {
        for(int j=0; j<n; ++j) {
            cin >> matrix[i][j];
        }
    }
    Solution sol;
    sol.rotate(matrix);
    for(int i=0; i<n; ++i) {
        for(int j=0; j<n; ++j) {
            cout << matrix[i][j] << (j+1==n?"":" ");
        }
        cout << "\\n";
    }
    return 0;
}`,
        editorial: `### Approach
A common trick to rotate a matrix by 90 degrees clockwise in-place is to perform two reflections. 
1. Transpose the matrix (swap \`matrix[i][j]\` with \`matrix[j][i]\`).
2. Reverse each row of the matrix.

### Complexity
Time: O(N^2), Space: O(1)`,
        acceptanceRate: 0.73,
    },
    {
        id: "group-anagrams",
        title: "Group Anagrams",
        difficulty: "Medium",
        category: "Arrays & Hashing",
        tags: ["array", "hash-table", "string", "sorting"],
        description: `Given an array of strings \`strs\`, group **the anagrams** together. You can return the answer in **any order**.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
        constraints: [
            "1 <= strs.length <= 10^4",
            "0 <= strs[i].length <= 100",
            "strs[i] consists of lowercase English letters.",
        ],
        examples: [
            {
                input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
                output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
            },
            { input: "strs = [\"\"]", output: "[[\"\"]]" },
            { input: "strs = [\"a\"]", output: "[[\"a\"]]" },
        ],
        testCases: [
            { input: "6\neat tea tan ate nat bat", expectedOutput: "ate eat tea\nbat\nnat tan" },
            { input: "1\na", expectedOutput: "a" },
            { input: "3\na b c", expectedOutput: "a\nb\nc" },
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
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Write your code here
    }
};

int main() {
    int n; 
    if (!(cin >> n)) return 0;
    vector<string> strs(n);
    for(int i=0; i<n; ++i) {
        cin >> strs[i];
    }
    Solution sol;
    vector<vector<string>> res = sol.groupAnagrams(strs);
    for(auto& group : res) sort(group.begin(), group.end());
    sort(res.begin(), res.end());
    for(auto& group : res) {
        for(int i=0; i<group.size(); ++i) {
            cout << group[i] << (i+1==group.size()?"":" ");
        }
        cout << "\\n";
    }
    return 0;
}`,
        editorial: `### Approach
Use a hash map where the key is a sorted version of the string (or an array representing character counts), and the value is a list of strings that match that key. Because anagrams have identical character counts, they will produce the same sorted string/count array, and thus cluster in the same hash map bucket.

### Complexity
Time: O(N * K log K) where N is number of strings and K is max length of string. Or O(N * K) if counting sort is used. Space: O(N * K).`,
        acceptanceRate: 0.67,
    },
    {
        id: "maximum-subarray",
        title: "Maximum Subarray",
        difficulty: "Medium",
        category: "Arrays & Hashing",
        tags: ["array", "divide-and-conquer", "dynamic-programming"],
        description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
        constraints: [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4",
        ],
        examples: [
            {
                input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                output: "6",
                explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
            },
            { input: "nums = [1]", output: "1" },
            { input: "nums = [5,4,-1,7,8]", output: "23" },
        ],
        testCases: [
            { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
            { input: "1\n1", expectedOutput: "1" },
            { input: "5\n5 4 -1 7 8", expectedOutput: "23" },
            { input: "3\n-1 -2 -3", expectedOutput: "-1" },
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
    int maxSubArray(vector<int>& nums) {
        // Write your code here
    }
};

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int i=0; i<n; ++i) cin >> nums[i];
    Solution sol;
    cout << sol.maxSubArray(nums) << endl;
    return 0;
}`,
        editorial: `### Approach
Kadane's Algorithm. Iterate the array while keeping a running sum. If the running sum ever dips below 0, reset it to 0, because a negative prefix will only drag down any subsequent contiguous sequence. Keep track of the max sum encountered so far.

### Complexity
Time: O(N), Space: O(1)`,
        acceptanceRate: 0.50,
    },
    {
        id: "spiral-matrix",
        title: "Spiral Matrix",
        difficulty: "Medium",
        category: "Math & Geometry",
        tags: ["array", "matrix", "simulation"],
        description: `Given an \`m x n\` \`matrix\`, return all elements of the \`matrix\` in spiral order.`,
        constraints: [
            "m == matrix.length",
            "n == matrix[i].length",
            "1 <= m, n <= 10",
            "-100 <= matrix[i][j] <= 100",
        ],
        examples: [
            {
                input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
                output: "[1,2,3,6,9,8,7,4,5]",
            },
            {
                input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
                output: "[1,2,3,4,8,12,11,10,9,5,6,7]",
            },
        ],
        testCases: [
            { input: "3 3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "1 2 3 6 9 8 7 4 5" },
            { input: "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12", expectedOutput: "1 2 3 4 8 12 11 10 9 5 6 7" },
            { input: "1 1\n1", expectedOutput: "1" },
            { input: "2 1\n1\n2", expectedOutput: "1 2" },
            { input: "1 3\n1 2 3", expectedOutput: "1 2 3" },
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
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        // Write your code here
    }
};

int main() {
    int m, n; cin >> m >> n;
    vector<vector<int>> matrix(m, vector<int>(n));
    for(int i=0; i<m; ++i) {
        for(int j=0; j<n; ++j) {
            cin >> matrix[i][j];
        }
    }
    Solution sol;
    vector<int> res = sol.spiralOrder(matrix);
    for(int i=0; i<res.size(); ++i) {
        cout << res[i] << (i+1==res.size()?"":" ");
    }
    cout << "\\n";
    return 0;
}`,
        editorial: `### Approach
Maintain four pointers marking the boundaries of the unvisited part of the matrix: \`top\`, \`bottom\`, \`left\`, and \`right\`. Simulate the spiral traversal layer by layer (right, down, left, up). Make sure to properly adjust the boundary pointers after finishing a side and verify boundaries haven't crossed each other.

### Complexity
Time: O(M * N), Space: O(1) (excluding result array).`,
        acceptanceRate: 0.48,
    },
    {
        id: "jump-game",
        title: "Jump Game",
        difficulty: "Medium",
        category: "Greedy",
        tags: ["array", "dynamic-programming", "greedy"],
        description: `You are given an integer array \`nums\`. You are initially positioned at the array's **first index**, and each element in the array represents your maximum jump length at that position.

Return \`true\` if you can reach the last index, or \`false\` otherwise.`,
        constraints: [
            "1 <= nums.length <= 10^4",
            "0 <= nums[i] <= 10^5",
        ],
        examples: [
            {
                input: "nums = [2,3,1,1,4]",
                output: "true",
                explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index.",
            },
            {
                input: "nums = [3,2,1,0,4]",
                output: "false",
                explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.",
            },
        ],
        testCases: [
            { input: "5\n2 3 1 1 4", expectedOutput: "1" },
            { input: "5\n3 2 1 0 4", expectedOutput: "0" },
            { input: "1\n0", expectedOutput: "1" },
            { input: "4\n1 1 1 1", expectedOutput: "1" },
            { input: "4\n0 1 1 1", expectedOutput: "0" },
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
    bool canJump(vector<int>& nums) {
        // Write your code here
    }
};

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for(int i=0; i<n; ++i) cin >> nums[i];
    Solution sol;
    cout << sol.canJump(nums) << endl;
    return 0;
}`,
        editorial: `### Approach
Greedy solution. Start from the last index and maintain the "goal" index needed to reach the end. Iterate backwards through the array. If the current index plus its maximum jump can reach the goal, update the goal to the current index. At the end, if the goal reached index 0, return true. Alternatively, go forwards and maintain the "farthest reachable index".

### Complexity
Time: O(N), Space: O(1)`,
        acceptanceRate: 0.38,
    },
    {
        id: "merge-intervals",
        title: "Merge Intervals",
        difficulty: "Medium",
        category: "Intervals",
        tags: ["array", "sorting"],
        description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
        constraints: [
            "1 <= intervals.length <= 10^4",
            "intervals[i].length == 2",
            "0 <= starti <= endi <= 10^4",
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
            { input: "3\n1 4\n0 4\n2 5", expectedOutput: "0 5" },
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
        // Write your code here
    }
};

int main() {
    int n; cin >> n;
    vector<vector<int>> intervals(n, vector<int>(2));
    for(int i=0; i<n; ++i) {
        cin >> intervals[i][0] >> intervals[i][1];
    }
    Solution sol;
    vector<vector<int>> res = sol.merge(intervals);
    for(auto& r : res) cout << r[0] << " " << r[1] << "\\n";
    return 0;
}`,
        editorial: `### Approach
Sort the intervals by their start time. Iterate through the intervals, maintaining a list of merged intervals. If the current interval's start time is less than or equal to the last merged interval's end time, they overlap, so update the last merged interval's end time with the \`max(end, current.end)\`. Otherwise, add the current interval to the list.

### Complexity
Time: O(N log N) for sorting, Space: O(1) or O(N) depending if sort occurs in-place.`,
        acceptanceRate: 0.46,
    },
    {
        id: "insert-interval",
        title: "Insert Interval",
        difficulty: "Medium",
        category: "Intervals",
        tags: ["array"],
        description: `You are given an array of non-overlapping intervals \`intervals\` where \`intervals[i] = [starti, endi]\` represent the start and the end of the \`ith\` interval and \`intervals\` is sorted in ascending order by \`starti\`. You are also given an interval \`newInterval = [start, end]\` that represents the start and end of another interval.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`starti\` and \`intervals\` still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return \`intervals\` after the insertion.`,
        constraints: [
            "0 <= intervals.length <= 10^4",
            "intervals[i].length == 2",
            "0 <= starti <= endi <= 10^5",
            "intervals is sorted by starti in ascending order.",
            "newInterval.length == 2",
            "0 <= start <= end <= 10^5",
        ],
        examples: [
            {
                input: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
                output: "[[1,5],[6,9]]",
            },
            {
                input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",
                output: "[[1,2],[3,10],[12,16]]",
                explanation: "Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].",
            },
        ],
        testCases: [
            { input: "2\n1 3\n6 9\n2 5", expectedOutput: "1 5\n6 9" },
            { input: "5\n1 2\n3 5\n6 7\n8 10\n12 16\n4 8", expectedOutput: "1 2\n3 10\n12 16" },
            { input: "0\n\n5 7", expectedOutput: "5 7" },
            { input: "1\n1 5\n2 3", expectedOutput: "1 5" },
            { input: "1\n1 5\n6 8", expectedOutput: "1 5\n6 8" },
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
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        // Write your code here
    }
};

int main() {
    int n; cin >> n;
    vector<vector<int>> intervals(n, vector<int>(2));
    for(int i=0; i<n; ++i) {
        cin >> intervals[i][0] >> intervals[i][1];
    }
    vector<int> newInte(2);
    cin >> newInte[0] >> newInte[1];
    
    Solution sol;
    vector<vector<int>> res = sol.insert(intervals, newInte);
    for(auto& r : res) cout << r[0] << " " << r[1] << "\\n";
    return 0;
}`,
        editorial: `### Approach
Because the input is already sorted, you can do this in linear time without calling \`sort()\`. 
1. Iterate while \`current.end < new.start\` and add to result (these come entirely before).
2. Iterate while \`current.start <= new.end\`, merging them into \`newInterval\` by taking the min of starts and max of ends. Add the fully merged \`newInterval\` to result.
3. Add the rest of the intervals.

### Complexity
Time: O(N), Space: O(1) (excluding result array).`,
        acceptanceRate: 0.39,
    },
    {
        id: "unique-paths",
        title: "Unique Paths",
        difficulty: "Medium",
        category: "Dynamic Programming",
        tags: ["math", "dynamic-programming", "combinatorics"],
        description: `There is a robot on an \`m x n\` grid. The robot is initially located at the **top-left corner** (i.e., \`grid[0][0]\`). The robot tries to move to the **bottom-right corner** (i.e., \`grid[m - 1][n - 1]\`). The robot can only move either down or right at any point in time.

Given the two integers \`m\` and \`n\`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.

The test cases are generated so that the answer will be less than or equal to \`2 * 10^9\`.`,
        constraints: [
            "1 <= m, n <= 100",
        ],
        examples: [
            {
                input: "m = 3, n = 7",
                output: "28",
            },
            {
                input: "m = 3, n = 2",
                output: "3",
                explanation: "1. Right -> Down -> Down\\n2. Down -> Down -> Right\\n3. Down -> Right -> Down",
            },
        ],
        testCases: [
            { input: "3 7", expectedOutput: "28" },
            { input: "3 2", expectedOutput: "3" },
            { input: "1 1", expectedOutput: "1" },
            { input: "10 10", expectedOutput: "48620" },
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
    int uniquePaths(int m, int n) {
        // Write your code here
    }
};

int main() {
    int m, n; cin >> m >> n;
    Solution sol;
    cout << sol.uniquePaths(m, n) << endl;
    return 0;
}`,
        editorial: `### Approach
Dynamic Programming. Create a 2D \`dp\` array of size \`m x n\`. \`dp[i][j]\` represents the number of paths to cell \`(i,j)\`. Since we can only move right or down, \`dp[i][j] = dp[i-1][j] + dp[i][j-1]\`. The first row and column are all 1s. This can be memory-optimized to O(N) by just keeping one row. Alternatively, use combinations math: (M+N-2) choose (M-1).

### Complexity
Time: O(M * N), Space: O(N) using optimized DP array.`,
        acceptanceRate: 0.63,
    },
    {
        id: "minimum-path-sum",
        title: "Minimum Path Sum",
        difficulty: "Medium",
        category: "Dynamic Programming",
        tags: ["array", "dynamic-programming", "matrix"],
        description: `Given a \`m x n\` \`grid\` filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path.

Note: You can only move either down or right at any point in time.`,
        constraints: [
            "m == grid.length",
            "n == grid[i].length",
            "1 <= m, n <= 200",
            "0 <= grid[i][j] <= 200",
        ],
        examples: [
            {
                input: "grid = [[1,3,1],[1,5,1],[4,2,1]]",
                output: "7",
                explanation: "Because the path 1 -> 3 -> 1 -> 1 -> 1 minimizes the sum.",
            },
            {
                input: "grid = [[1,2,3],[4,5,6]]",
                output: "12",
            },
        ],
        testCases: [
            { input: "3 3\n1 3 1\n1 5 1\n4 2 1", expectedOutput: "7" },
            { input: "2 3\n1 2 3\n4 5 6", expectedOutput: "12" },
            { input: "1 1\n5", expectedOutput: "5" },
            { input: "2 2\n1 4\n2 3", expectedOutput: "6" },
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
    int minPathSum(vector<vector<int>>& grid) {
        // Write your code here
    }
};

int main() {
    int m, n; cin >> m >> n;
    vector<vector<int>> grid(m, vector<int>(n));
    for(int i=0; i<m; ++i) {
        for(int j=0; j<n; ++j) cin >> grid[i][j];
    }
    Solution sol;
    cout << sol.minPathSum(grid) << endl;
    return 0;
}`,
        editorial: `### Approach
Dynamic Programming. Similar to Unique Paths, we can determine the shortest distance to cell \`(i, j)\` by looking at the shortest distances to its top and left neighbors. \`dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])\`. We can do this in-place directly on the \`grid\`.

### Complexity
Time: O(M * N), Space: O(1) if mutated in-place.`,
        acceptanceRate: 0.62,
    }
];
