import { Problem } from "@algoarena/shared";

export const importedProblems: Problem[] = [
    {
        "id": "score-of-a-string",
        "title": "Score Of A String",
        "difficulty": "Easy",
        "category": "String",
        "tags": [
            "string"
        ],
        "description": "You are given a string s. The score of a string is defined as the sum of the absolute difference between the ASCII values of adjacent characters. Return the score of s.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"code\"",
                "output": "24",
                "explanation": ""
            },
            {
                "input": "s = \"neetcode\"",
                "output": "65",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "code",
                "expectedOutput": "24"
            },
            {
                "input": "neetcode",
                "expectedOutput": "65"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void scoreOfAString() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Iteration\n\nThe score of a string is defined as the sum of absolute differences between adjacent characters' ASCII values. Since we need to compare each character with its neighbor, we simply walk through the string once, computing the difference between consecutive characters and accumulating the result in res.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Off-by-One Error in Loop Bounds\nA frequent mistake is iterating to n instead of n - 1, causing an index out of bounds error when accessing s[i + 1]. Since you compare adjacent pairs, the loop should run from 0 to len(s) - 2 inclusive, processing n - 1 pairs for a string of length n. \n\n• Forgetting Absolute Value\nSome solutions subtract ASCII values without taking the absolute value, resulting in negative contributions to the score. The problem requires the sum of absolute differences, so always wrap the subtraction with abs() to handle cases where s[i] > s[i + 1]. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "concatenation-of-array",
        "title": "Concatenation Of Array",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array"
        ],
        "description": "You are given an integer array nums of length n. Create an array ans of length 2n where ans[i] == nums[i] and ans[i + n] == nums[i] for 0 <= i < n (0-indexed). Specifically, ans is the concatenation of two nums arrays. Return the array ans.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,4,1,2]",
                "output": "[1,4,1,2,1,4,1,2]",
                "explanation": ""
            },
            {
                "input": "nums = [22,21,20,1]",
                "output": "[22,21,20,1,22,21,20,1]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 4 1 2",
                "expectedOutput": "1 4 1 2 1 4 1 2"
            },
            {
                "input": "4\n22 21 20 1",
                "expectedOutput": "22 21 20 1 22 21 20 1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void concatenationOfArray() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Iteration (Two Pass)\n\nTo concatenate an array with itself, we need to create a new array that contains all elements of the original array twice, maintaining the same order. The elements at indices 000 to n−1n - 1n−1 are followed by the same elements at indices nnn to 2n−12n - 12n−1.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Iteration (One Pass)\n\nThe problem defines the result array ans such that ans[i] == nums[i] and ans[i + n] == nums[i] for 0 <= i < n. Instead of looping through the input twice, we can fill both required positions in the result array simultaneously while iterating through the input array just once. This utilizes the index mapping i and i + n directly.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Incorrect Result Array Size\nAllocating an array of size n instead of 2n causes an index out of bounds error when writing to the second half. \n\n• Off-by-One When Using Index Offset\nWhen using the one-pass approach with ans[i + n] = nums[i], forgetting that indices are zero-based or miscalculating the offset leads to incorrect placement of elements in the second half. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "contains-duplicate",
        "title": "Contains Duplicate",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array",
            "hash-table"
        ],
        "description": "Given an integer array nums, return true if any value appears more than once in the array, otherwise return false.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1, 2, 3, 3]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "nums = [1, 2, 3, 4]",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "[1",
                "expectedOutput": "true"
            },
            {
                "input": "[1",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void containsDuplicate() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe can check every pair of different elements in the array and return true if any pair has equal values.This is the most intuitive approach because it directly compares all possible pairs, but it is also the least efficient since it examines every combination.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Sorting\n\nIf we sort the array, then any duplicate values will appear next to each other.Sorting groups identical elements together, so we can simply check adjacent positions to detect duplicates.This reduces the problem to a single linear scan after sorting, making it easy to identify if any value repeats.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(1)\n\n\n3. Hash Set\n\nWe can use a hash set to efficiently keep track of the values we have already encountered.As we iterate through the array, we check whether the current value is already present in the set.If it is, that means we've seen this value before, so a duplicate exists.Using a hash set allows constant-time lookups, making this approach much more efficient than comparing every pair.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Hash Set Length\n\nThis approach uses the same idea as the previous hash set method: a set only stores unique values, so duplicates are automatically removed.Instead of checking each element manually, we simply compare the length of the set to the length of the original array.If duplicates exist, the set will contain fewer elements.The logic is identical to the earlier approach — this version is just a shorter and more concise implementation of it.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Using Wrong Comparison in Brute Force\nWhen using nested loops, a common mistake is comparing an element with itself by starting the inner loop at i instead of i + 1. \n\n• Modifying Input Array Unexpectedly\nThe sorting approach modifies the original array, which may not be acceptable in some contexts. If the original order matters, make a copy first. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "valid-anagram",
        "title": "Valid Anagram",
        "difficulty": "Easy",
        "category": "String",
        "tags": [
            "string",
            "hash-table"
        ],
        "description": "Given two strings s and t, return true if the two strings are anagrams of each other, otherwise return false. An anagram is a string that contains the exact same characters as another string, but the order of the characters can be different.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"racecar\", t = \"carrace\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"jar\", t = \"jam\"",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "racecar\ncarrace",
                "expectedOutput": "true"
            },
            {
                "input": "jar\njam",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void validAnagram() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nIf two strings are anagrams, they must contain exactly the same characters with the same frequencies.By sorting both strings, all characters will be arranged in a consistent order.If the two sorted strings are identical, then every character and its count match, which means the strings are anagrams.\n\nComplexity:\nTime: O(nlog n+mlog m)\nSpace: O(1)\n\n\n2. Hash Map\n\nIf two strings are anagrams, they must use the same characters with the same frequencies.Instead of sorting, we can count how many times each character appears in both strings.By using two hash maps (or dictionaries), we track the frequency of every character in each string.If both frequency maps match exactly, then the strings contain the same characters with same frequencies, meaning they are anagrams.\n\nComplexity:\nTime: O(n+m)\nSpace: O(1)\n\n\n3. Hash Table (Using Array)\n\nSince the problem guarantees lowercase English letters, we can use a fixed-size array of length 26 to count character frequencies instead of a hash map.As we iterate through both strings simultaneously, we increment the count for each character in s and decrement the count for each character in t.If the strings are anagrams, every increment will be matched by a corresponding decrement, and all values in the array will end at 0.This approach is efficient because it avoids hashing and uses constant space.\n\nComplexity:\nTime: O(n+m)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Forgetting to Check Length First\nIf two strings have different lengths, they cannot be anagrams. Skipping this early check means wasting time processing strings that could never match. Always compare lengths first and return false immediately if they differ. \n\n• Case Sensitivity Issues\nWhen the problem specifies lowercase letters only (as in this problem), case sensitivity is not an issue. However, if the problem allows mixed case, forgetting to normalize to the same case (e.g., converting both strings to lowercase) will cause incorrect results where \"Listen\" and \"Silent\" would wrongly be considered non-anagrams. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "two-sum",
        "title": "Two Sum",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array",
            "hash-table"
        ],
        "description": "Given an array of integers nums and an integer target, return the indices i and j such that nums[i] + nums[j] == target and i != j. You may assume that every input has exactly one pair of indices i and j that satisfy the condition. Return the answer with the smaller index first.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [3,4,5,6], target = 7",
                "output": "[0,1]",
                "explanation": ""
            },
            {
                "input": "nums = [4,5,6], target = 10",
                "output": "[0,2]",
                "explanation": ""
            },
            {
                "input": "nums = [5,5], target = 10",
                "output": "[0,1]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n3 4 5 6\n7",
                "expectedOutput": "0 1"
            },
            {
                "input": "3\n4 5 6\n10",
                "expectedOutput": "0 2"
            },
            {
                "input": "2\n5 5\n10",
                "expectedOutput": "0 1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void twoSum() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe can check every pair of different elements in the array and return the first pair that sums up to the target. This is the most intuitive approach but it's not the most efficient.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Sorting\n\nWe can sort the array and use two pointers to find the two numbers that sum up to the target. This is more efficient than the brute force approach. This approach is similar to the one used in Two Sum II.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n3. Hash Map (Two Pass)\n\nWe can use a hash map to store the value and index of each element in the array. Then, we can iterate through the array and check if the complement of the current element exists in the hash map. The complement must be at a different index, because we can't use the same element twice.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Hash Map (One Pass)\n\nWe can solve the problem in a single pass by iterating through the array and checking if the complement of the current element exists in the hash map.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Using the Same Element Twice\nYou cannot use the same element twice to form a pair. When using a hash map, ensure you check that the found index differs from the current index, or use one-pass where you only look at previously seen elements. \n\n• Returning Values Instead of Indices\nThe problem asks for indices, not the values themselves. A common mistake is returning the two numbers that sum to the target rather than their positions in the array. \n\n• Handling Duplicate Values\nWhen building a hash map with values as keys, duplicate values overwrite earlier indices. In the two-pass approach, this still works because you check indices[diff] != i. In the one-pass approach, you check for the complement before inserting the current element. \n\n• Wrong Complement Calculation\nThe complement should be target - nums[i], not nums[i] - target. Getting this backwards will search for the wrong value. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "replace-elements-with-greatest-element-on-right-side",
        "title": "Replace Elements With Greatest Element On Right Side",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array"
        ],
        "description": "You are given an array arr, replace every element in that array with the greatest element among the elements to its right, and replace the last element with -1. After doing so, return the array.",
        "constraints": [],
        "examples": [
            {
                "input": "arr = [2,4,5,3,1,2]",
                "output": "[5,5,3,2,2,-1]",
                "explanation": ""
            },
            {
                "input": "arr = [3,3]",
                "output": "[3,-1]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\n2 4 5 3 1 2",
                "expectedOutput": "5 5 3 2 2 -1"
            },
            {
                "input": "2\n3 3",
                "expectedOutput": "3 -1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void replaceElementsWithGreatestElementOnRightSide() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nFor each element at index i, we need to find the maximum value among all elements to its right. The most straightforward approach is to scan every element to the right for each position using index j. The last element has no elements to its right, so it becomes -1.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Suffix Max\n\nBy traversing right to left, we can maintain a running maximum of all elements seen so far in rightMax. When we visit position i, the current running maximum represents the greatest element to the right of i. We then update rightMax to include arr[i] for the next iteration. This eliminates redundant scanning.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Traversing Left to Right\nProcessing the array from left to right requires recalculating the maximum of all right elements for each position, resulting in O(n^2) time complexity. The optimal approach traverses right to left, maintaining a running maximum in a single pass. \n\n• Updating the Maximum Before Storing the Result\nWhen traversing right to left, the current element's value must be stored in the result before updating rightMax. Updating rightMax first causes the current element to incorrectly include itself in its own replacement value. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "is-subsequence",
        "title": "Is Subsequence",
        "difficulty": "Easy",
        "category": "String",
        "tags": [
            "string",
            "two-pointers"
        ],
        "description": "You are given two strings s and t, return true if s is a subsequence of t, or false otherwise. A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., \"ace\" is a subsequence of \"abcde\" while \"aec\" is not).",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"node\", t = \"neetcode\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"axc\", t = \"ahbgdc\"",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "node\nneetcode",
                "expectedOutput": "true"
            },
            {
                "input": "axc\nahbgdc",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void isSubsequence() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nTo check if s is a subsequence of t, we need to find all characters of s in t in the same order, though not necessarily contiguous. Recursively, we compare the current characters of both strings: if they match, we advance both pointers; if they do not match, we only advance the pointer in t to continue searching. The base cases are reaching the end of s (success) or the end of t before finishing s (failure).\n\nComplexity:\nTime: O(n * m)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThe recursive solution may recompute the same subproblems multiple times. By adding memoization, we cache the result for each (i, j) state so that each pair is computed at most once. This transforms the exponential worst case into a polynomial time solution while keeping the recursive structure intact.\n\nComplexity:\nTime: O(n * m)\nSpace: O(n * m)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nInstead of recursion with memoization, we can fill a DP table iteratively from the end of both strings toward the beginning. The value dp[i][j] represents whether s[i:] is a subsequence of t[j:]. If the characters match, we look at dp[i+1][j+1]. Otherwise, we look at dp[i][j+1] (skip the character in t). The base case is that any suffix of s starting at len(s) is trivially a subsequence of anything (empty string).\n\nComplexity:\nTime: O(n * m)\nSpace: O(n * m)\n\n\n4. Two Pointers\n\nThe most efficient approach uses two pointers since we only need to make a single pass through both strings. Pointer i tracks our position in s, and pointer j tracks our position in t. We always advance j, but only advance i when we find a matching character. If we reach the end of s, all characters were found in order. This is optimal because each character in t is examined exactly once.\n\nComplexity:\nTime: O(n+m)\nSpace: O(1)\n\n\n5. Follow-Up Solution (Index Jumping)\n\nWhen checking many strings against the same t, the two-pointer approach becomes inefficient because we scan t repeatedly. Instead, we precompute for each position in t the next occurrence of each character. This lets us jump directly to the next matching character rather than scanning. The preprocessing takes O(26 * m) time and space, but each subsequence query then takes only O(n) time regardless of the length of t.\n\nComplexity:\nTime: O(n+m)\nSpace: O(m)\n\n\nCommon Pitfalls\n\n• Confusing Subsequence with Substring\nA subsequence does not require consecutive characters, only that the order is preserved. For example, \"ace\" is a subsequence of \"abcde\", but \"aec\" is not because the order is violated. Make sure to only advance the pointer in s when characters match, not when looking for contiguous matches. \n\n• Forgetting to Handle Empty String Cases\nWhen s is empty, it is always a subsequence of any string t (including an empty t). When t is empty but s is not, the answer is always false. Failing to handle these edge cases can lead to index-out-of-bounds errors or incorrect results. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "length-of-last-word",
        "title": "Length Of Last Word",
        "difficulty": "Easy",
        "category": "String",
        "tags": [
            "string"
        ],
        "description": "You are given a string s consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only. Note: A substring is a contiguous non-empty sequence of characters within a string.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"Hello World\"",
                "output": "5",
                "explanation": ""
            },
            {
                "input": "s = \"   fly me   to   the moon  \"",
                "output": "4",
                "explanation": ""
            },
            {
                "input": "s = \"luffy is still joyboy\"",
                "output": "6",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "Hello World",
                "expectedOutput": "5"
            },
            {
                "input": "fly me   to   the moon",
                "expectedOutput": "4"
            },
            {
                "input": "luffy is still joyboy",
                "expectedOutput": "6"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void lengthOfLastWord() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Iteration - I\n\nWe need to find the length of the last word, where words are separated by spaces. Trailing spaces complicate matters since the last word might not be at the very end of the string. By scanning forward, we track the current word's length and reset it when we encounter a new word after spaces.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n2. Iteration - II\n\nScanning from the end is more direct since we only care about the last word. First skip any trailing spaces, then count characters until we hit a space or the beginning of the string. This avoids processing earlier parts of the string entirely.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n3. Built-In Function\n\nMost languages provide string manipulation functions that handle splitting and trimming. By splitting the string on spaces and taking the last non-empty segment, we get the last word directly. This trades some efficiency for code simplicity and readability.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Not Handling Trailing Spaces\nStrings like \"Hello World   \" have trailing spaces after the last word. If you simply scan from the end without first skipping spaces, you will count zero characters. Always skip trailing spaces before counting the last word's length. \n\n• Assuming Single Spaces Between Words\nThe input can have multiple consecutive spaces between words or at the beginning and end. Code that assumes exactly one space between words may produce incorrect results or fail on edge cases like \"   fly me   to   the moon  \". ",
        "acceptanceRate": 0.5
    },
    {
        "id": "longest-common-prefix",
        "title": "Longest Common Prefix",
        "difficulty": "Easy",
        "category": "String",
        "tags": [
            "string"
        ],
        "description": "You are given an array of strings strs. Return the longest common prefix of all the strings. If there is no longest common prefix, return an empty string \"\".",
        "constraints": [],
        "examples": [
            {
                "input": "strs = [\"bat\",\"bag\",\"bank\",\"band\"]",
                "output": "\"ba\"",
                "explanation": ""
            },
            {
                "input": "strs = [\"dance\",\"dag\",\"danger\",\"damage\"]",
                "output": "\"da\"",
                "explanation": ""
            },
            {
                "input": "strs = [\"neet\",\"feet\"]",
                "output": "\"\"",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\nbat bag bank band",
                "expectedOutput": "\"ba\""
            },
            {
                "input": "4\ndance dag danger damage",
                "expectedOutput": "\"da\""
            },
            {
                "input": "2\nneet feet",
                "expectedOutput": "\"\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void longestCommonPrefix() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Horizontal Scanning\n\nStart with the first string as the initial prefix candidate. Then compare it with each subsequent string, shrinking the prefix to match only the common portion. After processing all strings, what remains is the longest common prefix. The prefix can only shrink or stay the same as we go through more strings.\n\nComplexity:\nTime: O(n * m)\nSpace: O(1)\n\n\n2. Vertical Scanning\n\nInstead of comparing entire strings horizontally, we can compare characters column by column across all strings. Check if all strings have the same character at position 0, then position 1, and so on. The moment we find a mismatch or reach the end of any string, we've found where the common prefix ends.\n\nComplexity:\nTime: O(n * m)\nSpace: O(1)\n\n\n3. Sorting\n\nWhen strings are sorted lexicographically, the first and last strings in the sorted order are the most different from each other. If these two extremes share a common prefix, then all strings in between must also share that same prefix. So we only need to compare the first and last strings after sorting.\n\nComplexity:\nTime: O(n * mlog m)\nSpace: O(1)\n\n\n4. Trie\n\nA Trie naturally represents all prefixes. We insert the shortest string into the trie, then query each other string against it. For each string, we walk down the trie as far as characters match, tracking how deep we get. The minimum depth reached across all strings is the length of the longest common prefix.\n\nComplexity:\nTime: O(n * m)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Not Handling Empty Strings in the Array\nIf any string in the input array is empty, the longest common prefix must be an empty string. Failing to check for this case before accessing characters can lead to index out of bounds errors. \n\n• Accessing Characters Beyond String Length\nWhen comparing characters at a given index, you must ensure the index is valid for all strings being compared. A common mistake is to iterate based on one string's length without checking if shorter strings have characters at that position. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "group-anagrams",
        "title": "Group Anagrams",
        "difficulty": "Medium",
        "category": "String",
        "tags": [
            "string",
            "hash-table"
        ],
        "description": "Given an array of strings strs, group all anagrams together into sublists. You may return the output in any order. An anagram is a string that contains the exact same characters as another string, but the order of the characters can be different.",
        "constraints": [],
        "examples": [
            {
                "input": "strs = [\"act\",\"pots\",\"tops\",\"cat\",\"stop\",\"hat\"]",
                "output": "[[\"hat\"],[\"act\", \"cat\"],[\"stop\", \"pots\", \"tops\"]]",
                "explanation": ""
            },
            {
                "input": "strs = [\"x\"]",
                "output": "[[\"x\"]]",
                "explanation": ""
            },
            {
                "input": "strs = [\"\"]",
                "output": "[[\"\"]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\nact pots tops cat stop hat",
                "expectedOutput": "\"hat\" \"act\"  \"cat\" \"stop\"  \"pots\"  \"tops\""
            },
            {
                "input": "1\nx",
                "expectedOutput": "\"x\""
            },
            {
                "input": "1",
                "expectedOutput": "\"\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void groupAnagrams() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nAnagrams become identical when their characters are sorted.For example, \"eat\", \"tea\", and \"ate\" all become \"aet\" after sorting.By using the sorted version of each string as a key, we can group all anagrams together.Strings that share the same sorted form must be anagrams, so placing them in the same group is both natural and efficient.\n\nComplexity:\nTime: O(m * nlog n)\nSpace: O(m * n)\n\n\n2. Hash Table\n\nInstead of sorting each string, we can represent every string by the frequency of its characters.Since the problem uses lowercase English letters, a fixed-size array of length 26 can capture how many times each character appears.Two strings are anagrams if and only if their frequency arrays are identical.By using this frequency array (converted to a tuple so it can be a dictionary key), we can group all strings that share the same character counts.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m)\n\n\nCommon Pitfalls\n\n• Using a Mutable Key Type for the Hash Map\nWhen using character frequency arrays as keys, you must convert them to an immutable type (like a tuple in Python or a string in other languages). Lists and arrays are mutable and cannot be used as dictionary keys directly. \n\n• Assuming Input Contains Only Lowercase Letters\nThe frequency array approach with size 26 only works for lowercase English letters. If the input could contain uppercase letters or other characters, the solution would fail or produce incorrect groupings. \n\n• Creating a New Key Format That Has Collisions\nWhen converting frequency counts to strings, using a naive format like concatenation without separators can cause collisions. For example, counts [1,11] and [11,1] could produce the same string \"111\". ",
        "acceptanceRate": 0.5
    },
    {
        "id": "top-k-frequent-elements",
        "title": "Top K Frequent Elements",
        "difficulty": "Medium",
        "category": "Heap",
        "tags": [
            "array",
            "hash-table",
            "heap"
        ],
        "description": "Given an integer array nums and an integer k, return the k most frequent elements within the array. The test cases are generated such that the answer is always unique. You may return the output in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,2,3,3,3], k = 2",
                "output": "[2,3]",
                "explanation": ""
            },
            {
                "input": "nums = [7,7], k = 1",
                "output": "[7]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\n1 2 2 3 3 3\n2",
                "expectedOutput": "2 3"
            },
            {
                "input": "2\n7 7\n1",
                "expectedOutput": "7"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void topKFrequentElements() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nTo find the k most frequent elements, we first need to know how often each number appears.Once we count the frequencies, we can sort the unique numbers based on how many times they occur.After sorting, the numbers with the highest frequencies will naturally appear at the end of the list.By taking the last k entries, we get the k most frequent elements.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n2. Min-Heap\n\nAfter counting how often each number appears, we want to efficiently keep track of only the k most frequent elements.A min-heap is perfect for this because it always keeps the smallest element at the top.By pushing (frequency, value) pairs into the heap and removing the smallest whenever the heap grows beyond size k, we ensure that the heap always contains the top k most frequent elements.In the end, the heap holds exactly the k values with the highest frequencies.\n\nComplexity:\nTime: O(nlog k)\nSpace: O(n+k)\n\n\n3. Bucket Sort\n\nEach number in the array appears a certain number of times, and the maximum possible frequency is the length of the array.We can use this idea by creating a list where the index represents a frequency, and at each index we store all numbers that appear exactly that many times.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Using a Max-Heap Instead of Min-Heap\nWhen keeping track of the top k elements, a min-heap of size k is needed so you can efficiently remove the smallest frequency when the heap exceeds size k. Using a max-heap requires storing all elements and then extracting k times, which is less efficient. The min-heap approach maintains only the k largest frequencies at any time. \n\n• Forgetting to Handle Ties in Frequency\nWhen multiple numbers have the same frequency, the order in which they appear in the result may vary. Most problem statements accept any valid ordering, but some solutions incorrectly assume a specific order or break when frequencies are equal. Ensure your comparison function handles equal frequencies gracefully. \n\n• Off-By-One in Bucket Sort Index\nIn bucket sort, frequencies range from 1 to n (the array length), so you need n + 1 buckets indexed 0 to n. A common mistake is creating only n buckets, causing an index out of bounds error when an element appears n times. Always allocate len(nums) + 1 buckets to accommodate all possible frequencies. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "product-of-array-except-self",
        "title": "Product Of Array Except Self",
        "difficulty": "Medium",
        "category": "Array",
        "tags": [
            "array",
            "prefix-sum"
        ],
        "description": "Given an integer array nums, return an array output where output[i] is the product of all the elements of nums except nums[i]. Each product is guaranteed to fit in a 32-bit integer.    Follow-up: Could you solve it in O(n)O(n)O(n) time without using the division operation?",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,4,6]",
                "output": "[48,24,12,8]",
                "explanation": ""
            },
            {
                "input": "nums = [-1,0,1,2,3]",
                "output": "[0,-6,0,0,0]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 2 4 6",
                "expectedOutput": "48 24 12 8"
            },
            {
                "input": "5\n-1 0 1 2 3",
                "expectedOutput": "0 -6 0 0 0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void productOfArrayExceptSelf() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nFor each position in the array, we can compute the product of all other elements by multiplying every value except the one at the current index.This directly follows the problem statement and is the most straightforward approach:for each index, multiply all elements except itself.Although simple, this method is inefficient because it repeats a full pass through the array for every element.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Division\n\nThis approach works by using a simple idea:If we know the product of all non-zero numbers, we can easily compute the answer for each position using division — as long as there are no division-by-zero issues.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n3. Prefix & Suffix\n\nFor each index, we need the product of all elements before it and all elements after it.Instead of recomputing the product repeatedly, we can pre-compute two helpful arrays:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Prefix & Suffix (Optimal)\n\nWe can compute the product of all elements except the current one without using extra prefix and suffix arrays.Instead, we reuse the result array and build the answer in two simple passes:\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Using Division Without Handling Zeros\nThe division approach (totalProduct / nums[i]) fails when the array contains zeros. Dividing by zero causes runtime errors, and having multiple zeros requires special handling. Always count zeros first: with two or more zeros, the entire result is zeros; with exactly one zero, only the zero's position gets the product of other elements. \n\n• Off-by-One Errors in Prefix/Suffix Array Construction\nWhen building prefix products, pref[i] should contain the product of elements before index i, not including nums[i]. A common mistake is including nums[i] in the prefix, which double-counts the element. The same applies to suffix arrays: suff[i] should exclude nums[i]. \n\n• Integer Overflow with Large Products\nWhen the array contains many large numbers, the product can overflow 32-bit integers. In languages with fixed-size integers, consider using long or BigInteger. The problem constraints usually prevent overflow, but edge cases with many elements near the maximum value should be tested. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "valid-sudoku",
        "title": "Valid Sudoku",
        "difficulty": "Medium",
        "category": "Array",
        "tags": [
            "array",
            "hash-table"
        ],
        "description": "You are given a 9 x 9 Sudoku board board. A Sudoku board is valid if the following rules are followed: Return true if the Sudoku board is valid, otherwise return false Note: A board does not need to be full or be solvable to be valid.",
        "constraints": [],
        "examples": [
            {
                "input": "board =",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "board =",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "",
                "expectedOutput": "true"
            },
            {
                "input": "",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void validSudoku() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nA valid Sudoku board must follow three rules:\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Hash Set (One Pass)\n\nInstead of checking rows, columns, and 3×3 boxes separately, we can validate the entire Sudoku board in one single pass.For each cell, we check whether the digit has already appeared in:\n\nComplexity:\nTime: O(n2)\nSpace: O(n2)\n\n\n3. Bitmask\n\nEvery digit from 1 to 9 can be represented using a single bit in an integer.For example, digit 1 uses bit 0, digit 2 uses bit 1, …, digit 9 uses bit 8.This means we can track which digits have appeared in a row, column, or 3×3 box using just one integer per row/column/box instead of a hash set.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Wrong Box Index Calculation\nThe 3x3 box index formula (r // 3) * 3 + (c // 3) is easy to get wrong. A common mistake is using (r // 3, c // 3) as a tuple key but forgetting integer division, or computing r // 3 + c // 3 which doesn't uniquely identify boxes. \n\n• Not Skipping Empty Cells\nEmpty cells are represented by \".\" and should be skipped entirely. Forgetting to check for empty cells before processing will cause errors or incorrect duplicate detection. \n\n• Checking Validity vs Solvability\nThis problem only checks if the current board state is valid, not whether the puzzle is solvable. A board with no duplicates is valid even if it's impossible to complete. \n\n• Processing the Same Cell Multiple Times\nWhen iterating through the board, make sure each cell is only processed once. Some implementations accidentally check the same digit multiple times when validating rows, columns, and boxes separately. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "longest-consecutive-sequence",
        "title": "Longest Consecutive Sequence",
        "difficulty": "Medium",
        "category": "Array",
        "tags": [
            "array",
            "hash-table"
        ],
        "description": "Given an array of integers nums, return the length of the longest consecutive sequence of elements that can be formed. A consecutive sequence is a sequence of elements in which each element is exactly 1 greater than the previous element. The elements do not have to be consecutive in the original array. You must write an algorithm that runs in O(n) time.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [2,20,4,10,3,4,5]",
                "output": "4",
                "explanation": ""
            },
            {
                "input": "nums = [0,3,2,5,4,6,1,1]",
                "output": "7",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n2 20 4 10 3 4 5",
                "expectedOutput": "4"
            },
            {
                "input": "8\n0 3 2 5 4 6 1 1",
                "expectedOutput": "7"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void longestConsecutiveSequence() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nA consecutive sequence grows by checking whether the next number (num + 1, num + 2, …) exists in the set.The brute-force approach simply starts from every number in the list and tries to extend a consecutive streak as far as possible.For each number, we repeatedly check if the next number exists, increasing the streak length until the sequence breaks.Even though this method works, it does unnecessary repeated work because many sequences get recomputed multiple times.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Sorting\n\nIf we sort the numbers first, then all consecutive values will appear next to each other.This makes it easy to walk through the sorted list and count how long each consecutive sequence is.We simply move forward while the current number matches the expected next value in the sequence.Duplicates don’t affect the result—they are just skipped—while gaps reset the streak count.This approach is simpler and more organized than the brute force method because sorting places all potential sequences in order.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(1)\n\n\n3. Hash Set\n\nTo avoid repeatedly recounting the same sequences, we only want to start counting when we find the beginning of a consecutive sequence.A number is the start of a sequence if num - 1 is not in the set.This guarantees that each consecutive sequence is counted exactly once.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Hash Map\n\nWhen we place a new number into the map, it may connect two existing sequences or extend one of them.Instead of scanning forward or backward, we only look at the lengths stored at the neighbors:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Starting a Sequence from Every Number\nA common inefficiency is to start counting a sequence from every number in the array, which leads to O(n^2) time complexity. The key optimization is to only start counting from numbers that are the beginning of a sequence (i.e., num - 1 is not in the set). \n\n• Not Handling Duplicates Properly\nThe input array may contain duplicate values. Using a set automatically handles this, but if you iterate over the original array instead of the set, you may process the same sequence multiple times, wasting computation. \n\n• Forgetting to Handle Empty Input\nWhen the input array is empty, the longest consecutive sequence has length 0. Some implementations that assume at least one element exists may fail or return incorrect results for this edge case. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "check-if-array-is-sorted-and-rotated",
        "title": "Check If Array Is Sorted And Rotated",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array"
        ],
        "description": "You are given an array nums, return true if the array was originally sorted in non-decreasing order, then rotated some number of positions (including zero). Otherwise, return false. There may be duplicates in the original array. Note: An array A rotated by x positions results in an array B of the same length such that B[i] == A[(i+x) % A.length] for every valid index i.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [3,4,5,1,2]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "nums = [2,1,3,4]",
                "output": "false",
                "explanation": ""
            },
            {
                "input": "nums = [1,2,3]",
                "output": "true",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "5\n3 4 5 1 2",
                "expectedOutput": "true"
            },
            {
                "input": "4\n2 1 3 4",
                "expectedOutput": "false"
            },
            {
                "input": "3\n1 2 3",
                "expectedOutput": "true"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void checkIfArrayIsSortedAndRotated() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nA sorted and rotated array can be thought of as taking a sorted array and moving some elements from the end to the beginning. For example, [3,4,5,1,2] is [1,2,3,4,5] rotated. We can verify this by sorting the array and checking if our original array matches some rotation of the sorted version.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Sliding Window\n\nIf we imagine the array as circular (the last element connects back to the first), a valid sorted-and-rotated array should have a contiguous segment of length n where elements are in non-decreasing order. We can simulate this circular behavior by conceptually doubling the array and looking for n consecutive non-decreasing elements.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n3. Iteration\n\nIn a sorted-and-rotated array, there can be at most one \"break point\" where a larger element is followed by a smaller element. This break point is where the rotation occurred. If we find more than one such break, the array cannot be a valid rotation of a sorted array.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Forgetting to Check the Wrap-Around\nA sorted and rotated array is circular, so you must compare the last element with the first element. Using nums[i] > nums[i + 1] without modulo wrapping misses the case where the \"break\" occurs between the last and first elements. \n\n• Expecting Strictly Increasing Order\nThe problem allows non-decreasing order (duplicates are permitted). Checking for strict inequality nums[i] >= nums[i+1] instead of nums[i] > nums[i+1] incorrectly flags valid arrays like [1, 1, 1] or [2, 2, 3, 1, 1] as invalid. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "maximum-distance-in-arrays",
        "title": "Maximum Distance In Arrays",
        "difficulty": "Medium",
        "category": "Array",
        "tags": [
            "array"
        ],
        "description": "You are given m arrays, where each array is sorted in ascending order. You can pick up two integers from two different arrays (each array picks one) and calculate the distance. We define the distance between two integers a and b to be their absolute difference |a - b|. Return the maximum distance.",
        "constraints": [],
        "examples": [
            {
                "input": "arrays = [[1,2,3],[4,5],[1,2,3]]",
                "output": "4",
                "explanation": ""
            },
            {
                "input": "arrays = [[1],[1]]",
                "output": "0",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1,2,3 4,5 1,2,3",
                "expectedOutput": "4"
            },
            {
                "input": "2\n1 1",
                "expectedOutput": "0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void maximumDistanceInArrays() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe need to find the maximum absolute difference between elements from two different arrays. The naive approach is to compare every element from every array with every element from every other array. This guarantees we find the answer but is slow due to the nested iteration over all elements.\n\nComplexity:\nTime: O((n * x)\nSpace: O(1)\n\n\n2. Better Brute Force\n\nSince each array is sorted, the minimum is always at the start and the maximum is always at the end. This means we only need to consider the first and last elements of each array. For any pair of arrays, the maximum distance is either |min1 - max2| or |min2 - max1|. This reduces the inner loops to constant time per pair.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n3. Single Scan\n\nWe can do better by making a single pass. As we scan through the arrays, we maintain the global minimum and maximum seen so far. For each new array, the best distance involving this array is either current_max - global_min or global_max - current_min. After checking, we update our global min and max to include the current array's values.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Selecting Both Elements from the Same Array\nThe problem requires elements to come from two different arrays. A common mistake is to find the global minimum and maximum across all elements without ensuring they belong to different arrays. For example, if one array contains both the smallest and largest values, using them would violate the constraint. The single scan solution handles this by comparing the current array's values against previously seen min/max values, guaranteeing they come from different arrays. \n\n• Forgetting to Use Absolute Difference\nSome solutions compute the difference without taking the absolute value. While the optimal solution always involves max - min (which is positive), intermediate calculations or edge cases might produce negative values. Always use abs() or structure your comparisons to ensure you're computing |a - b| rather than just a - b. \n\n• Not Exploiting the Sorted Property of Each Array\nEach individual array is sorted in ascending order. Failing to recognize this leads to unnecessarily iterating through all elements when only the first (minimum) and last (maximum) elements of each array matter. The brute force solution that checks every pair of elements is correct but inefficient; the optimized approaches leverage the sorted property to achieve linear time. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "valid-palindrome",
        "title": "Valid Palindrome",
        "difficulty": "Easy",
        "category": "String",
        "tags": [
            "string",
            "two-pointers"
        ],
        "description": "Given a string s, return true if it is a palindrome, otherwise return false. A palindrome is a string that reads the same forward and backward. It is also case-insensitive and ignores all non-alphanumeric characters. Note: Alphanumeric characters consist of letters (A-Z, a-z) and numbers (0-9).",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"Was it a car or a cat I saw?\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"tab a cat\"",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "Was it a car or a cat I saw?",
                "expectedOutput": "true"
            },
            {
                "input": "tab a cat",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void validPalindrome() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Reverse String\n\nTo check if a string is a palindrome, we only care about letters and digits—everything else can be ignored.We can build a cleaned version of the string that contains only alphanumeric characters, all converted to lowercase for consistency.Once we have this cleaned string, the problem becomes very simple:a string is a palindrome if it is exactly the same as its reverse.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Two Pointers\n\nInstead of building a new string, we can check the palindrome directly in-place using two pointers.One pointer starts at the beginning (l) and the other at the end (r).We move both pointers inward, skipping any characters that are not letters or digits.Whenever both pointers point to valid characters, we compare them in lowercase form.If at any point they differ, the string is not a palindrome.This method avoids extra space and keeps the logic simple and efficient.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Not Skipping Non-Alphanumeric Characters\nThe problem requires ignoring all characters that are not letters or digits. Forgetting to skip spaces, punctuation, and special characters will cause false negatives. For example, \"A man, a plan, a canal: Panama\" should be recognized as a palindrome, but including the spaces and punctuation in the comparison will incorrectly return false. \n\n• Case Sensitivity\nLetters must be compared in a case-insensitive manner. Comparing 'A' directly with 'a' will return false even though they should be treated as equal. Always convert both characters to the same case (lowercase or uppercase) before comparing. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "two-sum-ii-input-array-is-sorted",
        "title": "Two Sum Ii Input Array Is Sorted",
        "difficulty": "Medium",
        "category": "Array",
        "tags": [
            "array",
            "two-pointers"
        ],
        "description": "Given an array of integers numbers that is sorted in non-decreasing order. Return the indices (1-indexed) of two numbers, [index1, index2], such that they add up to a given target number target and index1 < index2. Note that index1 and index2 cannot be equal, therefore you may not use the same element twice. There will always be exactly one valid solution. Your solution must use O(1)O(1)O(1) additional space.",
        "constraints": [],
        "examples": [
            {
                "input": "numbers = [1,2,3,4], target = 3",
                "output": "[1,2]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 2 3 4\n3",
                "expectedOutput": "1 2"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void twoSumIiInputArrayIsSorted() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nBrute force ignores the ordering and simply checks every possible pair.For each index i, we look at every index j > i and check whether their sum equals the target.This approach is easy to understand but inefficient because it tries all combinations without using the sorted property.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Binary Search\n\nBecause the array is already sorted, we don’t need to check every pair.For each number at index i, we know exactly what value we need to find:target - numbers[i].Since the array is sorted, we can efficiently search for this value using binary search instead of scanning linearly.This reduces the inner search from O(n) to O(log n), making the solution much faster.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(1)\n\n\n3. Hash Map\n\nEven though the array is sorted, we can still use a hash map to solve the problem efficiently.As we scan through the list, we compute the needed complement for each number.If that complement has already been seen earlier (stored in the hash map), then we have found the required pair.Otherwise, we store the current number with its (1-indexed) position.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Two Pointers\n\nBecause the array is sorted, we can use two pointers to adjust the sum efficiently.If the current sum is too big, moving the right pointer left makes the sum smaller.If the sum is too small, moving the left pointer right makes the sum larger.This lets us quickly close in on the target without checking every pair.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Returning 0-Indexed Instead of 1-Indexed Results\nThe problem explicitly requires 1-indexed positions in the output. A common mistake is returning [i, j] instead of [i + 1, j + 1]. Always double-check the problem requirements for indexing conventions, as returning 0-indexed results will be marked as incorrect. \n\n• Not Leveraging the Sorted Property\nSince the array is already sorted, the two-pointer approach achieves O(n) time with O(1) space. Using a hash map still works but wastes the sorted property and uses O(n) extra space unnecessarily. While not incorrect, failing to recognize and use the sorted property results in a suboptimal solution. \n\n• Moving Both Pointers in the Same Direction\nIn the two-pointer approach, when the sum is too large you should move the right pointer left, and when the sum is too small you should move the left pointer right. A common error is moving both pointers in the same direction or moving the wrong pointer, which causes the algorithm to miss the valid pair or loop infinitely. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "3sum",
        "title": "3Sum",
        "difficulty": "Medium",
        "category": "Array",
        "tags": [
            "array",
            "two-pointers"
        ],
        "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] where nums[i] + nums[j] + nums[k] == 0, and the indices i, j and k are all distinct. The output should not contain any duplicate triplets. You may return the output and the triplets in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [-1,0,1,2,-1,-4]",
                "output": "[[-1,-1,2],[-1,0,1]]",
                "explanation": ""
            },
            {
                "input": "nums = [0,1,1]",
                "output": "[]",
                "explanation": ""
            },
            {
                "input": "nums = [0,0,0]",
                "output": "[[0,0,0]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\n-1 0 1 2 -1 -4",
                "expectedOutput": "-1 -1 2 -1 0 1"
            },
            {
                "input": "3\n0 1 1",
                "expectedOutput": ""
            },
            {
                "input": "3\n0 0 0",
                "expectedOutput": "0 0 0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void 3sum() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe brute-force approach simply tries every possible triplet.Since we check all combinations (i, j, k) with i < j < k, we are guaranteed to find all sets of three numbers that sum to zero.Sorting helps keep the triplets in order and makes it easier to avoid duplicates by storing them in a set.\n\nComplexity:\nTime: O(n3)\nSpace: O(m)\n\n\n2. Hash Map\n\nAfter sorting the array, we can fix two numbers and look for the third number that completes the triplet.To do this efficiently, we use a hash map that stores how many times each number appears.As we pick the first and second numbers, we temporarily reduce their counts in the map so we don't reuse them.Then we check whether the needed third value still exists in the map.Sorting also helps us skip duplicates easily so we only add unique triplets.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n3. Two Pointers\n\nAfter sorting the array, we can fix one number and then search for the other two using the two-pointer technique.Sorting helps in two ways:\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Forgetting to Skip Duplicates\nA common mistake is not properly skipping duplicate values, which leads to duplicate triplets in the result. After sorting, when you find a valid triplet, you must skip over all identical values for the first element (outer loop) and the left pointer. Failing to do this causes wrong answers on inputs like [-1, -1, 0, 1, 1]. \n\n• Not Sorting the Array First\nThe two-pointer approach only works correctly on a sorted array. Without sorting, moving pointers based on sum comparisons does not guarantee you will find all valid triplets. Always sort the input array before applying the two-pointer technique. \n\n• Incorrect Early Termination\nWhen the first element nums[i] is positive, all remaining elements are also positive (since the array is sorted), so no triplet can sum to zero. However, incorrectly breaking when nums[i] >= 0 instead of nums[i] > 0 misses cases like [0, 0, 0]. The break condition should be nums[i] > 0, not nums[i] >= 0. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "trapping-rain-water",
        "title": "Trapping Rain Water",
        "difficulty": "Hard",
        "category": "Array",
        "tags": [
            "array",
            "two-pointers",
            "stack"
        ],
        "description": "You are given an array of non-negative integers height which represent an elevation map. Each value height[i] represents the height of a bar, which has a width of 1. Return the maximum area of water that can be trapped between the bars.",
        "constraints": [],
        "examples": [
            {
                "input": "height = [0,2,0,3,1,0,1,3,2,1]",
                "output": "9",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "10\n0 2 0 3 1 0 1 3 2 1",
                "expectedOutput": "9"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void trappingRainWater() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nFor each position, the water trapped above it depends on the tallest bar to its left and the tallest bar to its right.If we know these two values, the water at index i is:\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Prefix & Suffix Arrays\n\nInstead of recomputing the tallest bar to the left and right for every index, we can precompute these values once.We build two arrays:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Stack\n\nThe stack helps us find places where water can collect.When we see a bar that is taller than the bar on top of the stack, it means we've found a right wall for a container.The bar we pop is the bottom, and the new top of the stack becomes the left wall.With a left wall, bottom, and right wall, we can calculate how much water fits in between.We keep doing this as long as the current bar keeps forming valid containers.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Two Pointers\n\nWater at any position depends on the shorter wall between the left and right sides.So if the left wall is shorter, the right wall can't help us—water is limited by the left side.That means we safely move the left pointer inward and calculate how much water can be trapped there.Similarly, if the right wall is shorter, we move the right pointer left.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Calculating Water at Boundary Bars\nThe leftmost and rightmost bars can never hold water above them since there's no wall on one side to contain it. Including them in water calculations gives wrong results. \n\n• Using Current Bar Height Instead of Max Heights\nWater at each position depends on the minimum of the maximum heights to its left and right, minus the current height. Using the current bar's height in the max comparison instead of tracking running maximums is incorrect. \n\n• Negative Water Values\nWhen the current bar is taller than the limiting wall, the water calculation yields a negative value. This happens at peaks and should contribute zero water, not negative. \n\n• Wrong Pointer Movement in Two Pointers\nIn the two-pointer approach, always move the pointer on the side with the smaller max height. Moving the wrong pointer breaks the invariant that the smaller side determines the water level. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "remove-duplicates-from-sorted-array",
        "title": "Remove Duplicates From Sorted Array",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array",
            "two-pointers"
        ],
        "description": "You are given an integer array nums sorted in non-decreasing order. Your task is to remove duplicates from nums in-place so that each element appears only once. After removing the duplicates, return the number of unique elements, denoted as k, such that the first k elements of nums contain the unique elements. Note: Return k as the final result.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,1,2,3,4]",
                "output": "[1,2,3,4]",
                "explanation": ""
            },
            {
                "input": "nums = [2,10,10,30,30,30]",
                "output": "[2,10,30]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "5\n1 1 2 3 4",
                "expectedOutput": "1 2 3 4"
            },
            {
                "input": "6\n2 10 10 30 30 30",
                "expectedOutput": "2 10 30"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void removeDuplicatesFromSortedArray() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorted Set\n\nA set automatically removes duplicates, and a sorted set maintains order. We insert all elements into a sorted set, then copy the unique elements back to the original array. This approach is simple but uses extra space and doesn't take advantage of the array already being sorted.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n2. Two Pointers - I\n\nSince the array is sorted, duplicates are adjacent. We use two pointers: one (l) marks where to place the next unique element, and another (r) scans through the array. When r finds a new value (different from what's at l), we copy it to position l and advance both pointers. This modifies the array in-place.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n3. Two Pointers - II\n\nA more elegant approach: we compare each element with its predecessor. Since duplicates are consecutive in a sorted array, an element is unique if it differs from the one before it. We maintain a write pointer that only advances when we find a new unique value.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Not Leveraging the Sorted Property\nThe array is already sorted, meaning duplicates are always adjacent. Some solutions use a hash set or sort the array again, which wastes time and space. Since duplicates are consecutive, you only need to compare each element with its predecessor (or the last written element) to detect duplicates in O(1) space. \n\n• Returning the Wrong Value\nThe function should return the count of unique elements, not modify and return the array itself. Additionally, the returned length k means the first k elements of nums contain the unique values. Some solutions off-by-one error by returning l - 1 instead of l, or forget that the write pointer already represents the count of unique elements written. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "move-zeroes",
        "title": "Move Zeroes",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array",
            "two-pointers"
        ],
        "description": "You are given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.",
        "constraints": [
            "Follow up: Could you minimize the total number of operations done?"
        ],
        "examples": [
            {
                "input": "nums = [0,0,1,2,0,5]",
                "output": "[1,2,5,0,0,0]",
                "explanation": ""
            },
            {
                "input": "nums = [0,1,0]",
                "output": "[1,0,0]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\n0 0 1 2 0 5",
                "expectedOutput": "1 2 5 0 0 0"
            },
            {
                "input": "3\n0 1 0",
                "expectedOutput": "1 0 0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void moveZeroes() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Extra Space\n\nThe simplest approach is to separate non-zero elements from zeros using extra storage. We collect all non-zero elements first, then write them back to the original array, filling the remaining positions with zeros. This guarantees the relative order of non-zero elements is preserved.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Two Pointers (Two Pass)\n\nWe can avoid extra space by overwriting the array in place. Use a left pointer to track where the next non-zero element should go. As we scan with a right pointer, each non-zero element gets copied to the left pointer's position. After the first pass, all non-zero elements are at the front in order. A second pass fills the remaining positions with zeros.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n3. Two Pointers (One Pass)\n\nInstead of copying values and then filling zeros separately, we can swap elements in a single pass. The left pointer marks the boundary between processed non-zero elements and unprocessed elements. When we encounter a non-zero element with the right pointer, we swap it with the element at the left pointer. This naturally pushes 0 to the right while keeping non-zero elements in their relative order.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Swapping When Pointers Are at the Same Position\nWhen both pointers l and r point to the same non-zero element, swapping is unnecessary and wastes operations. While this does not affect correctness, adding a check like if (l != r) before swapping improves efficiency and avoids redundant writes, which can matter for performance-sensitive applications. \n\n• Disrupting Relative Order of Non-Zero Elements\nThe problem requires maintaining the relative order of non-zero elements. Some approaches incorrectly swap non-zero elements with each other or move them out of sequence. The two-pointer technique works because the left pointer only advances when a non-zero element is placed, ensuring all non-zero elements shift left in their original order while zeros naturally accumulate at the end. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "reverse-string",
        "title": "Reverse String",
        "difficulty": "Easy",
        "category": "String",
        "tags": [
            "string",
            "two-pointers"
        ],
        "description": "You are given an array of characters which represents a string s. Write a function which reverses a string. You must do this by modifying the input array in-place with O(1) extra memory.",
        "constraints": [],
        "examples": [
            {
                "input": "s = [\"n\",\"e\",\"e\",\"t\"]",
                "output": "[\"t\",\"e\",\"e\",\"n\"]",
                "explanation": ""
            },
            {
                "input": "s = [\"r\",\"a\",\"c\",\"e\",\"c\",\"a\",\"r\"]",
                "output": "[\"r\",\"a\",\"c\",\"e\",\"c\",\"a\",\"r\"]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\nn e e t",
                "expectedOutput": "\"t\" \"e\" \"e\" \"n\""
            },
            {
                "input": "7\nr a c e c a r",
                "expectedOutput": "\"r\" \"a\" \"c\" \"e\" \"c\" \"a\" \"r\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void reverseString() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Array\n\nThe simplest approach is to build the reversed string in a separate array. We iterate through the original array from the end to the beginning, collecting characters in a new temporary array. Then we copy the reversed characters back to the original array. This works because reading backward gives us characters in reverse order.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Recursion\n\nWe can reverse a string recursively by thinking of it as swapping the outermost characters, then reversing the inner substring. If we have pointers at both ends (l and r), we first recurse to handle the inner portion, then swap the current pair on the way back up. This naturally reverses the array through the call stack.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Stack\n\nA stack follows Last-In-First-Out (LIFO) order, which is perfect for reversing. If we push all characters onto a stack, then pop them off one by one, we get the characters in reverse order. This exploits the stack's natural behavior to achieve the reversal.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Built-In Function\n\nMost programming languages provide a built-in method to reverse arrays or lists. These functions are typically optimized and handle the reversal in place efficiently. While this approach is the simplest to write, it hides the underlying algorithm.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n5. Two Pointers\n\nThe most efficient approach uses two pointers starting at opposite ends of the array. We swap the characters at these pointers, then move them toward each other. When the pointers meet or cross, every character has been swapped exactly once, and the array is reversed. This achieves O(1) space since we only swap in place.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Using Incorrect Loop Termination Condition\nWhen using two pointers, the loop should terminate when l >= r, not when l > r. Using l != r works for odd-length strings but is less intuitive. The condition l < r correctly handles both even and odd length arrays. \n\n• Returning a New String Instead of Modifying In-Place\nThe problem requires modifying the input array in-place. A common mistake is creating a new reversed array or string and returning it, which violates the in-place requirement and uses unnecessary extra space. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "squares-of-a-sorted-array",
        "title": "Squares Of A Sorted Array",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array",
            "two-pointers"
        ],
        "description": "You are given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [-4,-1,0,3,10]",
                "output": "[0,1,9,16,100]",
                "explanation": ""
            },
            {
                "input": "nums = [-7,-3,2,3,11]",
                "output": "[4,9,9,49,121]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "5\n-4 -1 0 3 10",
                "expectedOutput": "0 1 9 16 100"
            },
            {
                "input": "5\n-7 -3 2 3 11",
                "expectedOutput": "4 9 9 49 121"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void squaresOfASortedArray() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nThe straightforward approach is to square each element first and then sort the result. While the original array is sorted, squaring can change the order since negative numbers become positive. For example, [-4, -1, 0, 3] becomes [16, 1, 0, 9] after squaring, which needs to be sorted to [0, 1, 9, 16].\n\nComplexity:\nTime: O(nlog n)\nSpace: O(1)\n\n\n2. Two Pointers - I\n\nSince the input array is sorted, the largest squares will be at either end (the most negative or most positive values). By using two pointers at both ends, we can compare absolute values and always pick the larger square. This builds the result in descending order, which we then reverse.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Two Pointers - II\n\nThis is an optimization of the previous approach that avoids the final reversal step. Instead of building the result from smallest to largest and reversing, we fill the result array from the end to the beginning. We still use two pointers to compare the absolute values at both ends, but we place each square directly in its final position.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Assuming Squares Preserve Sorted Order\nA common mistake is assuming that squaring a sorted array keeps it sorted. This is false when negative numbers are present because squaring makes them positive, potentially larger than squared positive numbers. For example, [-4, -1, 0, 3] becomes [16, 1, 0, 9], which is not sorted. \n\n• Forgetting to Handle Negative Numbers with Two Pointers\nWhen using two pointers, comparing nums[l] and nums[r] directly instead of their absolute values or squares leads to incorrect results. Negative numbers at the left end may have larger squares than positive numbers at the right end, so always compare absolute values or squared values. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "valid-palindrome-ii",
        "title": "Valid Palindrome Ii",
        "difficulty": "Easy",
        "category": "String",
        "tags": [
            "string",
            "two-pointers"
        ],
        "description": "You are given a string s, return true if the s can be a palindrome after deleting at most one character from it. A palindrome is a string that reads the same forward and backward. Note: Alphanumeric characters consist of letters (A-Z, a-z) and numbers (0-9).",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"aca\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"abbadc\"",
                "output": "false",
                "explanation": ""
            },
            {
                "input": "s = \"abbda\"",
                "output": "true",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "aca",
                "expectedOutput": "true"
            },
            {
                "input": "abbadc",
                "expectedOutput": "false"
            },
            {
                "input": "abbda",
                "expectedOutput": "true"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void validPalindromeIi() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe simplest approach is to check every possibility. First, check if the string is already a palindrome. If not, try removing each character one at a time and check if the resulting string becomes a palindrome. If any removal produces a palindrome, return true. This guarantees we find a solution if one exists, but it requires checking up to n different strings.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Two Pointers\n\nInstead of blindly trying every removal, we can be smarter. Use two pointers starting from both ends of the string and move them inward. As long as characters match, keep going. When we find a mismatch, we know exactly where the problem is. At this point, we have only two choices: remove the left character or remove the right character. We check if either choice results in a palindrome for the remaining substring.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Two Pointers (Optimal)\n\nThe previous two-pointer solution creates new substrings, which costs O(n) space. We can optimize this by passing index bounds to our palindrome check function instead of creating new strings. This way, we check the same characters without allocating extra memory. The logic remains identical: find the first mismatch, then verify if skipping either character leads to a valid palindrome.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Only Trying One Deletion Option\nWhen a mismatch is found at positions l and r, you must check both possibilities: removing the character at l or removing the character at r. A common mistake is only trying one option (like always removing the left character). Both substrings s[l+1...r] and s[l...r-1] must be checked, and the answer is true if either forms a palindrome. \n\n• Forgetting That Zero Deletions Is Valid\nThe problem asks if the string can become a palindrome by deleting at most one character. This includes deleting zero characters. If the original string is already a palindrome, the answer is true. Some solutions only consider the deletion case and forget to check if the string is already valid as-is. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "best-time-to-buy-and-sell-stock",
        "title": "Best Time To Buy And Sell Stock",
        "difficulty": "Easy",
        "category": "Array",
        "tags": [
            "array",
            "sliding-window"
        ],
        "description": "You are given an integer array prices where prices[i] is the price of NeetCoin on the ith day. You may choose a single day to buy one NeetCoin and choose a different day in the future to sell it. Return the maximum profit you can achieve. You may choose to not make any transactions, in which case the profit would be 0.",
        "constraints": [],
        "examples": [
            {
                "input": "prices = [10,1,5,6,7,1]",
                "output": "6",
                "explanation": ""
            },
            {
                "input": "prices = [10,8,7,5,2]",
                "output": "0",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\n10 1 5 6 7 1",
                "expectedOutput": "6"
            },
            {
                "input": "5\n10 8 7 5 2",
                "expectedOutput": "0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void bestTimeToBuyAndSellStock() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe brute-force approach checks every possible buy–sell pair.For each day, we pretend to buy the stock, and then we look at all the future days to see what the best selling price would be.Among all these profits, we keep the highest one.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Two Pointers\n\nWe want to buy at a low price and sell at a higher price that comes after it.Using two pointers helps us track this efficiently:\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n3. Dynamic Programming\n\nAs we scan through the prices, we keep track of two things:\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Selling Before Buying\nThe sell day must come after the buy day. Calculating prices[i] - prices[j] where j > i means you're selling in the past, which is invalid. \n\n• Returning Negative Profit\nIf prices only decrease, the maximum profit is 0 (don't trade), not a negative number. Always ensure the result is at least 0. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "longest-substring-without-repeating-characters",
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "category": "String",
        "tags": [
            "string",
            "sliding-window"
        ],
        "description": "Given a string s, find the length of the longest substring without duplicate characters. A substring is a contiguous sequence of characters within a string.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"zxyzxyz\"",
                "output": "3",
                "explanation": ""
            },
            {
                "input": "s = \"xxxx\"",
                "output": "1",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "zxyzxyz",
                "expectedOutput": "3"
            },
            {
                "input": "xxxx",
                "expectedOutput": "1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void longestSubstringWithoutRepeatingCharacters() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe brute-force idea is to try starting a substring at every index and keep extending it until we see a repeated character.For each starting point, we use a set to track the characters we’ve seen so far.As soon as a duplicate appears, that substring can’t grow anymore, so we stop and record its length.By doing this for every index, we are guaranteed to find the longest valid substring, though the approach is slow.\n\nComplexity:\nTime: O(n * m)\nSpace: O(m)\n\n\n2. Sliding Window\n\nInstead of restarting at every index like brute force, we can keep one window that always has unique characters.We expand the window by moving the right pointer.If we ever see a repeated character, we shrink the window from the left until the duplicate is removed.This way, the window always represents a valid substring, and we track its maximum size.It's efficient because each character is added and removed at most once.\n\nComplexity:\nTime: O(n)\nSpace: O(m)\n\n\n3. Sliding Window (Optimal)\n\nInstead of removing characters one by one when we see a repeat, we can jump the left pointer directly to the correct position.We keep a map that stores the last index where each character appeared.When a character repeats, the earliest valid starting point moves to one position after its previous occurrence.This lets us adjust the window in one step and always keep it valid, making the approach fast and clean.\n\nComplexity:\nTime: O(n)\nSpace: O(m)\n\n\nCommon Pitfalls\n\n• Not Taking the Maximum When Jumping the Left Pointer\nIn the optimal sliding window approach, when you find a duplicate character, you should move the left pointer to max(left, lastIndex[char] + 1). Forgetting the max operation can cause the left pointer to move backwards if the duplicate character's last occurrence is before the current window start, leading to incorrect results. \n\n• Forgetting to Update the Character's Last Index\nAfter processing each character, you must update its last seen index in the map, regardless of whether it was a duplicate. Failing to update the index means future duplicate checks will reference stale positions, causing incorrect window calculations. \n\n• Off-by-One in Window Size Calculation\nWhen calculating the substring length, ensure you use right - left + 1 since both indices are inclusive. Using right - left will undercount the length by one, resulting in an answer that is consistently one less than correct. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "minimum-window-substring",
        "title": "Minimum Window Substring",
        "difficulty": "Hard",
        "category": "String",
        "tags": [
            "string",
            "sliding-window"
        ],
        "description": "Given two strings s and t, return the shortest substring of s such that every character in t, including duplicates, is present in the substring. If such a substring does not exist, return an empty string \"\". You may assume that the correct output is always unique.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"OUZODYXAZV\", t = \"XYZ\"",
                "output": "\"YXAZ\"",
                "explanation": ""
            },
            {
                "input": "s = \"xyz\", t = \"xyz\"",
                "output": "\"xyz\"",
                "explanation": ""
            },
            {
                "input": "s = \"x\", t = \"xy\"",
                "output": "\"\"",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "OUZODYXAZV\nXYZ",
                "expectedOutput": "\"YXAZ\""
            },
            {
                "input": "xyz\nxyz",
                "expectedOutput": "\"xyz\""
            },
            {
                "input": "x\nxy",
                "expectedOutput": "\"\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void minimumWindowSubstring() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe want the smallest substring of s that contains all characters of t (with the right counts).The brute-force way is to try every possible substring of s and check whether it covers all the characters in t.For each starting index, we expand the end index and keep a frequency map for the current substring.Whenever the substring has all required characters, we see if it's the smallest one so far.This is simple to understand but very slow because we check many overlapping substrings.\n\nComplexity:\nTime: O(n2 * m)\nSpace: O(m)\n\n\n2. Sliding Window\n\nWe want the smallest window in s that contains all characters of t (with the right counts).Instead of checking all substrings, we use a sliding window:\n\nComplexity:\nTime: O(n+m)\nSpace: O(m)\n\n\nCommon Pitfalls\n\n• Not Handling Duplicate Characters in Target\nThe target string t may contain duplicate characters (e.g., \"AAB\"). Simply checking for character presence is insufficient; you must track the exact count of each character and ensure the window contains at least that many occurrences. \n\n• Shrinking the Window Too Aggressively\nWhen contracting the window from the left, some implementations remove characters before checking if the window is still valid. Always update the result before shrinking, and only shrink while the window remains valid. \n\n• Incorrect Validity Check Logic\nUsing have == need requires careful management: have should only increment when a character's count exactly reaches the required amount, and only decrement when it falls below. Incrementing have every time a required character is added leads to overcounting. \n\n• Forgetting to Handle Empty Target String\nWhen t is empty, the minimum window is an empty string. Failing to handle this edge case at the start can lead to unexpected behavior or incorrect results. \n\n• Off-by-One Errors in Substring Extraction\nWhen storing and returning the result window, confusing inclusive vs. exclusive bounds leads to returning a substring that is one character too short or too long. Ensure consistency between how you store indices and how you extract the final substring. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "sliding-window-maximum",
        "title": "Sliding Window Maximum",
        "difficulty": "Hard",
        "category": "Array",
        "tags": [
            "array",
            "sliding-window",
            "deque"
        ],
        "description": "You are given an array of integers nums and an integer k. There is a sliding window of size k that starts at the left edge of the array. The window slides one position to the right until it reaches the right edge of the array. Return a list that contains the maximum element in the window at each step.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,1,0,4,2,6], k = 3",
                "output": "[2,2,4,4,6]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n1 2 1 0 4 2 6\n3",
                "expectedOutput": "2 2 4 4 6"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void slidingWindowMaximum() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nFor every possible window of size k, we simply look at all k elements and pick the maximum.We slide the window one step at a time, and each time we scan all elements inside it to find the max.This method is very easy to understand but slow, because we repeatedly re-scan many of the same elements.\n\nComplexity:\nTime: O(n * k)\nSpace: O(1)\n\n\n2. Segment Tree\n\nThe brute-force solution recomputes the maximum for every window by scanning all k elements each time, which is slow.A Segment Tree helps us answer “what is the maximum in this range?” much faster after some preprocessing.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n3. Heap\n\nWe want to quickly get the maximum value inside a sliding window that moves across the array.A max-heap is perfect for this because it always lets us access the largest element instantly.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n4. Dynamic Programming\n\nInstead of recalculating the maximum for each sliding window, we can preprocess the array so that every window’s maximum can be answered in O(1) time.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n5. Deque\n\nA deque helps us efficiently track the maximum inside the sliding window.The key idea is to keep the deque storing indices of elements in decreasing order of their values.This guarantees that:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Storing Values Instead of Indices in the Deque\nWhen using the deque approach, a common mistake is storing the actual values rather than their indices. Storing values makes it impossible to determine when an element has left the window, since you cannot compare positions. Always store indices in the deque and use nums[index] to access values. \n\n• Incorrect Window Boundary Checks\nMany solutions fail by using wrong conditions for when to start recording results or when to shrink the window. The first valid window exists when right >= k - 1 (or equivalently right + 1 >= k). Off-by-one errors here cause either missing the first window's maximum or including results before the window is fully formed. \n\n• Not Maintaining Decreasing Order in Deque\nThe deque must maintain indices in decreasing order of their corresponding values. A common bug is using <= instead of < when comparing values before popping, or forgetting to pop elements altogether. This results in the front of the deque not representing the actual maximum. Always pop from the back while nums[deque.back()] < nums[current]. \n\n• Forgetting to Handle the Output Array Size\nThe number of windows is n - k + 1, not n or n - k. Allocating an output array of the wrong size leads to index out of bounds errors or missing results. This is especially problematic when k equals the array length, where there should be exactly one result. \n\n• Incorrect Segment Tree Range Queries\nWhen using segment trees, a frequent mistake is confusing inclusive versus exclusive range boundaries. The query range [i, i + k - 1] is inclusive on both ends for a window starting at index i. Mixing up these boundaries causes queries to include elements outside the window or miss elements at the boundaries. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "category": "Stack",
        "tags": [
            "string",
            "stack"
        ],
        "description": "You are given a string s consisting of the following characters: '(', ')', '{', '}', '[' and ']'. The input string s is valid if and only if: Return true if s is a valid string, and false otherwise.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"[]\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"([{}])\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"[(])\"",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "[]",
                "expectedOutput": "true"
            },
            {
                "input": "([{}])",
                "expectedOutput": "true"
            },
            {
                "input": "[(])",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void validParentheses() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe idea is simple:valid parentheses must always appear in matching pairs like \"()\", \"{}\", or \"[]\".So if the string is valid, we can repeatedly remove these matching pairs until nothing is left.If, after removing all possible pairs, the string becomes empty, then the parentheses were properly matched.Otherwise, some unmatched characters remain, meaning the string is invalid.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Stack\n\nValid parentheses must follow a last-opened, first-closed order — just like stacking plates.So we use a stack to track opening brackets.Whenever we see a closing bracket, we simply check whether it matches the most recent opening bracket on top of the stack.If it matches, we remove that opening bracket.If it doesn't match (or the stack is empty), the string is invalid.A valid string ends with an empty stack.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Checking Stack Empty Before Popping\nWhen encountering a closing bracket, you must verify the stack is not empty before checking the top element. Attempting to pop from an empty stack causes an error. \n\n• Forgetting to Check if Stack is Empty at the End\nAfter processing all characters, some opening brackets might remain unmatched. The string \"(()\" processes without errors but leaves \"(\" on the stack, making it invalid. \n\n• Mixing Up Opening and Closing Brackets\nWhen building the bracket mapping, ensure closing brackets map to their corresponding opening brackets, not the other way around. The lookup should happen when you encounter a closing bracket. \n\n• Using Wrong Data Structure\nUsing a queue instead of a stack fails because parentheses follow LIFO (last-in, first-out) order. The most recent opening bracket must be closed first, which requires stack behavior. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "evaluate-reverse-polish-notation",
        "title": "Evaluate Reverse Polish Notation",
        "difficulty": "Medium",
        "category": "Stack",
        "tags": [
            "stack"
        ],
        "description": "You are given an array of strings tokens that represents a valid arithmetic expression in Reverse Polish Notation. Return the integer that represents the evaluation of the expression.",
        "constraints": [],
        "examples": [
            {
                "input": "tokens = [\"1\",\"2\",\"+\",\"3\",\"*\",\"4\",\"-\"]",
                "output": "5",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n1 2 + 3 * 4 -",
                "expectedOutput": "5"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void evaluateReversePolishNotation() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nReverse Polish Notation (RPN) evaluates expressions without parentheses by applying each operator to the two most recent numbers.The brute-force idea is to repeatedly scan the list until we find an operator.When we do, we take the two numbers before it, compute the result, and replace all three tokens with the result.We continue compressing the list this way until only one value remains—the final answer.This approach works but is slow because we repeatedly rebuild and rescan the list.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Doubly Linked List\n\nIn Reverse Polish Notation, every operator works on the two most recent numbers before it.A doubly linked list lets us move both left and right easily, so when we find an operator, we can quickly reach the two numbers before it.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Recursion\n\nReverse Polish Notation works naturally with recursion because every operator applies to the two most recent values that come before it.If we process the expression from the end, every time we see:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Stack\n\nA stack fits Reverse Polish Notation perfectly because the most recent numbers are always the ones used next.As we scan the tokens:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Wrong Operand Order for Subtraction and Division\nFor subtraction and division, the order matters: the second-to-last operand is the left operand, and the last operand is the right operand. When you pop from a stack, the first pop gives you the right operand (b), and the second pop gives you the left operand (a). Computing b - a or b / a instead of a - b or a / b will produce incorrect results. \n\n• Incorrect Integer Division Truncation\nDivision in RPN truncates toward zero, not toward negative infinity. In languages like Python 2 or when using floor division, -7 / 2 gives -4, but the correct RPN result is -3. You must use truncation toward zero, such as int(a / b) in Python 3 or Math.trunc() in JavaScript. \n\n• Treating Negative Numbers as Operators\nTokens like \"-3\" are valid negative numbers, not the subtraction operator followed by \"3\". When checking if a token is an operator, you cannot simply check if the first character is -. Instead, check if the token equals exactly \"+\", \"-\", \"*\", or \"/\", or verify that the token has length 1 when it starts with an operator character. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "daily-temperatures",
        "title": "Daily Temperatures",
        "difficulty": "Medium",
        "category": "Stack",
        "tags": [
            "array",
            "stack"
        ],
        "description": "You are given an array of integers temperatures where temperatures[i] represents the daily temperatures on the ith day. Return an array result where result[i] is the number of days after the ith day before a warmer temperature appears on a future day. If there is no day in the future where a warmer temperature will appear for the ith day, set result[i] to 0 instead.",
        "constraints": [],
        "examples": [
            {
                "input": "temperatures = [30,38,30,36,35,40,28]",
                "output": "[1,4,1,2,1,0,0]",
                "explanation": ""
            },
            {
                "input": "temperatures = [22,21,20]",
                "output": "[0,0,0]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n30 38 30 36 35 40 28",
                "expectedOutput": "1 4 1 2 1 0 0"
            },
            {
                "input": "3\n22 21 20",
                "expectedOutput": "0 0 0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void dailyTemperatures() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nFor each day, we simply look forward to find the next day with a higher temperature.We compare the current day with every future day until we either find a warmer one or reach the end.If we find a warmer day, we record how many days it took.If not, the answer is 0.This method is easy to understand but slow because every day may scan many days ahead.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Stack\n\nWe want to know how long it takes until a warmer day for each temperature.A stack helps because it keeps track of days that are still waiting for a warmer temperature.As we scan forward, whenever we find a temperature higher than the one on top of the stack, it means we just discovered the “next warmer day” for that earlier day.We pop it, compute the difference in days, and continue.This way, each day is pushed and popped at most once, making the process efficient.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Dynamic Programming\n\nInstead of checking every future day one by one, we can reuse previously computed answers.If day j is not warmer than day i, we don’t need to move forward step-by-step — we can simply jump ahead by using the result already stored for day j.This lets us skip many unnecessary comparisons.By working backward and using these jumps, we efficiently find the next warmer day for each position.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Using Greater-Than-or-Equal Instead of Strictly Greater\nThe problem asks for the next warmer day, meaning strictly greater temperature. Using >= instead of > causes the algorithm to stop at equal temperatures, producing incorrect results. \n\n• Storing Only Indices Without Temperature Access\nWhen using a stack, you need to compare temperatures. Storing only indices works if you can access temperatures[index], but mixing up index and value access leads to comparison errors. \n\n• Off-by-One Errors in Day Counting\nThe result should be the number of days to wait, which is the difference in indices. Initializing count wrong or miscalculating the difference leads to off-by-one errors. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "car-fleet",
        "title": "Car Fleet",
        "difficulty": "Medium",
        "category": "Stack",
        "tags": [
            "array",
            "stack"
        ],
        "description": "There are n cars traveling to the same destination on a one-lane highway. You are given two arrays of integers position and speed, both of length n.  The destination is at position target miles. A car can not pass another car ahead of it. It can only catch up to another car and then drive at the same speed as the car ahead of it. A car fleet is a non-empty set of cars driving at the same position and same speed. A single car is also considered a car fleet. If a car catches up to a car fleet the moment the fleet reaches the destination, then the car is considered to be part of the fleet. Return the number of different car fleets that will arrive at the destination.",
        "constraints": [],
        "examples": [
            {
                "input": "target = 10, position = [1,4], speed = [3,2]",
                "output": "1",
                "explanation": ""
            },
            {
                "input": "target = 10, position = [4,1,0,7], speed = [2,2,1,1]",
                "output": "3",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "10\n2\n1 4\n2\n3 2",
                "expectedOutput": "1"
            },
            {
                "input": "10\n4\n4 1 0 7\n4\n2 2 1 1",
                "expectedOutput": "3"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void carFleet() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Stack\n\nCars that start closer to the target are processed first.For each car, we compute the time it will take to reach the target.If a car behind reaches the target no faster than the car in front, it will eventually catch up and join the same fleet.So we only keep the car’s time if it forms a new fleet; otherwise, it merges with the previous one.Using a stack helps us easily compare each car’s time with the fleet ahead of it.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n2. Iteration\n\nAfter sorting cars from closest to the target to farthest, we calculate how long each one needs to reach the target.A car forms a new fleet only if it takes longer than the fleet in front of it.If it takes the same time or less, it will eventually catch up and merge into that fleet.So instead of using a stack, we just keep track of the most recent fleet time.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Sorting in the Wrong Order\nSorting cars by position in ascending order (farthest from target first) instead of descending order causes incorrect fleet merging. Cars must be processed from closest to the target first, since a car behind can only merge with the fleet ahead of it. \n\n• Using Strict Less Than for Fleet Merging\nUsing < instead of <= when comparing arrival times misses the case where two cars arrive at exactly the same time. If a car behind arrives at the same time or earlier than the car ahead, it joins that fleet. \n\n• Integer Division Instead of Float Division\nIn languages like Java or C++, dividing two integers results in integer division, which truncates the decimal part. Since arrival times are often fractional, this leads to incorrect comparisons and wrong fleet counts. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "largest-rectangle-in-histogram",
        "title": "Largest Rectangle In Histogram",
        "difficulty": "Hard",
        "category": "Stack",
        "tags": [
            "array",
            "stack"
        ],
        "description": "You are given an array of integers heights where heights[i] represents the height of a bar. The width of each bar is 1. Return the area of the largest rectangle that can be formed among the bars. Note: This chart is known as a histogram.",
        "constraints": [],
        "examples": [
            {
                "input": "heights = [7,1,7,2,2,4]",
                "output": "8",
                "explanation": ""
            },
            {
                "input": "heights = [1,3,7]",
                "output": "7",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\n7 1 7 2 2 4",
                "expectedOutput": "8"
            },
            {
                "input": "3\n1 3 7",
                "expectedOutput": "7"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void largestRectangleInHistogram() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nFor every bar, we try to treat it as the shortest bar in the rectangle.To find how wide this rectangle can extend, we look left and right until we hit a bar shorter than the current one.The width between these two boundaries gives the largest rectangle where this bar is the limiting height.We repeat this for every bar and keep track of the maximum rectangle found.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Divide And Conquer (Segment Tree)\n\nA large rectangle in the histogram must have some bar as its shortest bar.If we know the index of the minimum height bar in any range, then:\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n3. Stack\n\nFor each bar, we want to know how far it can stretch left and right before bumping into a shorter bar.That distance tells us the widest rectangle where this bar is the limiting height.To efficiently find the nearest smaller bar on both sides, we use a monotonic stack that keeps indices of bars in increasing height order.This lets us compute boundaries in linear time instead of checking outward for every bar.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Stack (One Pass)\n\nWe want, for each bar, the widest area where it can act as the shortest bar.With a single pass and a stack, we can do this on the fly:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n5. Stack (Optimal)\n\nWe want, for every bar, to know how wide it can stretch while still being the shortest bar in that rectangle.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Off-by-One Errors in Width Calculation\nWhen computing the width of a rectangle, it is easy to miscalculate the boundaries. The width should be right - left - 1 when left and right are the indices of the nearest smaller bars (exclusive boundaries). Forgetting to subtract 1 or using inclusive boundaries incorrectly leads to wrong area calculations. \n\n• Forgetting to Process Remaining Stack Elements\nAfter iterating through all bars, the stack may still contain indices of bars that never encountered a shorter bar to their right. These bars can extend all the way to the end of the histogram. Failing to pop and process these remaining elements misses potentially valid rectangles. \n\n• Using Strict vs Non-Strict Inequality\nWhen comparing heights to decide whether to pop from the stack, using > versus >= matters. Using strict greater-than may cause bars of equal height to remain on the stack incorrectly, leading to wrong boundary calculations. The choice depends on how you handle the left boundary for bars with equal heights. \n\n• Incorrect Handling of Empty Stack\nWhen the stack becomes empty while computing the left boundary, it means no shorter bar exists to the left. The width should extend from index 0 to the current position. Using stack[-1] or stack.top() on an empty stack causes runtime errors or incorrect results if not handled explicitly. \n\n• Not Handling Single-Element Arrays\nEdge cases like arrays with a single bar or all bars having the same height require careful handling. The algorithm should correctly return the height of the single bar or the product of height and array length for uniform arrays without special-case bugs. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "binary-search",
        "title": "Binary Search",
        "difficulty": "Easy",
        "category": "Binary Search",
        "tags": [
            "array",
            "binary-search"
        ],
        "description": "You are given an array of distinct integers nums, sorted in ascending order, and an integer target. Implement a function to search for target within nums. If it exists, then return its index, otherwise, return -1. Your solution must run in O(logn)O(log n)O(logn) time.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [-1,0,2,4,6,8], target = 4",
                "output": "3",
                "explanation": ""
            },
            {
                "input": "nums = [-1,0,2,4,6,8], target = 3",
                "output": "-1",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\n-1 0 2 4 6 8\n4",
                "expectedOutput": "3"
            },
            {
                "input": "6\n-1 0 2 4 6 8\n3",
                "expectedOutput": "-1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void binarySearch() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursive Binary Search\n\nBinary search works by repeatedly cutting the search space in half.Instead of scanning the entire array, we check the middle element:\n\nComplexity:\nTime: O(log n)\nSpace: O(log n)\n\n\n2. Iterative Binary Search\n\nBinary search checks the middle element of a sorted array and decides which half to discard.Instead of using recursion, the iterative approach keeps shrinking the search range using a loop.We adjust the left and right pointers until we either find the target or the pointers cross, meaning the target isn’t present.\n\nComplexity:\nTime: O(log n)\nSpace: O(1)\n\n\n3. Upper Bound\n\nUpper bound binary search finds the first index where a value greater than the target appears.Once we know that position, the actual target—if it exists—must be right before it.So instead of directly searching for the target, we search for the boundary where values stop being ≤ target.Then we simply check whether the element just before that boundary is the target.\n\nComplexity:\nTime: O(log n)\nSpace: O(1)\n\n\n4. Lower Bound\n\nLower bound binary search finds the first index where a value is greater than or equal to the target.This means if the target exists in the array, this lower-bound index will point exactly to its first occurrence.So instead of directly searching for equality, we search for the leftmost position where the target could appear, then verify it.\n\nComplexity:\nTime: O(log n)\nSpace: O(1)\n\n\n5. Built-In Function\n\nInput: nums = [-1, 0, 3, 5, 9, 12], target = 9\n\nComplexity:\nTime: O(log n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Integer Overflow When Calculating Mid\nUsing (l + r) / 2 can overflow when l and r are large. Use l + (r - l) / 2 instead to safely compute the midpoint. \n\n• Infinite Loop Due to Wrong Pointer Update\nUpdating l = m instead of l = m + 1 (or r = m instead of r = m - 1 in some variants) can cause an infinite loop when l and r are adjacent. \n\n• Off-by-One Errors with Loop Condition\nUsing while l <= r vs while l < r changes the behavior significantly. Mixing these up with the wrong pointer updates causes bugs. Be consistent with your chosen template. \n\n• Not Checking if Target Was Actually Found\nBinary search converges to a position, but that position might not contain the target. Always verify that nums[result] == target before returning the index. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "search-a-2d-matrix",
        "title": "Search A 2D Matrix",
        "difficulty": "Medium",
        "category": "Binary Search",
        "tags": [
            "matrix",
            "binary-search"
        ],
        "description": "You are given an m x n 2-D integer array matrix and an integer target. Return true if target exists within matrix or false otherwise. Can you write a solution that runs in O(log(m * n)) time?",
        "constraints": [],
        "examples": [
            {
                "input": "matrix = [[1,2,4,8],[10,11,12,13],[14,20,30,40]], target = 10",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "matrix = [[1,2,4,8],[10,11,12,13],[14,20,30,40]], target = 15",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1,2,4,8 10,11,12,13 14,20,30,40\n10",
                "expectedOutput": "true"
            },
            {
                "input": "3\n1,2,4,8 10,11,12,13 14,20,30,40\n15",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void searchA-2dMatrix() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe brute force approach simply checks every element in the matrix one by one.Since the matrix is sorted but we're ignoring that structure, we just scan through all rows and all columns until we either find the target or finish searching.\n\nComplexity:\nTime: O(m * n)\nSpace: O(1)\n\n\n2. Staircase Search\n\nSince each row is sorted left-to-right and each column is sorted top-to-bottom, we can search smartly instead of checking every cell.\n\nComplexity:\nTime: O(m+n)\nSpace: O(1)\n\n\n3. Binary Search\n\nBecause each row of the matrix is sorted, and the rows themselves are sorted by their first and last elements, we can apply binary search twice:\n\nComplexity:\nTime: O(log m+log n)\nSpace: O(1)\n\n\n4. Binary Search (One Pass)\n\nBecause the matrix is sorted row-wise and each row is sorted left-to-right, the entire matrix behaves like one big sorted array.If we imagine flattening the matrix into a single list, the order of elements doesn't change.\n\nComplexity:\nTime: O(log(m * n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Confusing Row vs Column Indexing\nWhen converting a 1D index to 2D coordinates in the one-pass binary search approach, it is easy to mix up row = m // COLS and col = m % COLS. Using ROWS instead of COLS in these formulas will produce incorrect indices and lead to wrong answers or out-of-bounds errors. \n\n• Off-by-One Errors in Row Selection\nIn the two-pass binary search approach, after identifying the candidate row, forgetting to recalculate row = (top + bot) // 2 before the second binary search can cause you to search in the wrong row. Similarly, checking top <= bot incorrectly after the first loop can lead to false negatives. \n\n• Not Handling Empty Matrix\nFailing to check if the matrix is empty or if any row is empty before accessing matrix[0] will cause runtime errors. Always validate that both ROWS > 0 and COLS > 0 before proceeding with the search. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "time-based-key-value-store",
        "title": "Time Based Key Value Store",
        "difficulty": "Medium",
        "category": "Binary Search",
        "tags": [
            "hash-table",
            "binary-search",
            "design"
        ],
        "description": "Implement a time-based key-value data structure that supports: Implement the TimeMap class: Note: For all calls to set, the timestamps are in strictly increasing order.",
        "constraints": [],
        "examples": [
            {
                "input": "[\"TimeMap\", \"set\", [\"alice\", \"happy\", 1], \"get\", [\"alice\", 1], \"get\", [\"alice\", 2], \"set\", [\"alice\", \"sad\", 3], \"get\", [\"alice\", 3]]",
                "output": "[null, null, \"happy\", \"happy\", null, \"sad\"]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "",
                "expectedOutput": "null  null  \"happy\"  \"happy\"  null  \"sad\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void timeBasedKeyValueStore() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe want to store values for a key along with timestamps, and when someone asks for a value at a given time, we must return the latest value set at or before that timestamp.\n\nComplexity:\nTime: O(1)\nSpace: O(m * n)\n\n\n2. Binary Search (Sorted Map)\n\nFor each key, we store all its (timestamp, value) pairs in sorted order by timestamp.\n\nComplexity:\nTime: O(n)\nSpace: O(m * n)\n\n\n3. Binary Search (Array)\n\nEach key stores its values in the order they were inserted, and timestamps are guaranteed to be increasing for each key.This means we can keep a simple list of (value, timestamp) pairs for every key.\n\nComplexity:\nTime: O(1)\nSpace: O(m * n)\n\n\nCommon Pitfalls\n\n• Using Exact Match Instead of Floor Search\nA common mistake is searching for an exact timestamp match instead of finding the largest timestamp less than or equal to the query. Binary search should find the rightmost value satisfying timestamp <= query, not an exact match. If no exact match exists but earlier timestamps do, returning an empty string is incorrect. \n\n• Off-By-One Errors in Binary Search\nBinary search boundaries are tricky. Using bisect_left instead of bisect_right, or not adjusting the index after the search, leads to returning values from timestamps greater than the query. Always verify your binary search returns the correct floor value by testing edge cases like querying before any set operation. \n\n• Returning Empty String When Key Exists But Timestamp Is Too Early\nWhen a key exists but all stored timestamps are greater than the query timestamp, the correct behavior is to return an empty string. Some implementations incorrectly return the earliest stored value instead. Always check that your found index is valid (non-negative) before accessing the value. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "reverse-linked-list",
        "title": "Reverse Linked List",
        "difficulty": "Easy",
        "category": "Linked List",
        "tags": [
            "linked-list"
        ],
        "description": "Given the beginning of a singly linked list head, reverse the list, and return the new beginning of the list.",
        "constraints": [],
        "examples": [
            {
                "input": "head = [0,1,2,3]",
                "output": "[3,2,1,0]",
                "explanation": ""
            },
            {
                "input": "head = []",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n0 1 2 3",
                "expectedOutput": "3 2 1 0"
            },
            {
                "input": "0",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void reverseLinkedList() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nReversing a linked list using recursion works by thinking in terms of \"reverse the rest, then fix the pointer for the current node.\"When we recursively go to the end of the list, that last node becomes the new head.While the recursion unwinds, each node points backward to the one that called it.Finally, we set the original head's next to null to finish the reversal.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Iteration\n\nReversing a linked list iteratively is all about flipping pointers one step at a time.We walk through the list from left to right, and for each node, we redirect its next pointer to point to the node behind it.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Losing the Reference to the Next Node\nWhen reversing a linked list iteratively, you must save the next node before modifying the current node's pointer. A common mistake is writing curr.next = prev before storing curr.next in a temporary variable, which causes you to lose access to the rest of the list and breaks the traversal. \n\n• Forgetting to Set the Original Head's Next to Null\nIn the recursive approach, after reversing the rest of the list, the original head becomes the new tail. Forgetting to set head.next = null creates a cycle in the list, where the last two nodes point to each other, leading to infinite loops when traversing the reversed list. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "reorder-list",
        "title": "Reorder List",
        "difficulty": "Medium",
        "category": "Linked List",
        "tags": [
            "linked-list"
        ],
        "description": "You are given the head of a singly linked-list. The positions of a linked list of length = 7 for example, can intially be represented as: [0, 1, 2, 3, 4, 5, 6] Reorder the nodes of the linked list to be in the following order: [0, 6, 1, 5, 2, 4, 3] Notice that in the general case for a list of length = n the nodes are reordered to be in the following order: [0, n-1, 1, n-2, 2, n-3, ...] You may not modify the values in the list's nodes, but instead you must reorder the nodes themselves.",
        "constraints": [],
        "examples": [
            {
                "input": "head = [2,4,6,8]",
                "output": "[2,8,4,6]",
                "explanation": ""
            },
            {
                "input": "head = [2,4,6,8,10]",
                "output": "[2,10,4,8,6]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n2 4 6 8",
                "expectedOutput": "2 8 4 6"
            },
            {
                "input": "5\n2 4 6 8 10",
                "expectedOutput": "2 10 4 8 6"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void reorderList() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nTo reorder the linked list in the pattern:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Recursion\n\nThis recursive approach reorders the list by pairing nodes from the front and back during the recursion unwind phase.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Reverse And Merge\n\nTo reorder the list into the patternL1 → Ln → L2 → Ln−1 → L3 → Ln−2 → ...,we can break the problem into three simple steps:\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Incorrectly Finding the Middle Node\nThe slow/fast pointer technique must be initialized correctly. Starting both pointers at head versus starting fast at head.next affects whether slow ends at the last node of the first half or the first node of the second half. This off-by-one error leads to incorrect splitting and malformed results. \n\n• Forgetting to Disconnect the Two Halves\nAfter finding the middle, you must set slow.next = None to split the list into two independent halves. Without this, the reversal step creates a cycle or corrupts the original list structure, causing infinite loops during merging. \n\n• Losing References During Merge\nWhen interleaving nodes from the first and second halves, each next pointer reassignment breaks the original chain. Failing to save tmp1 = first.next and tmp2 = second.next before modifying pointers causes you to lose track of remaining nodes, resulting in an incomplete or broken list. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "remove-nth-node-from-end-of-list",
        "title": "Remove Nth Node From End Of List",
        "difficulty": "Medium",
        "category": "Linked List",
        "tags": [
            "linked-list"
        ],
        "description": "You are given the beginning of a linked list head, and an integer n. Remove the nth node from the end of the list and return the beginning of the list.",
        "constraints": [],
        "examples": [
            {
                "input": "head = [1,2,3,4], n = 2",
                "output": "[1,2,4]",
                "explanation": ""
            },
            {
                "input": "head = [5], n = 1",
                "output": "[]",
                "explanation": ""
            },
            {
                "input": "head = [1,2], n = 2",
                "output": "[2]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 2 3 4\n2",
                "expectedOutput": "1 2 4"
            },
            {
                "input": "1\n5\n1",
                "expectedOutput": ""
            },
            {
                "input": "2\n1 2\n2",
                "expectedOutput": "2"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void removeNthNodeFromEndOfList() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe store all nodes in an array so we can directly access the node that is n positions from the end.Once we know which node to delete, we simply adjust the next pointer of the previous node.\n\nComplexity:\nTime: O(N)\nSpace: O(N)\n\n\n2. Iteration (Two Pass)\n\nWe first count how many nodes are in the list.Once we know the total length, the node to delete is at position N - n from the start.We run a second pass to reach the node just before it and skip it.\n\nComplexity:\nTime: O(N)\nSpace: O(1)\n\n\n3. Recursion\n\nRecursion naturally processes the list from the end toward the start.When the recursive calls unwind, we count backwards.When the count reaches the nth node from the end, we skip it by returning head.next instead of the current node.\n\nComplexity:\nTime: O(N)\nSpace: O(N)\n\n\n4. Two Pointers\n\nUse two pointers so that the gap between them is exactly n.Move the right pointer n steps ahead first.Then move both pointers together.When the right pointer reaches the end, the left pointer will be just before the node we must remove.This avoids counting the entire list and removes the target in one pass.\n\nComplexity:\nTime: O(N)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Forgetting to Handle Head Removal\nWhen n equals the length of the list, the head node itself must be removed. Without a dummy node or explicit check for this case, the code may crash or return incorrect results. Always verify your solution works when the target is the first node. \n\n• Off-by-One Errors in Pointer Positioning\nThe two-pointer technique requires the left pointer to stop at the node before the one to delete. A common mistake is advancing right by n-1 instead of n steps, causing the wrong node to be removed. Carefully trace through a small example to confirm your gap is correct. \n\n• Not Returning the Updated Head\nAfter modifying the list, forgetting to return dummy.next (or the updated head) results in returning a stale reference. This is especially problematic when the original head was deleted. Always ensure your return statement reflects any structural changes to the list. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "copy-list-with-random-pointer",
        "title": "Copy List With Random Pointer",
        "difficulty": "Medium",
        "category": "Linked List",
        "tags": [
            "linked-list"
        ],
        "description": "You are given the head of a linked list of length n. Unlike a singly linked list, each node contains an additional pointer random, which may point to any node in the list, or null. Create a deep copy of the list.  The deep copy should consist of exactly n new nodes, each including: Note: None of the pointers in the new list should point to nodes in the original list. Return the head of the copied linked list. In the examples, the linked list is represented as a list of n nodes. Each node is represented as a pair of [val, random_index] where random_index is the index of the node (0-indexed) that the random pointer points to, or null if it does not point to any node.",
        "constraints": [],
        "examples": [
            {
                "input": "head = [[3,null],[7,3],[4,0],[5,1]]",
                "output": "[[3,null],[7,3],[4,0],[5,1]]",
                "explanation": ""
            },
            {
                "input": "head = [[1,null],[2,2],[3,2]]",
                "output": "[[1,null],[2,2],[3,2]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n3, 7,3 4,0 5,1",
                "expectedOutput": "3 null 7 3 4 0 5 1"
            },
            {
                "input": "3\n1, 2,2 3,2",
                "expectedOutput": "1 null 2 2 3 2"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void copyListWithRandomPointer() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion + Hash Map\n\nWe must create a deep copy of a linked list where each node has both next and random pointers.The main difficulty: multiple nodes may point to the same random node, so we must ensure each original node is copied exactly once.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Hash Map (Two Pass)\n\nWe want to copy a linked list where each node has both next and random pointers.The challenge is that the random pointer can point anywhere — forward, backward, or even None.So we must ensure every original node is copied exactly once, and all pointers are reconnected correctly.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Hash Map (One Pass)\n\nWe want to copy a linked list where every node has a next pointer and a random pointer.Normally we need two passes: one to create nodes, and another to connect pointers.But we can actually do both at the same time by using a hash map that automatically creates a copy node whenever we access it.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Space Optimized - I\n\nWe want to copy the list without using extra space like a hash map.The trick is to interleave copied nodes inside the original list:\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n5. Space Optimized - II\n\nThis method also avoids extra space like a hash map, but instead of inserting copied nodes into the next pointer chain, we temporarily use the random pointer to store the copied nodes.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Creating Multiple Copies of the Same Node\nWithout a hash map to track already-copied nodes, you might create duplicate copies when multiple random pointers point to the same node. Always check if a node has been copied before creating a new copy. \n\n• Forgetting to Handle Null Random Pointers\nThe random pointer can be null. Attempting to access properties of null causes crashes. Always check for null before dereferencing. \n\n• Not Restoring Original List in Space-Optimized Solutions\nIn the interleaving approach, failing to properly unweave the two lists corrupts the original list and may break the copied list's pointers. The separation step must correctly restore both next pointers. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "linked-list-cycle",
        "title": "Linked List Cycle",
        "difficulty": "Easy",
        "category": "Linked List",
        "tags": [
            "linked-list"
        ],
        "description": "Given the beginning of a linked list head, return true if there is a cycle in the linked list. Otherwise, return false. There is a cycle in a linked list if at least one node in the list can be visited again by following the next pointer. Internally, index determines the index of the beginning of the cycle, if it exists. The tail node of the list will set it's next pointer to the index-th node. If index = -1, then the tail node points to null and no cycle exists. Note: index is not given to you as a parameter.",
        "constraints": [],
        "examples": [
            {
                "input": "head = [1,2,3,4], index = 1",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "head = [1,2], index = -1",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 2 3 4\n1",
                "expectedOutput": "true"
            },
            {
                "input": "2\n1 2\n-1",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void linkedListCycle() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Hash Set\n\nTo detect whether a linked list has a cycle, one simple idea is to remember every node we visit.As we move forward through the list, if we ever reach a node we’ve already seen before, it means the list loops back on itself — so a cycle exists.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Fast And Slow Pointers\n\nWe use two pointers moving through the list at different speeds:\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Not Checking if Fast Pointer Can Advance Safely\nBefore moving the fast pointer two steps, you must verify both fast and fast.next are not null. Checking only fast != null before accessing fast.next.next causes a null pointer exception when the list has an odd number of nodes without a cycle. \n\n• Comparing Node Values Instead of Node References\nThe cycle detection requires comparing whether two pointers reference the same node object, not whether they have the same value. Using value equality (slow.val == fast.val) incorrectly detects cycles when two different nodes happen to have the same value. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "find-the-duplicate-number",
        "title": "Find The Duplicate Number",
        "difficulty": "Medium",
        "category": "Linked List",
        "tags": [
            "linked-list"
        ],
        "description": "You are given an array of integers nums containing n + 1 integers. Each integer in nums is in the range [1, n] inclusive. Every integer appears exactly once, except for one integer which appears two or more times. Return the integer that appears more than once.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,3,2,2]",
                "output": "2",
                "explanation": ""
            },
            {
                "input": "nums = [1,2,3,4,4]",
                "output": "4",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "5\n1 2 3 2 2",
                "expectedOutput": "2"
            },
            {
                "input": "5\n1 2 3 4 4",
                "expectedOutput": "4"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void findTheDuplicateNumber() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nIf we sort the array, any duplicate numbers will appear next to each other.So after sorting, we just scan once and check if any two consecutive elements are equal.The first equal pair we find is the duplicate.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(1)\n\n\n2. Hash Set\n\nWe can detect duplicates by remembering which numbers we have already seen.As we scan the array, each new number is checked:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Array\n\nSince the values in the array are from 1 to n, we can use an array to track whether we've seen a number before.Each number directly maps to an index (num - 1).\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Negative Marking\n\nSince every value is between 1 and n, each number corresponds to an index in the array (num - 1).We can use the array itself as a marking tool:\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n5. Binary Search\n\nThis method uses binary search on the value range, not on the array itself.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(1)\n\n\n6. Bit Manipulation\n\nEvery number from 1 to n−1 should appear exactly once, but in the array, one number appears twice.So for each bit position, we compare:\n\nComplexity:\nTime: O(32 * n)\nSpace: O(1)\n\n\n7. Fast And Slow Pointers\n\nTreat the array like a linked list, where each index points to the next index given by its value.Because one number is duplicated, two indices will point into the same chain, creating a cycle — exactly like a linked list with a loop.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Modifying the Array When Not Allowed\nSome problem variants require not modifying the input array. Solutions like negative marking or in-place sorting alter the original data. Always check the constraints before choosing an approach that mutates the input. \n\n• Off-by-One Errors in Index Mapping\nSince values range from 1 to n but array indices start at 0, forgetting to subtract 1 when mapping values to indices causes out-of-bounds errors or incorrect results. For example, value n maps to index n-1, not index n. \n\n• Misunderstanding Floyd's Cycle Detection Entry Point\nIn the fast and slow pointer approach, the meeting point of the two pointers is not the duplicate number. After they meet, you must start a new pointer from index 0 and move both pointers one step at a time until they meet again. This second meeting point is the cycle entry, which corresponds to the duplicate value. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "lru-cache",
        "title": "Lru Cache",
        "difficulty": "Medium",
        "category": "Linked List",
        "tags": [
            "linked-list",
            "design"
        ],
        "description": "Implement the Least Recently Used (LRU) cache class LRUCache. The class should support the following operations A key is considered used if a get or a put operation is called on it. Ensure that get and put each run in O(1)O(1)O(1) average time complexity.",
        "constraints": [],
        "examples": [
            {
                "input": "[\"LRUCache\", [2], \"put\", [1, 10],  \"get\", [1], \"put\", [2, 20], \"put\", [3, 30], \"get\", [2], \"get\", [1]]",
                "output": "[null, null, 10, null, null, 20, -1]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "",
                "expectedOutput": "null  null  10  null  null  20  -1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void lruCache() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe store all (key, value) pairs in a list.To follow LRU (Least Recently Used) behavior:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Doubly Linked List\n\nWe want all operations to be O(1) while still following LRU (Least Recently Used) rules.\n\nComplexity:\nTime: O(1)\nSpace: O(n)\n\n\n3. Built-In Data Structure\n\nMany languages provide a built-in ordered map / dictionary that:\n\nComplexity:\nTime: O(1)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Forgetting to Update on Get Operations\nA critical LRU requirement is that get() operations also update recency. Many implementations correctly update order on put() but forget that accessing a key via get() should also move it to the most recently used position. This breaks the LRU invariant and causes wrong evictions. \n\n• Incorrect Doubly Linked List Pointer Updates\nWhen implementing the doubly linked list approach, pointer manipulation errors are common. When removing a node, you must update both prev.next and next.prev. When inserting, you must update four pointers: the new node's prev and next, plus the adjacent nodes' pointers. Missing any of these updates corrupts the list structure. \n\n• Not Storing Keys in List Nodes\nWhen evicting the least recently used item, you need to remove it from both the linked list and the hash map. If your list nodes only store values (not keys), you cannot efficiently find and remove the corresponding hash map entry. Always store the key in each list node to enable O(1) eviction. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "merge-k-sorted-lists",
        "title": "Merge K Sorted Lists",
        "difficulty": "Hard",
        "category": "Linked List",
        "tags": [
            "linked-list",
            "heap"
        ],
        "description": "You are given an array of k linked lists lists, where each list is sorted in ascending order. Return the sorted linked list that is the result of merging all of the individual linked lists.",
        "constraints": [],
        "examples": [
            {
                "input": "lists = [[1,2,4],[1,3,5],[3,6]]",
                "output": "[1,1,2,3,3,4,5,6]",
                "explanation": ""
            },
            {
                "input": "lists = []",
                "output": "[]",
                "explanation": ""
            },
            {
                "input": "lists = [[]]",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1,2,4 1,3,5 3,6",
                "expectedOutput": "1 1 2 3 3 4 5 6"
            },
            {
                "input": "0",
                "expectedOutput": ""
            },
            {
                "input": "1",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void mergeKSortedLists() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe simplest way to merge all linked lists is to ignore the list structure, collect every value, sort them, and then rebuild a single sorted linked list.This doesn't use any clever merging logic — it is purely based on gathering and sorting.It's easy to implement but not efficient because sorting dominates the runtime.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n2. Iteration\n\nWe repeatedly pick the smallest head node among all the lists and attach it to our result list.At every step:\n\nComplexity:\nTime: O(n * k)\nSpace: O(1)\n\n\n3. Merge Lists One By One\n\nInstead of merging all k lists at once, we can merge them one by one.\n\nComplexity:\nTime: O(n * k)\nSpace: O(1)\n\n\n4. Heap\n\nWe want to always pick the smallest current node among all k lists as efficiently as possible.\n\nComplexity:\nTime: O(nlog k)\nSpace: O(k)\n\n\n5. Divide And Conquer (Recursion)\n\nInstead of merging all k lists at once or one by one in order, we can use a divide and conquer strategy, similar to how merge sort works.\n\nComplexity:\nTime: O(nlog k)\nSpace: O(log k)\n\n\n6. Divide And Conquer (Iteration)\n\nThis is the same idea as divide and conquer, but done iteratively instead of using recursion.\n\nComplexity:\nTime: O(nlog k)\nSpace: O(k)\n\n\nCommon Pitfalls\n\n• Not Handling Empty Lists in the Input Array\nThe input array lists may contain null or empty linked lists. Failing to check for these before accessing node values will cause null pointer exceptions. Always verify that a list is non-empty before processing it. \n\n• Forgetting to Advance the Chosen List's Pointer\nAfter selecting the smallest node from among the k lists, you must move that list's head pointer to the next node. Forgetting this step causes an infinite loop where the same node is repeatedly selected. \n\n• Incorrect Comparator for Min-Heap\nWhen using a priority queue or min-heap, the comparator must compare node values correctly. In some languages, the default heap is a max-heap (like Python's heapq with negative values or C++'s priority_queue). Using the wrong comparison direction results in a max-heap instead of a min-heap, producing an incorrectly sorted output. \n\n• Not Using a Dummy Node for the Result List\nBuilding the result list without a dummy head node requires special handling for the first node and complicates the logic. Using a dummy node simplifies the code by allowing uniform treatment of all nodes, then returning dummy.next as the result. \n\n• Modifying the Input Lists Array During Iteration\nWhen merging lists one by one or in the divide-and-conquer approach, be careful about how you update the lists array. Overwriting elements while still iterating can lead to incorrect merges or skipped lists. Either use a separate array for merged results or iterate carefully with proper indexing. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "invert-binary-tree",
        "title": "Invert Binary Tree",
        "difficulty": "Easy",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "You are given the root of a binary tree root. Invert the binary tree and return its root.",
        "constraints": [],
        "examples": [
            {
                "input": "root = [1,2,3,4,5,6,7]",
                "output": "[1,3,2,7,6,5,4]",
                "explanation": ""
            },
            {
                "input": "root = [3,2,1]",
                "output": "[3,1,2]",
                "explanation": ""
            },
            {
                "input": "root = []",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n1 2 3 4 5 6 7",
                "expectedOutput": "1 3 2 7 6 5 4"
            },
            {
                "input": "3\n3 2 1",
                "expectedOutput": "3 1 2"
            },
            {
                "input": "0",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void invertBinaryTree() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Breadth First Search\n\nTo invert (mirror) a binary tree, every node must swap its left and right children. Using Breadth-First Search (BFS), we process the tree level-by-level:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Depth First Search\n\nInverting a binary tree means swapping every node’s left and right subtree.With Depth-First Search (DFS), we use recursion to invert the tree in a top-down manner:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Iterative DFS\n\nIterative DFS inverts a binary tree using an explicit stack instead of recursion.The idea is the same as recursive DFS:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Not Handling Null Root\nForgetting to check for a null root causes null pointer exceptions. Always return null immediately if the root is null. \n\n• Swapping After Recursive Calls\nIf you swap children after making recursive calls, you end up swapping already-inverted subtrees back. The swap must happen before or the recursion will undo the inversion. \n\n• Using Wrong References After Swap\nAfter swapping, root.left now points to what was previously root.right. When recursing, make sure you're using the correct references for the swapped children. \n\n• Modifying While Traversing Incorrectly\nIn iterative approaches, ensure you push children to the stack after swapping, not before. Pushing before the swap means you're adding references to positions that will change. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "balanced-binary-tree",
        "title": "Balanced Binary Tree",
        "difficulty": "Easy",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "Given a binary tree, return true if it is height-balanced and false otherwise. A height-balanced binary tree is defined as a binary tree in which the left and right subtrees of every node differ in height by no more than 1.",
        "constraints": [],
        "examples": [
            {
                "input": "root = [1,2,3,null,null,4]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "root = [1,2,3,null,null,4,null,5]",
                "output": "false",
                "explanation": ""
            },
            {
                "input": "root = []",
                "output": "true",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "6\n1 2 3   4",
                "expectedOutput": "true"
            },
            {
                "input": "8\n1 2 3   4  5",
                "expectedOutput": "false"
            },
            {
                "input": "0",
                "expectedOutput": "true"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void balancedBinaryTree() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nA tree is balanced if every node’s left and right subtree heights differ by at most 1.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Depth First Search\n\nThe brute-force solution wastes time by repeatedly recomputing subtree heights.We fix this by doing one DFS that returns two things at once for every node:\n\nComplexity:\nTime: O(n)\nSpace: O(h)\n\n\n3. Iterative DFS\n\nThe recursive DFS solution computes height and balance in one postorder traversal.This iterative version does the same thing, but simulates recursion using a stack.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Only Checking the Root Node\nA tree is balanced only if every node (not just the root) has subtrees with heights differing by at most 1. Checking only the root misses imbalanced subtrees deeper in the tree. \n\n• Returning Height of 0 for Leaf Nodes\nA leaf node has height 1, not 0. Returning 0 for leaves causes off-by-one errors in height calculations. The base case should return 0 only for null nodes. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "same-tree",
        "title": "Same Tree",
        "difficulty": "Easy",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "Given the roots of two binary trees p and q, return true if the trees are equivalent, otherwise return false. Two binary trees are considered equivalent if they share the exact same structure and the nodes have the same values.",
        "constraints": [],
        "examples": [
            {
                "input": "p = [1,2,3], q = [1,2,3]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "p = [4,7], q = [4,null,7]",
                "output": "false",
                "explanation": ""
            },
            {
                "input": "p = [1,2,3], q = [1,3,2]",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1 2 3\n3\n1 2 3",
                "expectedOutput": "true"
            },
            {
                "input": "2\n4 7\n3\n4  7",
                "expectedOutput": "false"
            },
            {
                "input": "3\n1 2 3\n3\n1 3 2",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void sameTree() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nTwo binary trees are the same if:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Iterative DFS\n\nInstead of using recursion, we can use an explicit stack to compare the two trees.Each stack entry contains a pair of nodes—one from each tree—that should match.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Breadth First Search\n\nBFS (level-order traversal) lets us compare the two trees level by level.We maintain two queues—one for each tree. At every step, we remove a pair of nodesthat should match:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Incorrect Null Check Order\nA common mistake is checking node values before verifying both nodes exist. If one node is null and you access its value, you get a null pointer exception. Always check if both nodes are null first, then if exactly one is null, before comparing values. \n\n• Comparing Only Values Without Structure\nSome solutions compare just the values using traversals like inorder or preorder, ignoring tree structure. Two trees can have identical traversal sequences but different structures. You must verify both the values and the structural positions match at every node. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "subtree-of-another-tree",
        "title": "Subtree Of Another Tree",
        "difficulty": "Easy",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise. A subtree of a binary tree tree is a tree that consists of a node in tree and all of this node's descendants. The tree tree could also be considered as a subtree of itself.",
        "constraints": [],
        "examples": [
            {
                "input": "root = [1,2,3,4,5], subRoot = [2,4,5]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "root = [1,2,3,4,5,null,null,6], subRoot = [2,4,5]",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "5\n1 2 3 4 5\n3\n2 4 5",
                "expectedOutput": "true"
            },
            {
                "input": "8\n1 2 3 4 5   6\n3\n2 4 5",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void subtreeOfAnotherTree() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search (DFS)\n\nTo check whether one tree is a subtree of another, we do two things:\n\nComplexity:\nTime: O(m * n)\nSpace: O(m+n)\n\n\n2. Serialization And Pattern Matching\n\nInstead of comparing trees directly, we can first turn each tree into a string and then just check whether one string is contained in the other.\n\nComplexity:\nTime: O(m+n)\nSpace: O(m+n)\n\n\nCommon Pitfalls\n\n• Confusing Subtree with Substructure\nA subtree must match exactly from a node down to all its leaves. A common mistake is checking only if the values match without verifying that the entire structure below also matches. If subRoot has children, those children must also exist and match in the main tree. Simply finding a node with the same value is not sufficient. \n\n• Incorrect Null Handling in Tree Comparison\nWhen comparing two trees for equality, both trees must have null children in the same positions. A frequent error is returning true when one node is null and the other is not, or failing to check both left and right subtrees. The base case must ensure that both nodes being compared are either both null (return true) or both non-null with matching values before recursing. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "lowest-common-ancestor-of-a-binary-search-tree",
        "title": "Lowest Common Ancestor Of A Binary Search Tree",
        "difficulty": "Medium",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "Given a binary search tree (BST) where all node values are unique, and two nodes from the tree p and q, return the lowest common ancestor (LCA) of the two nodes. The lowest common ancestor between two nodes p and q is the lowest node in a tree T such that both p and q as descendants. The ancestor is allowed to be a descendant of itself.",
        "constraints": [],
        "examples": [
            {
                "input": "root = [5,3,8,1,4,7,9,null,2], p = 3, q = 8",
                "output": "5",
                "explanation": ""
            },
            {
                "input": "root = [5,3,8,1,4,7,9,null,2], p = 3, q = 4",
                "output": "3",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "9\n5 3 8 1 4 7 9  2\n3\n8",
                "expectedOutput": "5"
            },
            {
                "input": "9\n5 3 8 1 4 7 9  2\n3\n4",
                "expectedOutput": "3"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void lowestCommonAncestorOfABinarySearchTree() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nWe are working with a Binary Search Tree (BST), so:\n\nComplexity:\nTime: O(h)\nSpace: O(h)\n\n\n2. Iteration\n\nThis is the iterative version of finding the Lowest Common Ancestor (LCA) in a Binary Search Tree (BST).Because a BST is ordered:\n\nComplexity:\nTime: O(h)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Ignoring BST Properties\nA common mistake is treating this problem like a general binary tree LCA problem. In a BST, values are ordered (left < node < right), which allows us to determine the direction to search based on value comparisons alone. Using a generic DFS approach that checks both subtrees wastes time and ignores the BST structure that makes O(h) solutions possible. \n\n• Incorrect Comparison Logic\nWhen comparing p and q values against the current node, be careful with the boundary conditions. The LCA is found when the current node's value lies between p.val and q.val (inclusive). A common bug is using strict inequalities everywhere, which fails when p or q equals the current node. Remember: if p.val <= root.val <= q.val (or vice versa), the current node is the LCA. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "binary-tree-right-side-view",
        "title": "Binary Tree Right Side View",
        "difficulty": "Medium",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "You are given the root of a binary tree. Return only the values of the nodes that are visible from the right side of the tree, ordered from top to bottom.",
        "constraints": [],
        "examples": [
            {
                "input": "root = [1,2,3,null,4,null,5]",
                "output": "[1,3,5]",
                "explanation": ""
            },
            {
                "input": "root = [1,2,3,4,null,null,null,5]",
                "output": "[1,3,4,5]",
                "explanation": ""
            },
            {
                "input": "root = [1,null,2]",
                "output": "[1,2]",
                "explanation": ""
            },
            {
                "input": "root = []",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n1 2 3  4  5",
                "expectedOutput": "1 3 5"
            },
            {
                "input": "8\n1 2 3 4    5",
                "expectedOutput": "1 3 4 5"
            },
            {
                "input": "3\n1  2",
                "expectedOutput": "1 2"
            },
            {
                "input": "0",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void binaryTreeRightSideView() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nTo see the right side of a tree, at each depth we only care about the first node we encounter when looking from the right.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Breadth First Search\n\nIn BFS we explore the tree level by level.If we look at each level from left to right, the last node we encounter at that level is the one visible from the right side.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Only Traversing Right Children\nThe rightmost visible node at each level is not always in the right subtree. When the right subtree is shorter than the left, deeper left nodes become visible from the right. \n\n• Using DFS With Left-First Traversal Without Adjustment\nIn DFS, if you visit left children before right children, you must update (not just set) the result for each depth. Otherwise, only left-side nodes are captured. \n\n• Forgetting to Track Level Size in BFS\nIn BFS, you must process all nodes at the current level before moving to the next. Without tracking the level size, you cannot determine which node is rightmost at each level. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "count-good-nodes-in-binary-tree",
        "title": "Count Good Nodes In Binary Tree",
        "difficulty": "Medium",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "Within a binary tree, a node x is considered good if the path from the root of the tree to the node x contains no nodes with a value greater than the value of node x Given the root of a binary tree root, return the number of good nodes within the tree.",
        "constraints": [],
        "examples": [
            {
                "input": "root = [2,1,1,3,null,1,5]",
                "output": "3",
                "explanation": ""
            },
            {
                "input": "root = [1,2,-1,3,4]",
                "output": "4",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n2 1 1 3  1 5",
                "expectedOutput": "3"
            },
            {
                "input": "5\n1 2 -1 3 4",
                "expectedOutput": "4"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void countGoodNodesInBinaryTree() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nA node is “good” if on the path from the root to that node, no earlier node has a value greater than it.So while traversing the tree, we just need to carry the maximum value seen so far on the current path.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Breadth First Search\n\nA node is “good” if along the path from the root to that node, no earlier node has a value greater than it.Using BFS, we can traverse level by level while carrying the maximum value seen so far for each path.Whenever we visit a node, we compare its value with that max — if it's greater or equal, this node is good.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Using Strictly Greater Than Instead of Greater Than or Equal\nA node is \"good\" if its value is greater than OR EQUAL to all ancestors. Using node.val > maxVal instead of node.val >= maxVal causes the root and equal-valued paths to be missed. \n\n• Initializing maxVal Too High\nStarting with maxVal = 0 or maxVal = root.val can cause issues with negative values. Initialize with negative infinity or the root's value to correctly count the root as a good node. \n\n• Sharing maxVal Across Sibling Subtrees\nThe maximum value must be tracked per-path, not globally. Updating a shared variable instead of passing the new max to each recursive call causes incorrect comparisons across different branches. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "construct-binary-tree-from-preorder-and-inorder-traversal",
        "title": "Construct Binary Tree From Preorder And Inorder Traversal",
        "difficulty": "Medium",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "You are given two integer arrays preorder and inorder. Rebuild the binary tree from the preorder and inorder traversals and return its root.",
        "constraints": [],
        "examples": [
            {
                "input": "preorder = [1,2,3,4], inorder = [2,1,3,4]",
                "output": "[1,2,3,null,null,null,4]",
                "explanation": ""
            },
            {
                "input": "preorder = [1], inorder = [1]",
                "output": "[1]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 2 3 4\n4\n2 1 3 4",
                "expectedOutput": "1 2 3 null null null 4"
            },
            {
                "input": "1\n1\n1\n1",
                "expectedOutput": "1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void constructBinaryTreeFromPreorderAndInorderTraversal() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nThe first element of the preorder array is always the root. We can find this root's position in the inorder array, which divides inorder into left and right subtrees. Elements before the root in inorder belong to the left subtree, and elements after belong to the right subtree. The same split applies to preorder. We recursively build left and right subtrees using the corresponding portions of both arrays.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Hash Map + Depth First Search\n\nIn the basic DFS approach, we search for the root's position in inorder using linear search, which takes O(n) time per node. By precomputing a hash map from values to their indices in inorder, we can find the root's position in O(1) time. We also avoid creating new arrays by passing indices that define the current subarray boundaries.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Depth First Search (Optimal)\n\nWe can avoid the hash map entirely by using a limit-based approach. Instead of explicitly finding the root's position, we pass a \"limit\" value that tells us when to stop building the left subtree. When we encounter the limit value in inorder, we know the left subtree is complete. The preorder index tells us which node to create next, and the inorder index tells us when we have finished a subtree.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Morris Traversal\n\nMorris traversal allows us to build the tree iteratively without using a recursion stack. The idea is to use the right pointers of nodes to temporarily store parent references, simulating the call stack. We build nodes as we iterate through preorder, connecting them via left/right pointers. When we finish a left subtree (detected by matching the inorder sequence), we restore the original structure by clearing temporary links and moving up the tree.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Off-by-One Error When Splitting Arrays\nThe split point mid represents the root's index in inorder. When slicing preorder, the left subtree uses preorder[1:mid+1] (not preorder[1:mid]), since there are exactly mid elements in the left subtree. \n\n• Building Right Subtree Before Left Subtree\nWhen using a global preorder index, the left subtree must be built first. Preorder visits root, then left, then right. Building right first consumes wrong nodes from the preorder array. \n\n• Confusing Preorder and Inorder Roles\nThe root always comes from preorder (first element), while the split point is found in inorder. Swapping these roles produces an incorrect tree structure. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "binary-tree-maximum-path-sum",
        "title": "Binary Tree Maximum Path Sum",
        "difficulty": "Hard",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "Given the root of a non-empty binary tree, return the maximum path sum of any non-empty path. A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can not appear in the sequence more than once. The path does not necessarily need to include the root. The path sum of a path is the sum of the node's values in the path.",
        "constraints": [],
        "examples": [
            {
                "input": "root = [1,2,3]",
                "output": "6",
                "explanation": ""
            },
            {
                "input": "root = [-15,10,20,null,null,15,5,-5]",
                "output": "40",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1 2 3",
                "expectedOutput": "6"
            },
            {
                "input": "8\n-15 10 20   15 5 -5",
                "expectedOutput": "40"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void binaryTreeMaximumPathSum() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nFor each node, consider it as the highest point of a potential path.A path can pass through a node as:\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n2. Depth First Search (Optimal)\n\nIn the maximum path sum problem, a path can start and end anywhere in the tree, but it must go downward at each step (parent → child).\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Initializing Result to Zero Instead of Negative Infinity\nWhen all node values are negative, the maximum path sum is still negative. Initializing the result to 0 causes incorrect answers for trees with all negative values. \n\n• Forgetting to Clamp Negative Subtree Contributions to Zero\nA subtree with negative sum should not be included in the path. Failing to take max(0, subtree_sum) adds negative values that reduce the total. \n\n• Returning the Full Path Sum Instead of Single-Branch Sum\nThe recursive function must return only one branch (left OR right) to the parent, not both. Returning node.val + leftMax + rightMax allows invalid paths that fork at multiple nodes. \n\n• Not Considering Single-Node Paths\nA valid path can be just one node. The algorithm must consider node.val alone as a potential maximum, especially when both subtrees contribute negative values. \n\n• Confusing Path Sum With Downward Path\nThe maximum path can go through any node as the \"turning point\" (left subtree -> node -> right subtree). This is different from paths that only go downward from root to leaf. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "serialize-and-deserialize-binary-tree",
        "title": "Serialize And Deserialize Binary Tree",
        "difficulty": "Hard",
        "category": "Binary Tree",
        "tags": [
            "binary-tree"
        ],
        "description": "Implement an algorithm to serialize and deserialize a binary tree. Serialization is the process of converting an in-memory structure into a sequence of bits so that it can be stored or sent across a network to be reconstructed later in another computer environment. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure. There is no additional restriction on how your serialization/deserialization algorithm should work. Note: The input/output format in the examples is the same as how NeetCode serializes a binary tree. You do not necessarily need to follow this format.",
        "constraints": [],
        "examples": [
            {
                "input": "root = [1,2,3,null,null,4,5]",
                "output": "[1,2,3,null,null,4,5]",
                "explanation": ""
            },
            {
                "input": "root = []",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n1 2 3   4 5",
                "expectedOutput": "1 2 3 null null 4 5"
            },
            {
                "input": "0",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void serializeAndDeserializeBinaryTree() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nWe want to turn a tree into a string (serialize) and then rebuild the same tree from that string (deserialize).We use preorder DFS (root → left → right) because it naturally records a node before its children.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n2. Breadth First Search\n\nInstead of using DFS, we treat the tree like a queue (level order traversal).BFS visits nodes level by level, so we simply record values in that order:\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Forgetting to Handle Null Nodes\nA common mistake is not encoding null children in the serialized string. Without explicit null markers (like \"N\"), the tree structure becomes ambiguous during deserialization. Two different trees could produce the same serialized string if nulls are omitted. \n\n• Using a Global Index Without Proper State Management\nWhen deserializing with DFS, using a simple integer variable as an index fails because the index must persist across recursive calls. In many languages, primitive integers are passed by value, so the incremented index is lost when returning from recursion. The solution is to use a mutable wrapper (like an array or object) to maintain the index state. \n\n• Incorrect Order of Building Left and Right Subtrees\nThe deserialization must rebuild children in the exact same order they were serialized. If you serialize using preorder (root, left, right), you must deserialize in preorder too. Building the right subtree before the left will produce an incorrect tree structure. \n\n• Not Handling Empty Trees\nAn empty tree (null root) is a valid input that requires special handling. Forgetting to check for this case in both serialization and deserialization leads to null pointer exceptions or incorrect output. \n\n• Delimiter Conflicts with Node Values\nUsing a delimiter that could appear in node values causes parsing errors. For example, if nodes can have negative values and you use - as a delimiter, parsing becomes ambiguous. Using a character that cannot appear in integer values (like ,) avoids this issue. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "implement-trie-prefix-tree",
        "title": "Implement Trie Prefix Tree",
        "difficulty": "Medium",
        "category": "Trie",
        "tags": [
            "trie",
            "design"
        ],
        "description": "A prefix tree (also known as a trie) is a tree data structure used to efficiently store and retrieve keys in a set of strings. Some applications of this data structure include auto-complete and spell checker systems. Implement the PrefixTree class:",
        "constraints": [],
        "examples": [
            {
                "input": "[\"Trie\", \"insert\", \"dog\", \"search\", \"dog\", \"search\", \"do\", \"startsWith\", \"do\", \"insert\", \"do\", \"search\", \"do\"]",
                "output": "[null, null, true, false, true, null, true]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "",
                "expectedOutput": "null  null  true  false  true  null  true"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void implementTriePrefixTree() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Prefix Tree (Array)\n\nA Prefix Tree (Trie) is a tree-like data structure designed for fast string operations.\n\nComplexity:\nTime: O(n)\nSpace: O(t)\n\n\n2. Prefix Tree (Hash Map)\n\nInitialize PrefixTree with an empty root TrieNode.\n\nComplexity:\nTime: O(n)\nSpace: O(t)\n\n\nCommon Pitfalls\n\n• Confusing search and startsWith\nA frequent mistake is returning true in search() whenever the traversal completes successfully, without checking the endOfWord flag. The search() method must verify that the final node marks the end of a complete word, while startsWith() only checks if the prefix path exists. For example, if \"apple\" is inserted, search(\"app\") should return false (no word ends there), but startsWith(\"app\") should return true. \n\n• Incorrect Character Index Calculation\nWhen using an array-based Trie with 26 children, the character must be converted to an index using c - 'a'. A common error is using the ASCII value directly without subtraction, which causes index out of bounds errors. Another mistake is assuming uppercase letters, which would require c - 'A' instead. Always ensure the input constraints match the indexing scheme. \n\n• Forgetting to Initialize Child Nodes\nWhen traversing during insert(), forgetting to create a new TrieNode when the child does not exist leads to null pointer exceptions on subsequent character accesses. The check if cur.children[i] == None: cur.children[i] = TrieNode() must happen before moving to the next node. Similarly, in the hash map approach, forgetting to add the character key before accessing it causes key errors. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "design-add-and-search-words-data-structure",
        "title": "Design Add And Search Words Data Structure",
        "difficulty": "Medium",
        "category": "Trie",
        "tags": [
            "trie",
            "design"
        ],
        "description": "Design a data structure that supports adding new words and searching for existing words. Implement the WordDictionary class:",
        "constraints": [],
        "examples": [
            {
                "input": "[\"WordDictionary\",\"addWord\",\"addWord\",\"addWord\",\"search\",\"search\",\"search\",\"search\"]",
                "output": "[null, null, null, null, false, true, true, true]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "",
                "expectedOutput": "null  null  null  null  false  true  true  true"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void designAddAndSearchWordsDataStructure() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe simplest way to solve this problem is to store all words as-is and check every stored word during search.\n\nComplexity:\nTime: O(1)\nSpace: O(m * n)\n\n\n2. Depth First Search (Trie)\n\nInitialize WordDictionary with empty root TrieNode\n\nComplexity:\nTime: O(n)\nSpace: O(t+n)\n\n\nCommon Pitfalls\n\n• Returning True at Any Node Instead of Word-End Nodes\nWhen the search reaches the end of the pattern, you must check if the current node marks the end of a valid word, not just that the node exists. A prefix match is not the same as a word match. \n\n• Not Exploring All Children for Wildcard\nWhen encountering a . wildcard, you must try all possible children nodes. A common mistake is returning after the first child or not iterating through all 26 possible characters. \n\n• Confusing Node Existence with Word Existence\nWhen a character is not found in the Trie, return False immediately. However, when using wildcards, absence of any children should also return False, but only after checking all possibilities. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "word-search-ii",
        "title": "Word Search Ii",
        "difficulty": "Hard",
        "category": "Trie",
        "tags": [
            "trie",
            "backtracking"
        ],
        "description": "Given a 2-D grid of characters board and a list of strings words, return all words that are present in the grid. For a word to be present it must be possible to form the word with a path in the board with horizontally or vertically neighboring cells. The same cell may not be used more than once in a word.",
        "constraints": [],
        "examples": [
            {
                "input": "board = [",
                "output": "[\"cat\",\"back\",\"backend\"]",
                "explanation": ""
            },
            {
                "input": "board = [",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "[",
                "expectedOutput": "\"cat\" \"back\" \"backend\""
            },
            {
                "input": "[",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void wordSearchIi() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Backtracking\n\nFor each word, we try to trace it on the board by walking through adjacent cells (up/down/left/right).To avoid using the same cell twice in one word path, we temporarily mark the cell as visited, and then restore it after exploring (classic backtracking).\n\nComplexity:\nTime: O(w * m * n * 4 * 3t−1)\nSpace: O(t)\n\n\n2. Backtracking (Trie + Hash Set)\n\nSearching each word separately repeats the same work many times.A Trie (prefix tree) lets us share work: while walking on the board, we only continue paths that match some prefix of the given words.So the board DFS explores \"possible prefixes\", and whenever the Trie node says this prefix is a complete word, we record it.\n\nComplexity:\nTime: O(m * n * 4 * 3t−1+s)\nSpace: O(s)\n\n\n3. Backtracking (Trie)\n\nWe still do DFS on the board, but we guide the DFS using a Trie so we only walk paths that match prefixes of the given words.\n\nComplexity:\nTime: O(m * n * 4 * 3t−1+s)\nSpace: O(s)\n\n\nCommon Pitfalls\n\n• Forgetting to Remove Duplicate Words from Results\nWhen multiple paths on the board can form the same word, adding the word to the result list without checking for duplicates leads to duplicate entries. Using a set for results or marking words as found in the Trie (by setting idx = -1 or isWord = false) prevents this issue. \n\n• Not Restoring the Board After Backtracking\nWhen marking cells as visited by modifying the board directly (e.g., setting board[r][c] = '*'), forgetting to restore the original character after the recursive calls will corrupt the board state. This prevents other starting positions or words from finding valid paths. \n\n• Inefficient Trie Without Pruning\nBuilding a Trie but not pruning it after finding words leads to repeated exploration of dead branches. Without decrementing refs counts and removing nodes when refs reaches zero, the algorithm continues searching paths that cannot yield any new words, significantly degrading performance. \n\n• Incorrect Trie Traversal During DFS\nAdvancing the Trie pointer before checking if the child node exists can cause null pointer exceptions. Always verify that node.children[char] exists before moving to the next node. Similarly, checking isWord before updating the node pointer will miss the current word. \n\n• Not Handling the Visited Set Correctly with Trie\nWhen using a separate visited set alongside the Trie, forgetting to clear or properly backtrack the visited set for each new starting cell can block valid paths. Each DFS starting point should begin with a fresh or properly reset visited state. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "kth-largest-element-in-a-stream",
        "title": "Kth Largest Element In A Stream",
        "difficulty": "Easy",
        "category": "Heap",
        "tags": [
            "heap",
            "design"
        ],
        "description": "Design a class to find the kth largest integer in a stream of values, including duplicates. E.g. the 2nd largest from [1, 2, 3, 3] is 3. The stream is not necessarily sorted. Implement the following methods:",
        "constraints": [],
        "examples": [
            {
                "input": "[\"KthLargest\", [3, [1, 2, 3, 3]], \"add\", [3], \"add\", [5], \"add\", [6], \"add\", [7], \"add\", [8]]",
                "output": "[null, 3, 3, 3, 5, 6]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "",
                "expectedOutput": "null  3  3  3  5  6"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void kthLargestElementInAStream() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nWe want the k-th largest number in a stream of values.The simplest approach:Every time a new value comes in, insert it, sort the list, and then pick the element at position len(arr) - k.\n\nComplexity:\nTime: O(m * nlog n)\nSpace: O(m)\n\n\n2. Min-Heap\n\nTo maintain the k-th largest element in a stream of numbers, we do not need to store all values.Instead, we only need to keep track of the k largest elements seen so far.\n\nComplexity:\nTime: O(m * log k)\nSpace: O(k)\n\n\nCommon Pitfalls\n\n• Using a Max-Heap Instead of Min-Heap\nA common mistake is using a max-heap to find the k-th largest element. While it seems intuitive to keep the largest elements at the top, a max-heap would require storing all elements and repeatedly extracting the maximum k times for each query. A min-heap of size k is the correct choice because the root always holds the k-th largest element directly, allowing O(1) retrieval after each insertion. \n\n• Forgetting to Maintain Heap Size\nWhen using a min-heap, it is essential to remove the smallest element whenever the heap size exceeds k. Failing to do so means the heap grows unbounded, and the root no longer represents the k-th largest element. Always check and pop after each insertion to keep exactly k elements in the heap. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "k-closest-points-to-origin",
        "title": "K Closest Points To Origin",
        "difficulty": "Medium",
        "category": "Heap",
        "tags": [
            "heap"
        ],
        "description": "You are given an 2-D array points where points[i] = [xi, yi] represents the coordinates of a point on an X-Y axis plane. You are also given an integer k. Return the k closest points to the origin (0, 0).  The distance between two points is defined as the Euclidean distance (sqrt((x1 - x2)^2 + (y1 - y2)^2)). You may return the answer in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "points = [[0,2],[2,2]], k = 1",
                "output": "[[0,2]]",
                "explanation": ""
            },
            {
                "input": "points = [[0,2],[2,0],[2,2]], k = 2",
                "output": "[[0,2],[2,0]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "2\n0,2 2,2\n1",
                "expectedOutput": "0 2"
            },
            {
                "input": "3\n0,2 2,0 2,2\n2",
                "expectedOutput": "0 2 2 0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void kClosestPointsToOrigin() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nTo find the k closest points to the origin (0, 0), we compare points by their distance from the origin.Since the actual distance uses a square root, and square root preserves ordering, we can instead compare using squared distance:\n\nComplexity:\nTime: O(nlog n)\nSpace: O(1)\n\n\n2. Min-Heap\n\nA min-heap always gives you the smallest element first.If we insert every point into a min-heap, using its squared distance from the origin as the priority, then:\n\nComplexity:\nTime: O(n+k * log n)\nSpace: O(n)\n\n\n3. Max Heap\n\nWe want the k closest points, not all points sorted.\n\nComplexity:\nTime: O(n * log k)\nSpace: O(k)\n\n\n4. Quick Select\n\nWe want the k closest points, but we do NOT need them sorted.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Computing Actual Distance with Square Root\nUsing sqrt(x^2 + y^2) is unnecessary and introduces floating-point precision issues. Since we only compare relative distances, squared distance x^2 + y^2 preserves ordering and avoids costly square root operations. \n\n• Using the Wrong Heap Type\nFor the heap approach, using a min-heap requires extracting k elements at the end, while a max-heap of size k naturally keeps the k closest. Mixing these up leads to incorrect results or inefficient solutions that maintain more elements than needed. \n\n• Integer Overflow in Distance Calculation\nWhen coordinates can be large (up to 10^4), squaring them produces values up to 10^8. While this fits in a 32-bit integer, summing two such values approaches the limit. In languages with overflow concerns, ensure your distance calculation uses appropriate integer types. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "task-scheduler",
        "title": "Task Scheduler",
        "difficulty": "Medium",
        "category": "Heap",
        "tags": [
            "heap",
            "greedy"
        ],
        "description": "You are given an array of CPU  tasks tasks, where tasks[i] is an uppercase english character from A to Z. You are also given an integer n.  Each CPU cycle allows the completion of a single task, and tasks may be completed in any order. The only constraint is that identical tasks must be separated by at least n CPU cycles, to cooldown the CPU. Return the minimum number of CPU cycles required to complete all tasks.",
        "constraints": [],
        "examples": [
            {
                "input": "tasks = [\"X\",\"X\",\"Y\",\"Y\"], n = 2",
                "output": "5",
                "explanation": ""
            },
            {
                "input": "tasks = [\"A\",\"A\",\"A\",\"B\",\"C\"], n = 3",
                "output": "9",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\nX X Y Y\n2",
                "expectedOutput": "5"
            },
            {
                "input": "5\nA A A B C\n3",
                "expectedOutput": "9"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void taskScheduler() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe simulate the CPU one time unit at a time.At every step, we look at all remaining tasks and pick:\n\nComplexity:\nTime: O(t * n)\nSpace: O(t)\n\n\n2. Max-Heap\n\nWe always want to run the task that still has the most remaining occurrences, because those are the hardest to fit into the schedule (they need more slots with cooldown gaps).\n\nComplexity:\nTime: O(m)\nSpace: O(1)\n\n\n3. Greedy\n\nInstead of simulating the whole schedule, we can think in terms of slots:\n\nComplexity:\nTime: O(m)\nSpace: O(1)\n\n\n4. Math\n\nThe task with the highest frequency determines the minimum needed structure of the schedule.If a task appears maxf times, these copies must be at least n units apart.This creates (maxf - 1) \"gaps\", and each gap must have a length of (n + 1) slots (the task itself + n cooldowns).\n\nComplexity:\nTime: O(m)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Not Prioritizing the Most Frequent Task\nA greedy approach must always pick the task with the highest remaining count that is not in cooldown. Picking tasks arbitrarily or in the order they appear leads to suboptimal schedules with more idle time than necessary. \n\n• Incorrect Cooldown Tracking\nWhen using a heap with a cooldown queue, the task should become available at time current_time + n, not current_time + n + 1. Off-by-one errors in cooldown calculations are common and result in either too many idle slots or cooldown violations. \n\n• Forgetting to Count Tasks with Maximum Frequency\nIn the math-based solution, you must count how many tasks share the maximum frequency (maxCount). Using just 1 instead of maxCount in the formula (maxf - 1) * (n + 1) + maxCount underestimates the required time when multiple tasks have the same highest frequency. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "find-median-from-data-stream",
        "title": "Find Median From Data Stream",
        "difficulty": "Hard",
        "category": "Heap",
        "tags": [
            "heap",
            "design"
        ],
        "description": "The median is the middle value in a sorted list of integers. For lists of even length, there is no middle value, so the median is the mean of the two middle values. For example: Implement the MedianFinder class:",
        "constraints": [],
        "examples": [
            {
                "input": "[\"MedianFinder\", \"addNum\", \"1\", \"findMedian\", \"addNum\", \"3\" \"findMedian\", \"addNum\", \"2\", \"findMedian\"]",
                "output": "[null, null, 1.0, null, 2.0, null, 2.0]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "",
                "expectedOutput": "null  null  1.0  null  2.0  null  2.0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void findMedianFromDataStream() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nThe simplest way to find the median is to keep all numbers in a list andsort them whenever we need the median. After sorting, the numbers are inincreasing order, making it easy to pick the \"middle\" value(s).\n\nComplexity:\nTime: O(m)\nSpace: O(n)\n\n\n2. Heap\n\nTo efficiently find the median while numbers keep coming, we split thestream into two halves:\n\nComplexity:\nTime: O(m * log n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Using Wrong Heap Types\nThe two-heap solution requires a max-heap for the smaller half and a min-heap for the larger half. Swapping these or using two min-heaps produces incorrect medians. In languages like Python where heapq only provides min-heaps, you must negate values to simulate a max-heap for the smaller half. \n\n• Failing to Maintain Heap Balance\nThe heaps must differ in size by at most one element. Forgetting to rebalance after insertions leads to incorrect median calculations. After every addNum call, check if one heap has more than one extra element and transfer the top element to the other heap. \n\n• Incorrect Median Calculation for Even Count\nWhen both heaps have equal size, the median is the average of both tops, not just one of them. Returning only the top of one heap or using integer division instead of floating-point division produces wrong results. Always check heap sizes and compute (smallTop + largeTop) / 2.0 for the even case. \n\n• Integer Overflow in Sum Calculation\nWhen computing the average of two heap tops, adding two large integers can cause overflow in languages like Java or C++. Cast to a larger type before adding, or compute as a + (b - a) / 2.0 to avoid overflow while still getting the correct floating-point result. \n\n• Inserting Into Wrong Heap Initially\nThe first element must go into one of the heaps, but subsequent elements must be compared against the appropriate heap top to determine placement. Inserting all elements into one heap first and then rebalancing works, but directly inserting into the wrong heap without proper comparison breaks the invariant that all elements in the small heap are less than or equal to all elements in the large heap. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "subsets",
        "title": "Subsets",
        "difficulty": "Medium",
        "category": "Backtracking",
        "tags": [
            "backtracking"
        ],
        "description": "Given an array nums of unique integers, return all possible subsets of nums. The solution set must not contain duplicate subsets. You may return the solution in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,3]",
                "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
                "explanation": ""
            },
            {
                "input": "nums = [7]",
                "output": "[[],[7]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1 2 3",
                "expectedOutput": "1 2 1 2 3 1 3 2 3 1 2 3"
            },
            {
                "input": "1\n7",
                "expectedOutput": "7"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void subsets() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Backtracking\n\nThe idea is to build all possible subsets by making a choice at each step:for every number, we have two options — include it or exclude it.This naturally forms a decision tree.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\n2. Iteration\n\nStart with just one subset: the empty set [].\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\n3. Bit Manipulation\n\nEvery subset can be represented using bits.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Modifying the Subset After Adding to Result\nWhen adding a subset to the result list, you must add a copy of the current subset. Otherwise, backtracking modifications will alter subsets already in the result. \n\n• Forgetting the Empty Subset\nThe power set always includes the empty subset []. Forgetting to initialize with an empty subset or starting the iteration incorrectly will miss this case. \n\n• Incorrect Index Handling in Backtracking\nWhen recursing, start from i + 1 to avoid reusing the same element and to prevent duplicate subsets. Starting from 0 or i generates incorrect results. \n\n• Integer Overflow in Bitmask Approach\nFor the bitmask solution, 1 << n can overflow for large n. In most languages, this limits the approach to around 30 elements, though problem constraints usually keep n small. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "permutations",
        "title": "Permutations",
        "difficulty": "Medium",
        "category": "Backtracking",
        "tags": [
            "backtracking"
        ],
        "description": "Given an array nums of unique integers, return all the possible permutations. You may return the answer in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,3]",
                "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
                "explanation": ""
            },
            {
                "input": "nums = [7]",
                "output": "[[7]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1 2 3",
                "expectedOutput": "1 2 3 1 3 2 2 1 3 2 3 1 3 1 2 3 2 1"
            },
            {
                "input": "1\n7",
                "expectedOutput": "7"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void permutations() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nThe idea is to generate permutations by building them from smaller permutations.\n\nComplexity:\nTime: O(n! * n2)\nSpace: O(n! * n)\n\n\n2. Iteration\n\nWe build permutations step-by-step using iteration instead of recursion.\n\nComplexity:\nTime: O(n! * n2)\nSpace: O(n! * n)\n\n\n3. Backtracking\n\nBacktracking builds permutations by choosing numbers one-by-one and exploring all possible orders.\n\nComplexity:\nTime: O(n! * n)\nSpace: O(n! * n)\n\n\n4. Backtracking (Bit Mask)\n\nWe want to generate all permutations, but instead of using a boolean pick array,we use a bitmask (mask) to track which elements in nums have been used.\n\nComplexity:\nTime: O(n! * n)\nSpace: O(n! * n)\n\n\n5. Backtracking (Optimal)\n\nThis approach generates permutations in-place by swapping elements.\n\nComplexity:\nTime: O(n! * n)\nSpace: O(n! * n)\n\n\nCommon Pitfalls\n\n• Adding Reference Instead of Copy\nWhen a complete permutation is found, you must add a copy of the current permutation list to the result. Adding the reference directly means all entries in the result will point to the same list, which gets modified during backtracking. Always use perm.copy(), new ArrayList<>(perm), or equivalent. \n\n• Forgetting to Backtrack\nAfter recursively exploring with an element added to the permutation, you must remove it (backtrack) before trying the next element. Forgetting to pop the element or reset the visited flag results in incomplete exploration of the decision tree and missing permutations. \n\n• Inefficient Element Tracking\nUsing linear search to check if an element is already in the permutation leads to O(n) overhead per check, resulting in O(n! _ n^2) time complexity. Using a boolean visited array or bitmask reduces this to O(1) per check, achieving the optimal O(n! _ n) complexity. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "subsets-ii",
        "title": "Subsets Ii",
        "difficulty": "Medium",
        "category": "Backtracking",
        "tags": [
            "backtracking"
        ],
        "description": "You are given an array nums of integers, which may contain duplicates. Return all possible subsets. The solution must not contain duplicate subsets. You may return the solution in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,1]",
                "output": "[[],[1],[1,2],[1,1],[1,2,1],[2]]",
                "explanation": ""
            },
            {
                "input": "nums = [7,7]",
                "output": "[[],[7], [7,7]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1 2 1",
                "expectedOutput": "1 1 2 1 1 1 2 1 2"
            },
            {
                "input": "2\n7 7",
                "expectedOutput": "7  7 7"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void subsetsIi() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThis brute-force method generates every possible subset by making a binary choice at each index:\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(2n)\n\n\n2. Backtracking - I\n\nWe want all subsets, but the array may contain duplicates.If we blindly generate all subsets, we will produce repeated ones.So we must avoid picking the same value in the same decision level more than once.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\n3. Backtracking - II\n\nWe want to generate all subsets, but duplicates in the input can create repeated subsets.To avoid duplicates cleanly, instead of making \"pick / not pick\" decisions, this approach builds subsets by choosing each possible next element—but only once per unique value at each recursion level.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\n4. Iteration\n\nThis iterative method builds subsets step by step.Normally, for each new number, we add it to every existing subset.But duplicates cause repeated subsets — so we must avoid recombining duplicates with all previous subsets.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Forgetting to Sort the Array First\nSorting is essential because it groups duplicate elements together, enabling the skip logic to work correctly. Without sorting, duplicates scattered throughout the array cannot be detected and skipped, resulting in duplicate subsets. \n\n• Incorrect Duplicate Skipping Condition\nThe condition j > i && nums[j] == nums[j-1] must use j > i, not j > 0 or j >= i. Using j > 0 would skip the first occurrence of a duplicate at each recursion level, missing valid subsets. The check ensures we only skip duplicates after the first one at the current decision level. \n\n• Modifying the Subset Reference Incorrectly\nWhen adding subsets to the result, you must copy the current subset (e.g., subset[:] in Python or new ArrayList<>(subset) in Java). Adding the reference directly means all entries in the result will point to the same list, which gets modified during backtracking. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "combination-sum-ii",
        "title": "Combination Sum Ii",
        "difficulty": "Medium",
        "category": "Backtracking",
        "tags": [
            "backtracking"
        ],
        "description": "You are given an array of integers candidates, which may contain duplicates, and a target integer target. Your task is to return a list of all unique combinations of candidates where the chosen numbers sum to target. Each element from candidates may be chosen at most once within a combination. The solution set must not contain duplicate combinations. You may return the combinations in any order and the order of the numbers in each combination can be in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "candidates = [9,2,2,4,6,1,5], target = 8",
                "output": "[",
                "explanation": ""
            },
            {
                "input": "candidates = [1,2,3,4,5], target = 7",
                "output": "[",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n9 2 2 4 6 1 5\n8",
                "expectedOutput": ""
            },
            {
                "input": "5\n1 2 3 4 5\n7",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void combinationSumIi() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThe brute-force approach tries every possible subset of the candidate numbers.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n * 2n)\n\n\n2. Backtracking\n\nThe goal is to choose numbers that sum to the target, but each number can be used once, and the list may contain duplicates.To avoid generating duplicate combinations, we:\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\n3. Backtracking (Hash Map)\n\nInstead of sorting and skipping duplicates, this method uses a frequency map that stores how many times each number appears.Example:If input is [1,1,2,2,2,3], we convert it into:\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\n4. Backtracking (Optimal)\n\nWe need all unique combinations where each number can be used at most once, and duplicates in the input should not create duplicate combinations.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Generating Duplicate Combinations\nThe input contains duplicates, and each element can only be used once. Without proper duplicate handling, [1,1,2] with target 3 might produce [1,2] twice. Always sort first and skip consecutive duplicates at the same recursion level. \n\n• Reusing Elements (Using i Instead of i + 1)\nUnlike Combination Sum I where elements can be reused, this problem requires each element to be used at most once. Recursing with the same index allows reuse. \n\n• Forgetting to Sort Before Skipping Duplicates\nThe duplicate-skipping logic candidates[i] == candidates[i-1] only works on a sorted array. Without sorting, duplicates won't be adjacent and the skip logic fails silently, producing duplicate combinations. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "palindromic-substrings",
        "title": "Palindromic Substrings",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "Given a string s, split s into substrings where every substring is a palindrome. Return all possible lists of palindromic substrings. You may return the solution in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"aab\"",
                "output": "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]",
                "explanation": ""
            },
            {
                "input": "s = \"a\"",
                "output": "[[\"a\"]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "aab",
                "expectedOutput": "\"a\" \"a\" \"b\" \"aa\" \"b\""
            },
            {
                "input": "a",
                "expectedOutput": "\"a\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void palindromicSubstrings() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Backtracking - I\n\nWe want to split the string into pieces, but we only keep a split if every piece is a palindrome.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\n2. Backtracking - II\n\nWe build the partition from left to right.\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n)\n\n\n3. Backtracking (DP)\n\nIn plain backtracking, we repeatedly check whether substrings are palindromes, which costs extra time.To optimize this, we precompute all palindrome substrings once using Dynamic Programming (DP).\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n2)\n\n\n4. Recursion\n\nThis approach combines Dynamic Programming and pure recursion (return-based).\n\nComplexity:\nTime: O(n * 2n)\nSpace: O(n2)\n\n\nCommon Pitfalls\n\n• Forgetting to Copy the Partition Before Adding to Results\nWhen adding the current partition to the results list, you must add a copy of the list, not a reference to it. Since backtracking modifies the same partition list, adding the reference directly means all entries in the result will point to the same (eventually empty) list. \n\n• Incorrect Base Case in Backtracking\nThe base case should trigger when the starting index reaches the end of the string, indicating a complete valid partition. A common mistake is to check i > len(s) instead of i >= len(s) or i == len(s), causing missed partitions or index errors. \n\n• Redundant Palindrome Checks Without Memoization\nRepeatedly checking whether the same substring is a palindrome across different recursion branches wastes time. Without precomputing palindrome information using DP, the same substring may be checked O(2^n) times, significantly slowing down the solution for longer strings. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "letter-combinations-of-a-phone-number",
        "title": "Letter Combinations Of A Phone Number",
        "difficulty": "Medium",
        "category": "Backtracking",
        "tags": [
            "backtracking"
        ],
        "description": "You are given a string digits made up of digits from 2 through 9 inclusive. Each digit (not including 1) is mapped to a set of characters as shown below: A digit could represent any one of the characters it maps to. Return all possible letter combinations that digits could represent. You may return the answer in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "digits = \"34\"",
                "output": "[\"dg\",\"dh\",\"di\",\"eg\",\"eh\",\"ei\",\"fg\",\"fh\",\"fi\"]",
                "explanation": ""
            },
            {
                "input": "digits = \"\"",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "34",
                "expectedOutput": "\"dg\" \"dh\" \"di\" \"eg\" \"eh\" \"ei\" \"fg\" \"fh\" \"fi\""
            },
            {
                "input": "",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void letterCombinationsOfAPhoneNumber() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Backtracking\n\nEach digit maps to a set of characters (like on a phone keypad).The task is to choose one character per digit, in order, and generate all possible combinations.\n\nComplexity:\nTime: O(n * 4n)\nSpace: O(n)\n\n\n2. Iteration\n\nInstead of using recursion, we build combinations level by level.\n\nComplexity:\nTime: O(n * 4n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Not Handling Empty Input\nWhen digits is empty, returning [\"\"] (list with empty string) is wrong. The correct answer is [] (empty list) since there are no combinations to form. \n\n• Incorrect Digit-to-Letter Mapping\nDigit 7 maps to \"pqrs\" (4 letters) and digit 9 maps to \"wxyz\" (4 letters), not 3 letters each. Using \"qprs\" instead of \"pqrs\" for digit 7 produces wrong orderings. \n\n• Off-by-One in Digit Indexing\nWhen using an array for digit mapping, digits 0 and 1 have no letters. Forgetting this offset or incorrectly computing digit - '0' leads to index errors or wrong character mappings. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "n-queens",
        "title": "N Queens",
        "difficulty": "Hard",
        "category": "Backtracking",
        "tags": [
            "backtracking"
        ],
        "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard so that no two queens can attack each other. A queen in a chessboard can attack horizontally, vertically, and diagonally. Given an integer n, return all distinct solutions to the n-queens puzzle. Each solution contains a unique board layout where the queen pieces are placed. 'Q' indicates a queen and '.' indicates an empty space. You may return the answer in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "n = 4",
                "output": "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
                "explanation": ""
            },
            {
                "input": "n = 1",
                "output": "[[\"Q\"]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4",
                "expectedOutput": "\".Q..\" \"...Q\" \"Q...\" \"..Q.\" \"..Q.\" \"Q...\" \"...Q\" \".Q..\""
            },
            {
                "input": "1",
                "expectedOutput": "\"Q\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void nQueens() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Backtracking\n\nThe goal is to place one queen in each row such that no two queens attack each other.\n\nComplexity:\nTime: O(n!)\nSpace: O(n2)\n\n\n2. Backtracking (Hash Set)\n\nInstead of checking the board every time to see if a queen is safe, we remember the attacked positions using hash sets.\n\nComplexity:\nTime: O(n!)\nSpace: O(n2)\n\n\n3. Backtracking (Visited Array)\n\nThis approach is the array-based version of the hash-set solution.\n\nComplexity:\nTime: O(n!)\nSpace: O(n2)\n\n\n4. Backtracking (Bit Mask)\n\nThis is the most optimized backtracking approach for the N-Queens problem.\n\nComplexity:\nTime: O(n!)\nSpace: O(n2)\n\n\nCommon Pitfalls\n\n• Checking Only Columns and Forgetting Diagonals\nA frequent mistake is checking only whether a column is occupied while neglecting diagonal conflicts. Queens attack along both diagonals, so you must verify the upper-left diagonal (where row - col is constant) and the upper-right diagonal (where row + col is constant). Missing either diagonal check will produce invalid board configurations. \n\n• Incorrect Diagonal Index Calculation\nWhen using arrays to track diagonal occupancy, the negative diagonal row - col can produce negative indices. You must offset this value by adding n (i.e., use row - col + n) to ensure valid array indices. Forgetting this offset causes array index out of bounds errors or incorrect diagonal tracking. \n\n• Forgetting to Backtrack State\nAfter recursively exploring a placement and returning, you must undo the state changes (remove the queen from sets/arrays and reset the board position to \".\"). Failing to properly backtrack leaves stale state that incorrectly blocks future valid placements, causing the algorithm to miss valid solutions. \n\n• Scanning Below Current Row in Safety Check\nSince queens are placed row by row from top to bottom, only rows above the current row can contain previously placed queens. A common error is scanning the entire column or both diagonal directions (up and down). This is wasteful at best and can cause incorrect behavior if the board is not properly initialized. Only check upward directions: the column above, upper-left diagonal, and upper-right diagonal. \n\n• Not Creating a Deep Copy of the Board When Saving Solutions\nWhen a valid configuration is found, you must create a copy of the board before adding it to the results. Simply appending a reference to the same board object means all stored solutions will reflect subsequent modifications during backtracking. Always convert each row to a new string and create a fresh list for each solution. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "number-of-islands",
        "title": "Number Of Islands",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "bfs",
            "dfs"
        ],
        "description": "Given a 2D grid grid where '1' represents land and '0' represents water, count and return the number of islands. An island is formed by connecting adjacent lands horizontally or vertically and is surrounded by water. You may assume water is surrounding the grid (i.e., all the edges are water).",
        "constraints": [],
        "examples": [
            {
                "input": "grid = [",
                "output": "1",
                "explanation": ""
            },
            {
                "input": "grid = [",
                "output": "4",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "[",
                "expectedOutput": "1"
            },
            {
                "input": "[",
                "expectedOutput": "4"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void numberOfIslands() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nThink of the grid as a map where '1' is land and '0' is water.An island is a group of connected land cells (up, down, left, right).Whenever we find a land cell that hasn’t been visited, we start a DFS to sink the entire island by marking all its connected land as water. Each DFS call corresponds to one island.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n2. Breadth First Search\n\nTreat the grid like a map where '1' represents land and '0' represents water.Each island is a group of connected land cells.When we encounter a land cell, we use BFS to visit all connected land cells and mark them as water, ensuring the same island is not counted again.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Disjoint Set Union\n\nThink of every land cell ('1') as its own separate island initially.When two land cells are adjacent (up, down, left, right), they actually belong to the same island, so we should merge them.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\nCommon Pitfalls\n\n• Not Marking Cells as Visited\nWhen exploring an island, you must mark cells as visited (either by changing them to '0' or using a visited set). Forgetting this causes infinite loops as the DFS/BFS keeps revisiting the same cells. \n\n• Counting Every Land Cell Instead of Islands\nEach island should be counted once when you first encounter it. A common mistake is incrementing the count for every '1' cell rather than only incrementing when starting a new DFS/BFS traversal. \n\n• Incorrect Boundary Checks\nAlways verify that row and column indices are within bounds before accessing the grid. Off-by-one errors or missing boundary checks cause index out of bounds errors. \n\n• Diagonal Connections\nThis problem only considers horizontal and vertical connections (4-directional). Including diagonal neighbors incorrectly merges separate islands and undercounts the total. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "clone-graph",
        "title": "Clone Graph",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "bfs",
            "dfs"
        ],
        "description": "Given a node in a connected undirected graph, return a deep copy of the graph. Each node in the graph contains an integer value and a list of its neighbors. The graph is shown in the test cases as an adjacency list. An adjacency list is a mapping of nodes to lists, used to represent a finite graph. Each list describes the set of neighbors of a node in the graph. For simplicity, nodes values are numbered from 1 to n, where n is the total number of nodes in the graph. The index of each node within the adjacency list is the same as the node's value (1-indexed). The input node will always be the first node in the graph and have 1 as the value.",
        "constraints": [],
        "examples": [
            {
                "input": "adjList = [[2],[1,3],[2]]",
                "output": "[[2],[1,3],[2]]",
                "explanation": ""
            },
            {
                "input": "adjList = [[]]",
                "output": "[[]]",
                "explanation": ""
            },
            {
                "input": "adjList = []",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n2 1,3 2",
                "expectedOutput": "2 1 3 2"
            },
            {
                "input": "1",
                "expectedOutput": ""
            },
            {
                "input": "0",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void cloneGraph() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Seacrh\n\nThe graph may contain cycles, so we cannot simply copy nodes recursively without remembering what we've already copied.To handle this, we use a map (old → new):\n\nComplexity:\nTime: O(V+E)\nSpace: O(V)\n\n\n2. Breadth First Search\n\nThe graph can have cycles, so while cloning we must avoid creating duplicate nodes or looping forever.Using Breadth First Search (BFS), we explore the graph level by level and keep a map from original nodes to their clones.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V)\n\n\nCommon Pitfalls\n\n• Forgetting to Handle Cycles\nFailing to track visited nodes causes infinite recursion when the graph contains cycles. Always use a map to store already-cloned nodes before processing neighbors. \n\n• Cloning the Same Node Multiple Times\nWithout a mapping from original to cloned nodes, the same node may be cloned multiple times, breaking the graph structure. Two neighbors pointing to the same original node should point to the same cloned node. \n\n• Adding Clone to Map After Processing Neighbors\nThe clone must be added to the map immediately after creation, before recursing on neighbors. Otherwise, back-edges to the current node will create a new clone instead of reusing the existing one. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "max-area-of-island",
        "title": "Max Area Of Island",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "bfs",
            "dfs"
        ],
        "description": "You are given a matrix grid where grid[i] is either a 0 (representing water) or 1 (representing land). An island is defined as a group of 1's connected horizontally or vertically. You may assume all four edges of the grid are surrounded by water. The area of an island is defined as the number of cells within the island. Return the maximum area of an island in grid. If no island exists, return 0.",
        "constraints": [],
        "examples": [
            {
                "input": "grid = [",
                "output": "6",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "[",
                "expectedOutput": "6"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void maxAreaOfIsland() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nAn island is a group of connected 1s.To find the maximum area, we explore each island fully and count how many cells it contains.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n2. Breadth First Search\n\nAn island is a group of connected 1s.To find the maximum area, we explore each island completely and count how many cells it has.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Disjoint Set Union\n\nThink of each land cell (1) as a node in a graph.If two land cells are adjacent (up, down, left, right), they belong to the same island.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\nCommon Pitfalls\n\n• Forgetting to Mark Cells as Visited\nA common mistake is not marking cells as visited before or immediately after processing them. This leads to infinite recursion in DFS or infinite loops in BFS, as the same cell gets added to the queue or call stack repeatedly. Always mark a cell as visited (either by using a separate visited set or by modifying the grid value to 0) before exploring its neighbors. \n\n• Incorrect Boundary Checks\nFailing to properly check grid boundaries before accessing grid[r][c] causes index-out-of-bounds errors. The order of conditions matters: always check r >= 0 && r < ROWS && c >= 0 && c < COLS before checking grid[r][c]. Short-circuit evaluation prevents the array access when indices are invalid. \n\n• Counting Area Incorrectly in BFS\nIn BFS, a subtle bug occurs when you increment the area count at the wrong time. The area should be incremented when a cell is added to the queue and marked as visited, not when it is dequeued. If you increment when dequeuing, you may count the same cell multiple times if it gets added to the queue from different neighbors before being processed. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "pacific-atlantic-water-flow",
        "title": "Pacific Atlantic Water Flow",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "bfs",
            "dfs"
        ],
        "description": "You are given a rectangular island heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c). The islands borders the Pacific Ocean from the top and left sides, and borders the Atlantic Ocean from the bottom and right sides. Water can flow in four directions (up, down, left, or right) from a cell to a neighboring cell with height equal or lower. Water can also flow into the ocean from cells adjacent to the ocean. Find all cells where water can flow from that cell to both the Pacific and Atlantic oceans. Return it as a 2D list where each element is a list [r, c] representing the row and column of the cell. You may return the answer in any order.",
        "constraints": [],
        "examples": [
            {
                "input": "heights = [",
                "output": "[[0,2],[0,4],[1,0],[1,1],[1,2],[1,3],[1,4],[2,0]]",
                "explanation": ""
            },
            {
                "input": "heights = [[1],[1]]",
                "output": "[[0,0],[1,0]]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "[",
                "expectedOutput": "0 2 0 4 1 0 1 1 1 2 1 3 1 4 2 0"
            },
            {
                "input": "2\n1 1",
                "expectedOutput": "0 0 1 0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void pacificAtlanticWaterFlow() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force (Backtracking)\n\nFor each cell, we try to see where water can flow if it starts there.\n\nComplexity:\nTime: O(m * n * 4m * n)\nSpace: O(m * n)\n\n\n2. Depth First Search\n\nInstead of starting DFS from every cell (slow), we reverse the thinking:\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Breadth First Search\n\nDo the same “reverse flow” idea, but with BFS.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\nCommon Pitfalls\n\n• Using the Wrong Flow Direction Comparison\nWhen starting from ocean borders and moving inward, the comparison must check if the neighbor height is greater than or equal to the current height (water flows uphill in reverse). Using the normal downhill comparison (neighbor <= current) gives incorrect reachability since the logic is reversed. \n\n• Running Separate DFS/BFS for Each Cell\nA brute force approach that runs a full traversal from every cell to check ocean reachability leads to O((m*n)^2) time complexity or worse. The efficient approach is to run only two traversals total: one multi-source search from all Pacific border cells and one from all Atlantic border cells. \n\n• Not Properly Handling Edge and Corner Cells\nEdge cells border one ocean while corner cells border both oceans. A common bug is forgetting that cells on the top row and left column touch the Pacific, while cells on the bottom row and right column touch the Atlantic. Missing any border initialization causes incomplete reachability sets. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "surrounded-regions",
        "title": "Surrounded Regions",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "bfs",
            "dfs"
        ],
        "description": "You are given a 2-D matrix board containing 'X' and 'O' characters. If a continous, four-directionally connected group of 'O's is surrounded by 'X's, it is considered to be surrounded. Change all surrounded regions of 'O's to 'X's and do so in-place by modifying the input board.",
        "constraints": [],
        "examples": [
            {
                "input": "board = [",
                "output": "[",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "[",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void surroundedRegions() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nOnly the 'O' regions that touch the border can never be surrounded, because they have a path to the outside of the board.So instead of trying to find surrounded regions directly, we do the opposite:\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n2. Breadth First Search\n\nSame idea as DFS, but we use BFS with a queue.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Disjoint Set Union\n\nTreat every 'O' cell as a node in a graph. Two 'O' cells belong to the same region if they are 4-directionally connected.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\nCommon Pitfalls\n\n• Trying to Find Surrounded Regions Directly\nThe intuitive approach of finding regions completely surrounded by 'X' is error-prone. A region touching any border cell cannot be captured, and checking this condition during a flood fill is complex. The correct approach is to invert the logic: first mark all border-connected 'O' cells as safe, then flip all remaining 'O' cells. This reversal simplifies the problem significantly. \n\n• Forgetting to Check All Four Borders\nWhen marking safe regions, you must start DFS/BFS from 'O' cells on all four borders: top row, bottom row, left column, and right column. A common mistake is only checking two opposite edges (like top and bottom) and missing cells connected through the left or right borders. Ensure your initial seeding loop covers all border cells. \n\n• Modifying Cells Without a Temporary Marker\nIf you flip 'O' to 'X' immediately when you find a surrounded region, you may incorrectly process cells that should remain 'O'. The standard approach uses a temporary marker (like 'T') to distinguish between safe 'O' cells and those to be processed. After marking is complete, convert 'T' back to 'O' and remaining 'O' to 'X' in a final pass. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "rotting-oranges",
        "title": "Rotting Oranges",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "bfs"
        ],
        "description": "You are given a 2-D matrix grid. Each cell can have one of three possible values: Every minute, if a fresh fruit is horizontally or vertically adjacent to a rotten fruit, then the fresh fruit also becomes rotten. Return the minimum number of minutes that must elapse until there are zero fresh fruits remaining. If this state is impossible within the grid, return -1.",
        "constraints": [],
        "examples": [
            {
                "input": "grid = [[1,1,0],[0,1,1],[0,1,2]]",
                "output": "4",
                "explanation": ""
            },
            {
                "input": "grid = [[1,0,1],[0,2,0],[1,0,1]]",
                "output": "-1",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1,1,0 0,1,1 0,1,2",
                "expectedOutput": "4"
            },
            {
                "input": "3\n1,0,1 0,2,0 1,0,1",
                "expectedOutput": "-1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void rottingOranges() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Breadth First Search\n\nThis is a multi-source BFS problem.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n2. Breadth First Search (No Queue)\n\nThis is still BFS by levels, but instead of using a queue, we simulate \"minutes\" with grid marking.\n\nComplexity:\nTime: O((m * n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Starting BFS from a Single Rotten Orange\nA common mistake is initializing BFS with only one rotten orange instead of all of them simultaneously. Since all rotten oranges spread rot at the same time, you must add every cell with value 2 to the queue before starting BFS. Starting from just one source gives incorrect time calculations. \n\n• Forgetting to Track Fresh Orange Count\nSome solutions forget to count fresh oranges initially and check if any remain unreachable. Without tracking the fresh count, you cannot determine whether all oranges can be rotted or if some are isolated. Always decrement fresh when an orange rots and return -1 if fresh > 0 after BFS completes. \n\n• Incrementing Time Incorrectly\nA subtle bug occurs when incrementing time after processing each individual orange rather than after each BFS level. Each level represents one minute, so you must process all oranges at the current level before incrementing time. Use a loop that processes len(queue) elements per iteration to correctly track levels. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "walls-and-gates",
        "title": "Walls And Gates",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "bfs"
        ],
        "description": "You are given a m×nm \\times nm×n 2D grid initialized with these three possible values: Fill each land cell with the distance to its nearest treasure chest. If a land cell cannot reach a treasure chest then the value should remain INF. Assume the grid can only be traversed up, down, left, or right. Modify the grid in-place.",
        "constraints": [],
        "examples": [
            {
                "input": "[",
                "output": "[",
                "explanation": ""
            },
            {
                "input": "[",
                "output": "[",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "",
                "expectedOutput": ""
            },
            {
                "input": "",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void wallsAndGates() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force (Backtracking)\n\nFor every empty cell (INF), we try to find the shortest path to any treasure (0) by exploring all 4 directions using backtracking DFS.\n\nComplexity:\nTime: O(m * n * 4m * n)\nSpace: O(m * n)\n\n\n2. Breadth First Search\n\nBFS is perfect for shortest path in an unweighted grid.From one empty cell (INF), we expand level-by-level (distance 0, 1, 2, ...). The first time we reach a treasure cell (0), we are guaranteed that distance is the minimum steps needed.\n\nComplexity:\nTime: O((m * n)\nSpace: O(m * n)\n\n\n3. Multi Source BFS\n\nInstead of running BFS from every empty room, run BFS once starting from all treasures (0 cells) at the same time.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\nCommon Pitfalls\n\n• Starting BFS from Empty Rooms Instead of Treasures\nA common mistake is to run BFS from each empty room to find the nearest treasure, resulting in O((m*n)^2) time complexity. The optimal approach is multi-source BFS starting from all treasures simultaneously, which processes each cell exactly once. \n\n• Not Distinguishing Walls from Unvisited Cells\nWalls are represented by -1 and should never be added to the queue or updated. Confusing the wall value with the infinity value (2147483647) for empty rooms can cause incorrect distance calculations or infinite loops. \n\n• Updating Distance Before Adding to Queue\nIn BFS, the distance should be updated when a cell is first discovered (added to the queue), not when it is processed (removed from the queue). Updating too late can result in cells being added to the queue multiple times with different distances, leading to incorrect results and inefficiency. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "course-schedule",
        "title": "Course Schedule",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "topological-sort"
        ],
        "description": "You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must take course b first if you want to take course a. The pair [0, 1], indicates that must take course 1 before taking course 0. There are a total of numCourses courses you are required to take, labeled from 0 to numCourses - 1. Return true if it is possible to finish all courses, otherwise return false.",
        "constraints": [],
        "examples": [
            {
                "input": "numCourses = 2, prerequisites = [[0,1]]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "numCourses = 2, prerequisites = [[0,1],[1,0]]",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "2\n1\n0,1",
                "expectedOutput": "true"
            },
            {
                "input": "2\n2\n0,1 1,0",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void courseSchedule() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Cycle Detection (DFS)\n\nEach course is a node, and each prerequisite is a directed edge.You can finish all courses only if there is no cycle in this directed graph.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\n2. Topological Sort (Kahn's Algorithm)\n\nTreat each course as a node and each prerequisite as a directed edge.If a course has no prerequisites, it can be taken immediately.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\nCommon Pitfalls\n\n• Using a Single Visited Set Instead of Tracking the Current Path\nA single visited set marks nodes as seen globally, but cycle detection requires knowing if a node is in the current DFS path. Without tracking the recursion path separately, you may miss cycles or falsely detect them. \n\n• Forgetting to Handle Disconnected Components\nIf you only start DFS from one node, you may miss cycles in disconnected parts of the graph. Always iterate through all courses and run DFS from each unvisited node. \n\n• Incorrectly Building the Adjacency List\nThe prerequisite [a, b] means \"to take course a, you must first take course b\". Mixing up which course maps to which leads to checking the wrong dependencies and missing or falsely reporting cycles. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "course-schedule-ii",
        "title": "Course Schedule Ii",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "topological-sort"
        ],
        "description": "You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must take course b first if you want to take course a. There are a total of numCourses courses you are required to take, labeled from 0 to numCourses - 1.  Return a valid ordering of courses you can take to finish all courses. If there are many valid answers, return any of them. If it's not possible to finish all courses, return an empty array.",
        "constraints": [],
        "examples": [
            {
                "input": "numCourses = 3, prerequisites = [[1,0]]",
                "output": "[0,1,2]",
                "explanation": ""
            },
            {
                "input": "numCourses = 3, prerequisites = [[0,1],[1,2],[2,0]]",
                "output": "[]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1\n1,0",
                "expectedOutput": "0 1 2"
            },
            {
                "input": "3\n3\n0,1 1,2 2,0",
                "expectedOutput": ""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void courseScheduleIi() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Cycle Detection (DFS)\n\nEach course is a node, and each prerequisite is a directed edge.We want an order of courses such that all prerequisites of a course are taken before it.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\n2. Topological Sort (Kahn's Algorithm)\n\nTreat each course as a node and each prerequisite as a directed edge.A course can be taken only when all its prerequisites are completed.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\n3. Topological Sort (DFS)\n\nWe want an order of courses such that every course appears after its prerequisites.This approach mixes Topological Sorting with DFS-style traversal.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\nCommon Pitfalls\n\n• Confusing Cycle Detection with Visited Tracking\nIn DFS-based topological sort, you need two separate tracking mechanisms: one for nodes currently in the DFS path (for cycle detection) and one for fully processed nodes. Using only one set leads to either false cycle detection or infinite loops. \n\n• Building the Graph in the Wrong Direction\nThe prerequisite pair [a, b] means \"to take course a, you must first take course b\". Building edges in the wrong direction results in an incorrect topological order. \n\n• Forgetting to Handle Disconnected Courses\nCourses with no prerequisites and no dependents still need to be included in the output. Forgetting to iterate over all courses means some valid courses might be missing from the result. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "redundant-connection",
        "title": "Redundant Connection",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "union-find"
        ],
        "description": "You are given a connected undirected graph with n nodes labeled from 1 to n. Initially, it contained no cycles and consisted of n-1 edges. We have now added one additional edge to the graph. The edge has two different vertices chosen from 1 to n, and was not an edge that previously existed in the graph. The graph is represented as an array edges of length n where edges[i] = [ai, bi] represents an edge between nodes ai and bi in the graph. Return an edge that can be removed so that the graph is still a connected non-cyclical graph. If there are multiple answers, return the edge that appears last in the input edges.",
        "constraints": [],
        "examples": [
            {
                "input": "edges = [[1,2],[1,3],[3,4],[2,4]]",
                "output": "[2,4]",
                "explanation": ""
            },
            {
                "input": "edges = [[1,2],[1,3],[1,4],[3,4],[4,5]]",
                "output": "[3,4]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1,2 1,3 3,4 2,4",
                "expectedOutput": "2 4"
            },
            {
                "input": "5\n1,2 1,3 1,4 3,4 4,5",
                "expectedOutput": "3 4"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void redundantConnection() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Cycle Detection (DFS)\n\nA tree cannot contain a cycle.While adding edges one by one, the first edge that creates a cycle is the redundant connection.\n\nComplexity:\nTime: O(E * (V+E)\nSpace: O(V+E)\n\n\n2. Depth First Search (Optimal)\n\nInstead of checking for a cycle after every edge, we build the whole graph once and find the cycle nodes in a single dfs.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\n3. Topological Sort (Kahn's Algorithm)\n\nThis uses the \"peel off leaves\" idea (often called topological trimming).Even though the graph is undirected, we can still remove nodes with degree 1 repeatedly:\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\n4. Disjoint Set Union\n\nUse Disjoint Set Union (Union-Find) to track connected components while adding edges one by one.\n\nComplexity:\nTime: O(V+(E * α(V)\nSpace: O(V)\n\n\nCommon Pitfalls\n\n• Returning the First Cycle Edge Instead of the Last\nThe problem asks for the edge that appears last in the input among all edges that could be removed to break the cycle. A common mistake is returning the first edge that creates a cycle during processing. When using Union-Find, processing edges in order naturally returns the correct answer, but DFS-based approaches must scan edges in reverse to find the last valid edge. \n\n• Treating the Graph as Directed\nThis problem involves an undirected graph, but some solutions incorrectly handle edges as directed. When building the adjacency list, each edge (u, v) must be added in both directions. Forgetting this causes cycle detection to miss valid paths and return incorrect results. \n\n• Not Handling the Parent Node in DFS Cycle Detection\nWhen using DFS to detect cycles in an undirected graph, you must skip the parent node to avoid false positives. In an undirected graph, the edge (u, v) appears as both u -> v and v -> u in the adjacency list. Without parent tracking, DFS would immediately detect a \"cycle\" by going back to the node it just came from. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "number-of-connected-components-in-an-undirected-graph",
        "title": "Number Of Connected Components In An Undirected Graph",
        "difficulty": "Medium",
        "category": "Graph",
        "tags": [
            "graph",
            "union-find"
        ],
        "description": "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [aᵢ, bᵢ] indicates that there is an edge between aᵢ and bᵢ in the graph. Return the number of connected components in the graph.",
        "constraints": [],
        "examples": [
            {
                "input": "n = 5, edges = [[0,1],[1,2],[3,4]]",
                "output": "2",
                "explanation": ""
            },
            {
                "input": "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]",
                "output": "1",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "5\n3\n0,1 1,2 3,4",
                "expectedOutput": "2"
            },
            {
                "input": "5\n4\n0,1 1,2 2,3 3,4",
                "expectedOutput": "1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void numberOfConnectedComponentsInAnUndirectedGraph() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nA connected component is a group of nodes where every node is reachable from any other node in that group.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\n2. Breadth First Search\n\nA connected component is a set of nodes where each node can reach the others.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\n3. Disjoint Set Union (Rank | Size)\n\nDisjoint Set Union (DSU) groups nodes into connected components efficiently.\n\nComplexity:\nTime: O(V+(E * α(V)\nSpace: O(V)\n\n\nCommon Pitfalls\n\n• Forgetting Isolated Nodes\nWhen there are no edges, each node is its own component. Solutions that only iterate through edges will miss nodes with no connections and return 0 instead of n. \n\n• Building a Directed Graph Instead of Undirected\nEdges must be added in both directions. Adding only adj[u].append(v) without adj[v].append(u) causes incomplete traversals and overcounts components. \n\n• Not Marking Nodes as Visited Before Exploring\nIn BFS/DFS, marking a node as visited only after processing (instead of when first discovered) can cause nodes to be added to the queue multiple times, leading to incorrect counts or infinite loops. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "network-delay-time",
        "title": "Network Delay Time",
        "difficulty": "Medium",
        "category": "Advanced Graph",
        "tags": [
            "graph",
            "dijkstra"
        ],
        "description": "You are given a network of n directed nodes, labeled from 1 to n. You are also given times, a list of directed edges where times[i] = (ui, vi, ti).  You are also given an integer k, representing the node that we will send a signal from. Return the minimum time it takes for all of the n nodes to receive the signal. If it is impossible for all the nodes to receive the signal, return -1 instead.",
        "constraints": [],
        "examples": [
            {
                "input": "times = [[1,2,1],[2,3,1],[1,4,4],[3,4,1]], n = 4, k = 1",
                "output": "3",
                "explanation": ""
            },
            {
                "input": "times = [[1,2,1],[2,3,1]], n = 3, k = 2",
                "output": "-1",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1,2,1 2,3,1 1,4,4 3,4,1\n4\n1",
                "expectedOutput": "3"
            },
            {
                "input": "2\n1,2,1 2,3,1\n3\n2",
                "expectedOutput": "-1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void networkDelayTime() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Depth First Search\n\nWe want to know how long it takes for a signal to reach all nodes starting from node k.\n\nComplexity:\nTime: O(V * E)\nSpace: O(V+E)\n\n\n2. Floyd Warshall Algorithm\n\nWe want the shortest time between every pair of nodes so that we can easily know how long it takes for the signal to reach all nodes starting from k.\n\nComplexity:\nTime: O(V3)\nSpace: O(V2)\n\n\n3. Bellman Ford Algorithm\n\nWe want the shortest time for a signal to reach every node starting from node k.\n\nComplexity:\nTime: O(V * E)\nSpace: O(V)\n\n\n4. Shortest Path Faster Algorithm\n\nSPFA (Shortest Path Faster Algorithm) is an optimized version of Bellman–Ford.\n\nComplexity:\nTime: O(V+E)\nSpace: O(V+E)\n\n\n5. Dijkstra's Algorithm\n\nDijkstra's Algorithm finds the shortest time from the source node k to all other nodes when all edge weights are non-negative.\n\nComplexity:\nTime: O(Elog V)\nSpace: O(V+E)\n\n\nCommon Pitfalls\n\n• Returning Max Instead of Checking Unreachable Nodes\nThe answer is the maximum time to reach any node, but only if all nodes are reachable. Some solutions return the maximum distance without first checking if any node remains at infinity. This returns an incorrect large value instead of -1 when nodes are unreachable. \n\n• Using 1-Based vs 0-Based Indexing\nNodes are numbered from 1 to n, not 0 to n-1. Mixing up indexing when building the adjacency list or distance array causes out-of-bounds errors or skipped nodes. Consistently use either 1-based arrays of size n+1 or subtract 1 from all node numbers. \n\n• Revisiting Nodes Without Proper Checks\nIn Dijkstra's algorithm, once a node is finalized (popped from the min-heap), its shortest distance is determined. Processing the same node again wastes time and can cause issues in some implementations. Always skip nodes that have already been visited or whose current distance exceeds the known shortest. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "swim-in-rising-water",
        "title": "Swim In Rising Water",
        "difficulty": "Hard",
        "category": "Advanced Graph",
        "tags": [
            "graph",
            "dijkstra"
        ],
        "description": "You are given a square 2-D matrix of distinct integers grid where each integer grid[i][j] represents the elevation at position (i, j). Rain starts to fall at time = 0, which causes the water level to rise. At time t, the water level across the entire grid is t. You may swim either horizontally or vertically in the grid between two adjacent squares if the original elevation of both squares is less than or equal to the water level at time t. Starting from the top left square (0, 0), return the minimum amount of time it will take until it is possible to reach the bottom right square (n - 1, n - 1).",
        "constraints": [],
        "examples": [
            {
                "input": "grid = [[0,1],[2,3]]",
                "output": "3",
                "explanation": ""
            },
            {
                "input": "grid = [",
                "output": "8",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "2\n0,1 2,3",
                "expectedOutput": "3"
            },
            {
                "input": "[",
                "expectedOutput": "8"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void swimInRisingWater() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nThis brute force tries every possible path from the top-left to the bottom-right.\n\nComplexity:\nTime: O(4n2)\nSpace: O(n2)\n\n\n2. Depth First Search\n\nHere we turn the problem into a yes/no question:\n\nComplexity:\nTime: O(n4)\nSpace: O(n2)\n\n\n3. Binary Search + DFS\n\nInstead of trying every water level t one by one, we binary search the answer.\n\nComplexity:\nTime: O(n2log n)\nSpace: O(n2)\n\n\n4. Dijkstra's Algorithm\n\nThink of each cell’s height as the earliest time you’re allowed to stand on it (water must be at least that high).While moving from start to end, the total time of a path is not the sum — it’s the maximum height you ever step on (because water must rise to that max).\n\nComplexity:\nTime: O(n2log n)\nSpace: O(n2)\n\n\n5. Kruskal's Algorithm\n\nWater level t rises over time. At time t, you’re allowed to step only on cells with height <= t.So as t increases, more cells become “open” and neighboring open cells form bigger connected regions.\n\nComplexity:\nTime: O(n2log n)\nSpace: O(n2)\n\n\nCommon Pitfalls\n\n• Confusing Time with Step Count\nA common mistake is treating \"time\" as the number of steps taken. In this problem, time represents the maximum height you must wait for the water to rise to before you can traverse your chosen path. It is not the path length. \n\n• Forgetting to Include Start and End Cells\nWhen calculating the minimum time, you must include both grid[0][0] and grid[n-1][n-1] in your considerations. The answer is at least max(grid[0][0], grid[n-1][n-1]) since you must be able to stand on both endpoints. \n\n• Incorrect Binary Search Bounds\nWhen using binary search, setting the wrong initial bounds can cause issues. The lower bound should be the minimum value in the grid (or at least grid[0][0]), and the upper bound should be the maximum value. Using 0 to n*n-1 works but is less precise. \n\n• Not Resetting Visited Array Between Searches\nIn both the linear search and binary search DFS approaches, forgetting to reset the visited array between different attempts (for different time values) leads to incorrect results. Each DFS with a new threshold needs a fresh visited state. \n\n• Union-Find: Incorrect Node Indexing\nWhen using Kruskal's algorithm with DSU, a frequent bug is incorrectly converting 2D coordinates to 1D indices. The formula r * N + c must be used consistently, and you must ensure neighbors are already \"open\" (have height <= current time) before attempting to union them. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "cheapest-flights-within-k-stops",
        "title": "Cheapest Flights Within K Stops",
        "difficulty": "Medium",
        "category": "Advanced Graph",
        "tags": [
            "graph",
            "dijkstra",
            "bellman-ford"
        ],
        "description": "There are n airports, labeled from 0 to n - 1, which are connected by some flights. You are given an array flights where flights[i] = [from_i, to_i, price_i] represents a one-way flight from airport from_i to airport to_i with cost price_i. You may assume there are no duplicate flights and no flights from an airport to itself. You are also given three integers src, dst, and k where: Return the cheapest price from src to dst with at most k stops, or return -1 if it is impossible.",
        "constraints": [],
        "examples": [
            {
                "input": "n = 4, flights = [[0,1,200],[1,2,100],[1,3,300],[2,3,100]], src = 0, dst = 3, k = 1",
                "output": "500",
                "explanation": ""
            },
            {
                "input": "n = 3, flights = [[1,0,100],[1,2,200],[0,2,100]], src = 1, dst = 2, k = 1",
                "output": "200",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n4\n0,1,200 1,2,100 1,3,300 2,3,100\n0\n3\n1",
                "expectedOutput": "500"
            },
            {
                "input": "3\n3\n1,0,100 1,2,200 0,2,100\n1\n2\n1",
                "expectedOutput": "200"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void cheapestFlightsWithinKStops() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Dijkstra's Algorithm\n\nWe want the cheapest cost to go from src to dst, but we can take at most k stops (so at most k+1 flights/edges).Normal Dijkstra finds the cheapest path, but it ignores stop limits.So we treat a \"state\" as: (current city, how many stops used).That way, reaching the same city with different stop counts is considered different, and we can enforce the limit.\n\nComplexity:\nTime: O(m⋅k⋅log(n⋅k)\nSpace: O(n⋅k)\n\n\n2. Bellman Ford Algorithm\n\nWe are allowed at most k stops, which means at most k + 1 flights (edges).Bellman–Ford is perfect here because it relaxes edges level by level, where each iteration allows one more edge in the path.\n\nComplexity:\nTime: O(n+(m * k)\nSpace: O(n)\n\n\n3. Shortest Path Faster Algorithm\n\nThis problem is still about finding the cheapest path with at most k stops.SPFA (Shortest Path Faster Algorithm) is essentially a queue-optimized Bellman–Ford.\n\nComplexity:\nTime: O(n * k)\nSpace: O(n+m)\n\n\nCommon Pitfalls\n\n• Confusing Stops vs Flights (Off-by-One)\nThe problem allows at most k stops, which means at most k+1 flights. A common mistake is running Bellman-Ford for k iterations instead of k+1, or checking stops > k when you should check stops == k before taking another flight. \n\n• Not Using a Temporary Array in Bellman-Ford\nWhen relaxing edges, using the same array for both reading and writing allows paths from the current iteration to chain together, potentially exceeding the allowed number of flights in a single round. \n\n• Using Standard Dijkstra Without Stop Tracking\nStandard Dijkstra finds the cheapest path but ignores the stop constraint. A path with fewer stops might be more expensive but still valid, while the cheapest path might exceed k stops. The state must include both cost and number of stops used. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "min-cost-climbing-stairs",
        "title": "Min Cost Climbing Stairs",
        "difficulty": "Easy",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "You are given an array of integers cost where cost[i] is the cost of taking a step from the ith floor of a staircase. After paying the cost, you can step to either the (i + 1)th floor or the (i + 2)th floor. You may choose to start at the index 0 or the index 1 floor. Return the minimum cost to reach the top of the staircase, i.e. just past the last index in cost.",
        "constraints": [],
        "examples": [
            {
                "input": "cost = [1,2,3]",
                "output": "2",
                "explanation": ""
            },
            {
                "input": "cost = [1,2,1,2,1,1,1]",
                "output": "4",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n1 2 3",
                "expectedOutput": "2"
            },
            {
                "input": "7\n1 2 1 2 1 1 1",
                "expectedOutput": "4"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void minCostClimbingStairs() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nFrom any step, you can climb 1 or 2 steps.If you step on index i, you must pay cost[i], then choose the cheaper path ahead.So the problem is: from each step, pick the minimum cost path to the top.\n\nComplexity:\nTime: O(2n)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThe brute force solution recomputes the same subproblems many times.We can optimize it by remembering results once we compute them.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nInstead of solving the problem recursively, we build the answer from the bottom up.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nAt each step, you only need the minimum cost of the next one or two steps.So instead of using a full DP array, we can reuse the input array and update it in place.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Misunderstanding the Goal Position\nThe top of the staircase is at index n (one step past the last stair), not at index n-1. You need to reach beyond the last step, so your DP array or recursion must account for landing on position n, not just visiting the last cost element. \n\n• Forgetting You Can Start from Step 0 or Step 1\nThe problem allows starting from either step 0 or step 1 without paying any cost initially. A common mistake is assuming you must start from step 0 only, which can lead to suboptimal solutions when starting from step 1 would be cheaper. \n\n• Incorrect Base Cases in DP\nWhen using bottom-up DP, the base cases should be dp[0] = 0 and dp[1] = 0 because you can stand on step 0 or step 1 for free before paying to move forward. Setting these incorrectly, such as dp[0] = cost[0], misinterprets when you pay the cost. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "house-robber",
        "title": "House Robber",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "You are given an integer array nums where nums[i] represents the amount of money the ith house has. The houses are arranged in a straight line, i.e. the ith house is the neighbor of the (i-1)th and (i+1)th house. You are planning to rob money from the houses, but you cannot rob two adjacent houses because the security system will automatically alert the police if two adjacent houses were both broken into. Return the maximum amount of money you can rob without alerting the police.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,1,3,3]",
                "output": "4",
                "explanation": ""
            },
            {
                "input": "nums = [2,9,8,3,6]",
                "output": "16",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 1 3 3",
                "expectedOutput": "4"
            },
            {
                "input": "5\n2 9 8 3 6",
                "expectedOutput": "16"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void houseRobber() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nAt every house, you have two choices:\n\nComplexity:\nTime: O(2n)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThe recursive solution recomputes the same subproblems many times.To optimize this, we store the result for each index once it’s computed.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nInstead of deciding recursively, we build the answer step by step.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nWe don’t actually need a full DP array.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Incorrect Base Case Initialization\nIn the bottom-up DP approach, dp[1] should be initialized as max(nums[0], nums[1]), not just nums[1]. This represents the maximum money obtainable from the first two houses. If you set dp[1] = nums[1], you ignore the possibility that the first house might have more money, leading to suboptimal results. \n\n• Confusing the Recurrence Relation\nThe recurrence dp[i] = max(dp[i-1], nums[i] + dp[i-2]) represents choosing between skipping house i (keeping the best from i-1) or robbing house i (adding its value to the best from i-2). A common mistake is writing dp[i] = max(dp[i-1] + nums[i], dp[i-2]), which incorrectly adds the current house value when skipping it. Remember: robbing requires jumping over the previous house, not adding to it. \n\n• Not Handling Edge Cases for Empty or Single-Element Arrays\nWhen the input array is empty, return 0. When it has only one element, return that element. The bottom-up approach with a DP array requires at least two elements to initialize dp[0] and dp[1]. Failing to handle these edge cases causes index-out-of-bounds errors or incorrect results. The space-optimized solution with two variables naturally handles the single-element case but still needs an empty array check. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "longest-palindromic-substring",
        "title": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "Given a string s, return the longest substring of s that is a palindrome. A palindrome is a string that reads the same forward and backward. If there are multiple palindromic substrings that have the same length, return any one of them.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"ababd\"",
                "output": "\"bab\"",
                "explanation": ""
            },
            {
                "input": "s = \"abbc\"",
                "output": "\"bb\"",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "ababd",
                "expectedOutput": "\"bab\""
            },
            {
                "input": "abbc",
                "expectedOutput": "\"bb\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void longestPalindromicSubstring() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nA palindrome reads the same forward and backward.The simplest idea is to try every possible substring and check whether it is a palindrome, then keep the longest one found.\n\nComplexity:\nTime: O(n3)\nSpace: O(n)\n\n\n2. Dynamic Programming\n\nInstead of re-checking the same substrings again and again, we remember whether a substring is a palindrome.\n\nComplexity:\nTime: O(n2)\nSpace: O(n2)\n\n\n3. Two Pointers\n\nA palindrome expands symmetrically from its center.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n4. Manacher's Algorithm\n\nManacher’s Algorithm is an optimized way to find the longest palindromic substring in linear time.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Handling Both Odd and Even Length Palindromes\nWhen expanding around centers, you must check both odd-length palindromes (single character center like \"aba\") and even-length palindromes (between two characters like \"abba\"). Forgetting to handle one case means missing valid palindromes. Always expand from both (i, i) and (i, i+1) for each position. \n\n• Off-by-One Errors in Substring Extraction\nAfter finding the palindrome boundaries, extracting the correct substring is error-prone. If your left pointer l and right pointer r point to positions just outside the palindrome after expansion, you need to adjust them (e.g., l+1 to r-1) before extracting. Verify your indices with simple test cases like \"a\" and \"aa\". \n\n• Returning Wrong Result for Single Character Strings\nFor an input like \"a\", the longest palindromic substring is \"a\" itself. If you initialize your result string as empty and only update it when you find a longer palindrome, you might return an empty string for single-character inputs. Ensure your initialization handles this edge case correctly. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "decode-ways",
        "title": "Decode Ways",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "A string consisting of uppercase english characters can be encoded to a number using the following mapping: To decode a message, digits must be grouped and then mapped back into letters using the reverse of the mapping above. There may be multiple ways to decode a message. For example, \"1012\" can be mapped into: The grouping (1 01 2) is invalid because 01 cannot be mapped into a letter since it contains a leading zero. Given a string s containing only digits, return the number of ways to decode it. You can assume that the answer fits in a 32-bit integer.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"12\"",
                "output": "2",
                "explanation": ""
            },
            {
                "input": "s = \"01\"",
                "output": "0",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "12",
                "expectedOutput": "2"
            },
            {
                "input": "01",
                "expectedOutput": "0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void decodeWays() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nEach digit (or pair of digits) in the string can be mapped to a letter:\n\nComplexity:\nTime: O(2n)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThis is the same decoding logic as the recursive approach, but with memoization to avoid recomputing the same subproblems.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nThis is the iterative version of the decoding logic.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nThis is the space-optimized version of bottom-up DP.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Not Handling Leading Zeros\nA string starting with '0' or containing '0' that cannot pair with the previous digit has zero valid decodings. This is the most common edge case to miss. \n\n• Incorrect Two-Digit Validation\nTwo digits form a valid decoding only if they represent 10-26. Common mistakes include allowing \"00\", \"07\", or values above 26. \n\n• Confusing Base Case Value\nWhen the entire string is decoded (index reaches the end), there is exactly 1 valid decoding (the one that got us here). Returning 0 instead causes all paths to count as zero. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "word-break",
        "title": "Word Break",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words. You are allowed to reuse words in the dictionary an unlimited number of times. You may assume all dictionary words are unique.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"neetcode\", wordDict = [\"neet\",\"code\"]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"applepenapple\", wordDict = [\"apple\",\"pen\",\"ape\"]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"catsincars\", wordDict = [\"cats\",\"cat\",\"sin\",\"in\",\"car\"]",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "neetcode\n2\nneet code",
                "expectedOutput": "true"
            },
            {
                "input": "applepenapple\n3\napple pen ape",
                "expectedOutput": "true"
            },
            {
                "input": "catsincars\n5\ncats cat sin in car",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void wordBreak() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nAt every index i in the string, we want to decide:\n\nComplexity:\nTime: O(t * mn)\nSpace: O(n)\n\n\n2. Recursion (Hash Set)\n\nThis version improves the brute-force recursion by optimizing word lookup.\n\nComplexity:\nTime: O((n * 2n)\nSpace: O(n+(m * t)\n\n\n3. Dynamic Programming (Top-Down)\n\nThis is an optimized version of recursion using memoization.\n\nComplexity:\nTime: O(n * m * t)\nSpace: O(n)\n\n\n4. Dynamic Programming (Hash Set)\n\nThis approach is a top-down dynamic programming solution with pruning.\n\nComplexity:\nTime: O((t2 * n)\nSpace: O(n+(m * t)\n\n\n5. Dynamic Programming (Bottom-Up)\n\nThis is a bottom-up dynamic programming approach.\n\nComplexity:\nTime: O(n * m * t)\nSpace: O(n)\n\n\n6. Dynamic Programming (Trie)\n\nThe normal DP checks every word at every index, which can waste time comparing strings again and again.\n\nComplexity:\nTime: O((n * t2)\nSpace: O(n+(m * t)\n\n\nCommon Pitfalls\n\n• Off-by-One Error in DP Array Initialization\nThe DP array needs size n + 1 to represent the state after processing all characters. Using size n causes index-out-of-bounds when checking dp[n] as the base case. \n\n• Checking Substring Beyond String Length\nWhen iterating through possible word matches, failing to check if the word extends beyond the string causes substring errors or incorrect matches. \n\n• Not Converting wordDict to a Set for Efficient Lookup\nUsing a list for the word dictionary when checking substrings against it results in O(m) lookup time per check, causing TLE on large inputs. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "longest-increasing-subsequence",
        "title": "Longest Increasing Subsequence",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived from the given sequence by deleting some or no elements  without changing the relative order of the remaining characters.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [9,1,4,2,3,3,7]",
                "output": "4",
                "explanation": ""
            },
            {
                "input": "nums = [0,3,1,3,2,3]",
                "output": "4",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "7\n9 1 4 2 3 3 7",
                "expectedOutput": "4"
            },
            {
                "input": "6\n0 3 1 3 2 3",
                "expectedOutput": "4"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void longestIncreasingSubsequence() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nTo find the longest increasing subsequence, we consider each element and decide whether to include it. We can only include an element if it's larger than the previous one in our subsequence. This gives us two choices at each step: skip the current element or include it (if valid). We explore all possibilities recursively and return the maximum length found.\n\nComplexity:\nTime: O(2n)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down) - I\n\nThe recursive solution revisits the same (i, j) pairs multiple times. We can memoize results using a 2D table indexed by current position and the last included index. Since j can range from -1 to n-1, we offset by 1 when indexing the memo table.\n\nComplexity:\nTime: O(n2)\nSpace: O(n2)\n\n\n3. Dynamic Programming (Top-Down) - II\n\nInstead of tracking both current index and last included index, we can define dfs(i) as the length of the longest increasing subsequence starting at index i. For each starting position, we look at all positions j > i where nums[j] > nums[i] and take the maximum. This reduces the state to just one dimension.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n4. Dynamic Programming (Bottom-Up) - I\n\nThis is the iterative version of the two-dimensional memoization approach. We fill a 2D table dp[i][j] from right to left. The value represents the longest increasing subsequence considering elements from index i onward, given that the last included element was at index j (or no element if j == -1).\n\nComplexity:\nTime: O(n2)\nSpace: O(n2)\n\n\n5. Dynamic Programming (Bottom-Up) - II\n\nA simpler 1D approach: let LIS[i] be the length of the longest increasing subsequence starting at index i. Working from right to left, for each i, we check all j > i. If nums[i] < nums[j], we can extend the subsequence starting at j. We take the maximum extension and add 1 for the current element.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n6. Segment Tree\n\nWe can use a segment tree to efficiently query the maximum LIS length among all elements smaller than the current one. First, we compress the values to indices. Then, for each element, we query the segment tree for the maximum LIS among all values less than the current value, add 1, and update the segment tree at the current value's position.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n7. Dynamic Programming + Binary Search\n\nWe maintain an array dp where dp[i] is the smallest ending element of all increasing subsequences of length i + 1. This array stays sorted. For each new element, if it's larger than the last element in dp, it extends the longest subsequence. Otherwise, we use binary search to find the position where it can replace an element, keeping the array optimal for future extensions.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Confusing the Binary Search Array with the Actual LIS\nIn the binary search approach, the dp array at the end does not contain the actual longest increasing subsequence. It contains the smallest tail elements for subsequences of each length. The length of this array is the LIS length, but the elements themselves may not form a valid increasing subsequence from the original array. \n\n• Using Wrong Binary Search Condition\nWhen finding the position to replace in the dp array, you need to find the leftmost position where dp[pos] >= nums[i]. Using > instead of >= can lead to duplicate values being treated as increasing, which violates the strictly increasing requirement. \n\n• Returning Wrong Value in Bottom-Up DP\nIn the O(n^2) DP approach, the answer is the maximum value across all dp[i], not just dp[n-1]. The longest increasing subsequence might end at any index, not necessarily the last one. Returning only the last element of the DP array misses cases where the LIS ends earlier in the array. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "partition-equal-subset-sum",
        "title": "Partition Equal Subset Sum",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "You are given an array of positive integers nums. Return true if you can partition the array into two subsets, subset1 and subset2 where sum(subset1) == sum(subset2). Otherwise, return false.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,3,4]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "nums = [1,2,3,4,5]",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 2 3 4",
                "expectedOutput": "true"
            },
            {
                "input": "5\n1 2 3 4 5",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void partitionEqualSubsetSum() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nThe problem asks whether we can split the array into two subsets with equal sum.\n\nComplexity:\nTime: O(2n)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThis is the same subset sum idea as the recursive approach, but optimized using memoization.\n\nComplexity:\nTime: O(n * target)\nSpace: O(n * target)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nThis is a classic 0/1 subset sum DP.\n\nComplexity:\nTime: O(n * target)\nSpace: O(n * target)\n\n\n4. Dynamic Programming (Space Optimized)\n\nThis is the same subset sum idea as before, but optimized to use 1D DP.\n\nComplexity:\nTime: O(n * target)\nSpace: O(target)\n\n\n5. Dynamic Programming (Hash Set)\n\nThis approach also solves Partition Equal Subset Sum, but instead of arrays, it uses a Hash Set to track all achievable sums.\n\nComplexity:\nTime: O(n * target)\nSpace: O(target)\n\n\n6. Dynamic Programming (Optimal)\n\nThis is the most optimal DP solution for Partition Equal Subset Sum.\n\nComplexity:\nTime: O(n * target)\nSpace: O(target)\n\n\n7. Dynamic Programming (Bitset)\n\nInitialize with nums = [1, 5, 11, 5] and calculate total sum = 22\n\nComplexity:\nTime: O(n * target)\nSpace: O(target)\n\n\nCommon Pitfalls\n\n• Forgetting the Odd Sum Check\nThe most common mistake is forgetting to check if the total sum is odd before proceeding. If sum(nums) is odd, it's impossible to split into two equal subsets, and you should immediately return false. Skipping this check leads to incorrect results or wasted computation. \n\n• Using Left-to-Right Iteration in Space-Optimized DP\nWhen using a 1D DP array, iterating from left to right causes elements to be counted multiple times in the same iteration. You must iterate from right to left (target down to num) to ensure each element is used at most once per subset, preserving the 0/1 knapsack property. \n\n• Integer Overflow in Target Calculation\nFor languages without arbitrary precision integers, the sum of array elements can overflow if not handled carefully. Always use appropriate data types (like long in Java/C++) when computing the total sum before dividing by 2 to get the target. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "unique-paths",
        "title": "Unique Paths",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "There is an m x n grid where you are allowed to move either down or to the right at any point in time. Given the two integers m and n, return the number of possible unique paths that can be taken from the top-left corner of the grid (grid[0][0]) to the bottom-right corner (grid[m - 1][n - 1]). You may assume the output will fit in a 32-bit integer.",
        "constraints": [],
        "examples": [
            {
                "input": "m = 3, n = 6",
                "output": "21",
                "explanation": ""
            },
            {
                "input": "m = 3, n = 3",
                "output": "6",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n6",
                "expectedOutput": "21"
            },
            {
                "input": "3\n3",
                "expectedOutput": "6"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void uniquePaths() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nThis is the pure recursive (brute force) way to think about the problem.\n\nComplexity:\nTime: O(2m+n)\nSpace: O(m+n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThis is the optimized version of recursion using memoization.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nInstead of starting from the top and recursing, we build the answer from the destination backward.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nEach cell only depends on:\n\nComplexity:\nTime: O(m * n)\nSpace: O(n)\n\n\n5. Dynamic Programming (Optimal)\n\nFrom any cell, you can reach the destination by moving:\n\nComplexity:\nTime: O(m * n)\nSpace: O(n)\n\n\n6. Math\n\nTo go from the top-left to the bottom-right of an m x n grid, you can only move right or down.\n\nComplexity:\nTime: O(min(m,n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Confusing Rows and Columns with Moves\nMisunderstanding that an m x n grid requires m - 1 down moves and n - 1 right moves (not m and n). The total moves is (m - 1) + (n - 1) = m + n - 2. \n\n• Wrong Base Case in Recursion\nReturning 1 when reaching any boundary instead of only the destination cell. The base case should trigger only at (m-1, n-1), not when hitting the last row or column. \n\n• Integer Overflow in Math Solution\nWhen computing combinations for larger grids, intermediate multiplication can overflow. Use long types and divide as you multiply to keep values manageable. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "longest-common-subsequence",
        "title": "Longest Common Subsequence",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "Given two strings text1 and text2, return the length of the longest common subsequence between the two strings if one exists, otherwise return 0. A subsequence is a sequence that can be derived from the given sequence by deleting some or no elements  without changing the relative order of the remaining characters. A common subsequence of two strings is a subsequence that exists in both strings.",
        "constraints": [],
        "examples": [
            {
                "input": "text1 = \"cat\", text2 = \"crabt\"",
                "output": "3",
                "explanation": ""
            },
            {
                "input": "text1 = \"abcd\", text2 = \"abcd\"",
                "output": "4",
                "explanation": ""
            },
            {
                "input": "text1 = \"abcd\", text2 = \"efgh\"",
                "output": "0",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "cat\ncrabt",
                "expectedOutput": "3"
            },
            {
                "input": "abcd\nabcd",
                "expectedOutput": "4"
            },
            {
                "input": "abcd\nefgh",
                "expectedOutput": "0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void longestCommonSubsequence() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nA subsequence is a sequence derived by deleting some or no characters without changing the order of the remaining elements. To find the longest common subsequence (LCS) of two strings, we compare characters one by one. If the current characters match, they contribute to the LCS, and we move both pointers forward. If they don't match, we try skipping a character from either string and take the best result. This naturally leads to a recursive approach that explores all possibilities.\n\nComplexity:\nTime: O(2m+n)\nSpace: O(m+n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThe recursive solution recalculates the same subproblems many times. For example, dfs(2, 3) might be called from multiple branches. By storing results in a memo table, we avoid redundant work. This transforms the exponential solution into a polynomial one.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nInstead of starting from the beginning and recursing forward, we can fill a 2D table iteratively from the end. The value dp[i][j] represents the LCS length for substrings text1[i:] and text2[j:]. By processing indices in reverse order, we ensure that when we compute dp[i][j], the values we depend on (dp[i+1][j+1], dp[i+1][j], dp[i][j+1]) are already computed.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nLooking at the bottom-up recurrence, each cell dp[i][j] only depends on the current row and the next row. We don't need the entire 2D table; two 1D arrays suffice. We keep a prev array for the next row and a curr array for the current row, swapping them after each row is processed.\n\nComplexity:\nTime: O(m * n)\nSpace: O(min(m,n)\n\n\n5. Dynamic Programming (Optimal)\n\nWe can reduce space further by using a single array and a temporary variable. When iterating right to left within a row, we need the old value at position j (which becomes dp[i+1][j] in 2D terms) before overwriting it. We store this in a variable prev before the update, then use it for the diagonal reference in the next iteration.\n\nComplexity:\nTime: O(m * n)\nSpace: O(min(m,n)\n\n\nCommon Pitfalls\n\n• Confusing Subsequence with Substring\nA subsequence does not require consecutive characters, whereas a substring does. A common mistake is to reset the count when characters do not match, which would find the longest common substring instead of subsequence. In LCS, when characters do not match, you take the maximum of skipping either character. \n\n• Off-by-One Errors in DP Table Indexing\nWhen using a 2D DP table, the dimensions should be (m+1) x (n+1) to account for the base case of empty strings. Accessing dp[i+1][j+1] when characters match requires careful attention to avoid index out of bounds errors. \n\n• Incorrect Iteration Direction in Bottom-Up DP\nIn the bottom-up approach, iterating in the wrong direction can cause the algorithm to use uncomputed values. When processing from the end of the strings backward, ensure that dp[i][j] is computed after dp[i+1][j+1], dp[i+1][j], and dp[i][j+1] are already available. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "best-time-to-buy-and-sell-stock-with-cooldown",
        "title": "Best Time To Buy And Sell Stock With Cooldown",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "You are given an integer array prices where prices[i] is the price of NeetCoin on the ith day. You may buy and sell one NeetCoin multiple times with the following restrictions: You may complete as many transactions as you like. Return the maximum profit you can achieve.",
        "constraints": [],
        "examples": [
            {
                "input": "prices = [1,3,4,0,4]",
                "output": "6",
                "explanation": ""
            },
            {
                "input": "prices = [1]",
                "output": "0",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "5\n1 3 4 0 4",
                "expectedOutput": "6"
            },
            {
                "input": "1\n1",
                "expectedOutput": "0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void bestTimeToBuyAndSellStockWithCooldown() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nThis problem is about deciding the best days to buy and sell a stock to maximize profit, with one important rule: after selling a stock, you must wait one day before buying again (cooldown).\n\nComplexity:\nTime: O(2n)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThis problem asks for the maximum profit from buying and selling stocks, with the restriction that after selling a stock, you must wait one day before buying again (cooldown).\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nThis problem is about maximizing stock trading profit with a cooldown rule:after selling a stock, you must wait one full day before buying again.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nThis problem follows the same idea as the previous dynamic programming solutions:we want to maximize profit while respecting the cooldown rule (after selling, we must wait one day before buying again).\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Forgetting the Cooldown Day After Selling\nAfter selling, you must skip one day before buying again. A common mistake is transitioning directly to the buying state on the next day instead of skipping to i + 2. \n\n• Confusing the Buying and Selling States\nMixing up which state allows buying versus selling leads to subtracting when you should add (or vice versa). When buying=True, you subtract the price; when buying=False, you add it. \n\n• Off-by-One Errors in Bottom-Up DP Bounds\nWhen iterating backward and accessing dp[i + 2], forgetting to check bounds causes index out of range errors. The DP table needs size n + 2 or proper boundary checks. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "interleaving-string",
        "title": "Interleaving String",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "You are given three strings s1, s2, and s3. Return true if s3 is formed by interleaving s1 and s2 together or false otherwise. Interleaving two strings s and t is done by dividing s and t into n and m substrings respectively, where the following conditions are met You may assume that s1, s2 and s3 consist of lowercase English letters.",
        "constraints": [],
        "examples": [
            {
                "input": "s1 = \"aaaa\", s2 = \"bbbb\", s3 = \"aabbbbaa\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s1 = \"\", s2 = \"\", s3 = \"\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s1 = \"abc\", s2 = \"xyz\", s3 = \"abxzcy\"",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "aaaa\nbbbb\naabbbbaa",
                "expectedOutput": "true"
            },
            {
                "input": "",
                "expectedOutput": "true"
            },
            {
                "input": "abc\nxyz\nabxzcy",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void interleavingString() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nThis problem asks whether the string s3 can be formed by interleaving characters from s1 and s2, while keeping the relative order of characters from each string.\n\nComplexity:\nTime: O(2m+n)\nSpace: O(m+n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThis problem asks whether the string s3 can be formed by interleaving characters from s1 and s2 while preserving the relative order of characters in both strings.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nWe need to check whether the string s3 can be formed by interleaving s1 and s2, while keeping the relative order of characters from both strings.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nWe want to know if s3 can be built by interleaving s1 and s2 while keeping the order of characters from each string.\n\nComplexity:\nTime: O(m * n)\nSpace: O(min(m,n)\n\n\n5. Dynamic Programming (Optimal)\n\nWe want to check if s3 can be formed by interleaving s1 and s2 while keeping the order of characters from both strings.\n\nComplexity:\nTime: O(m * n)\nSpace: O(min(m,n)\n\n\nCommon Pitfalls\n\n• Skipping the Length Check\nA quick optimization that many solutions miss is checking if len(s1) + len(s2) == len(s3) upfront. If the lengths do not match, interleaving is impossible regardless of the characters. Skipping this check leads to unnecessary computation and can cause index out-of-bounds errors in some implementations. \n\n• Confusing Position Tracking with Three Indices\nSince k = i + j always holds (where k is position in s3, i in s1, j in s2), you only need to track two indices. Some implementations incorrectly track all three independently, leading to inconsistent states or missed memoization opportunities. The key insight is that knowing positions in s1 and s2 uniquely determines the position in s3. \n\n• Greedy Character Matching\nWhen both s1[i] and s2[j] match s3[k], you cannot greedily choose one over the other. Both branches must be explored. A common bug is to always prefer taking from s1 (or s2) when both match, which fails for cases like s1 = \"a\", s2 = \"a\", s3 = \"aa\" where either order works but a greedy approach might get stuck. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "edit-distance",
        "title": "Edit Distance",
        "difficulty": "Medium",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "You are given two strings word1 and word2, each consisting of lowercase English letters. You are allowed to perform three operations on word1 an unlimited number of times: Return the minimum number of operations to make word1 equal word2.",
        "constraints": [],
        "examples": [
            {
                "input": "word1 = \"monkeys\", word2 = \"money\"",
                "output": "2",
                "explanation": ""
            },
            {
                "input": "word1 = \"neatcdee\", word2 = \"neetcode\"",
                "output": "3",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "monkeys\nmoney",
                "expectedOutput": "2"
            },
            {
                "input": "neatcdee\nneetcode",
                "expectedOutput": "3"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void editDistance() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nThis problem asks for the minimum number of operations required to convert word1 into word2.The allowed operations are:\n\nComplexity:\nTime: O(3m+n)\nSpace: O(m+n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThis problem asks for the minimum number of edit operations required to convert word1 into word2.The allowed operations are:\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nWe want the minimum number of edits needed to convert word1 into word2, where an edit can be:\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nWe want the minimum number of edits (insert, delete, replace) to convert word1 into word2.\n\nComplexity:\nTime: O(m * n)\nSpace: O(min(m,n)\n\n\n5. Dynamic Programming (Optimal)\n\nWe want the minimum number of edits (insert, delete, replace) needed to convert word1 into word2.\n\nComplexity:\nTime: O(m * n)\nSpace: O(min(m,n)\n\n\nCommon Pitfalls\n\n• Confusing Insert and Delete Operations\nWhen converting word1 to word2, an insert into word1 is equivalent to advancing j (moving forward in word2), while a delete from word1 advances i. Mixing these up leads to incorrect recurrence relations. Remember: insert adds a character to match word2[j], delete removes word1[i]. \n\n• Incorrect Base Case Initialization\nThe base cases require returning the number of remaining characters when one string is exhausted. A common mistake is returning 0 or forgetting to handle when i == m (return n - j) or j == n (return m - i). These represent the insertions or deletions needed to complete the transformation. \n\n• Forgetting to Add 1 for the Current Operation\nWhen characters don't match, you must add 1 to the minimum of the three recursive calls to account for the current operation. Forgetting this addition results in an answer that's always too small, as it doesn't count the edit being performed at the current position. \n\n• Off-by-One Errors in DP Table Dimensions\nThe DP table needs dimensions (m + 1) x (n + 1) to accommodate the base cases where either string is empty. Using m x n causes index out of bounds errors when accessing dp[m][j] or dp[i][n] for the boundary conditions. \n\n• Not Handling Equal Characters Correctly\nWhen word1[i] == word2[j], no operation is needed and you should directly use dp[i+1][j+1] without adding 1. A common mistake is still adding 1 or considering all three operations when characters match, leading to an inflated edit distance. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "regular-expression-matching",
        "title": "Regular Expression Matching",
        "difficulty": "Hard",
        "category": "DP",
        "tags": [
            "dp"
        ],
        "description": "You are given an input string s consisting of lowercase english letters, and a pattern p consisting of lowercase english letters, as well as '.', and '*' characters. Return true if the pattern matches the entire input string, otherwise return false.",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"aa\", p = \".b\"",
                "output": "false",
                "explanation": ""
            },
            {
                "input": "s = \"nnn\", p = \"n*\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"xyz\", p = \".*z\"",
                "output": "true",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "aa\n.b",
                "expectedOutput": "false"
            },
            {
                "input": "nnn\nn*",
                "expectedOutput": "true"
            },
            {
                "input": "xyz\n.*z",
                "expectedOutput": "true"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void regularExpressionMatching() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nWe need to check if the string s matches the pattern p, where:\n\nComplexity:\nTime: O(2m+n)\nSpace: O(m+n)\n\n\n2. Dynamic Programming (Top-Down)\n\nWe need to check if s matches pattern p, where:\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nWe want to check whether the string s matches the pattern p, where:\n\nComplexity:\nTime: O(m * n)\nSpace: O(m * n)\n\n\n4. Dynamic Programming (Space Optimized)\n\nWe need to determine if string s matches pattern p, where:\n\nComplexity:\nTime: O(m * n)\nSpace: O(n)\n\n\n5. Dynamic Programming (Optimal)\n\nWe want to check if s matches p, where:\n\nComplexity:\nTime: O(m * n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Misunderstanding How Star Works\nThe * character means \"zero or more of the preceding element,\" not \"zero or more of any character.\" A common mistake is treating a* as matching any sequence of characters. In reality, a* only matches zero or more 'a' characters. Similarly, .* matches zero or more of any single character (because . matches any character). \n\n• Forgetting That Star Can Match Zero Occurrences\nWhen encountering x* in the pattern, many solutions only consider the case where x matches at least one character. However, x* can also match zero characters, meaning the entire x* portion can be skipped. Both branches must be explored: skip x* entirely or consume a matching character while staying on the same pattern position. \n\n• Off-by-One Errors When Checking for Star\nThe pattern must be checked carefully to see if the next character is *. A common bug is checking p[j] instead of p[j+1] for the star, or failing to verify that j+1 is within bounds before accessing it. This leads to index out of bounds errors or incorrect pattern matching logic. \n\n• Not Handling Empty String or Pattern Edge Cases\nThe base cases require careful handling. When the pattern is exhausted (j == n), the match is valid only if the string is also exhausted (i == m). However, when the string is exhausted but the pattern is not, matching can still succeed if the remaining pattern consists entirely of x* pairs. Failing to account for patterns like a*b*c* matching an empty string is a common oversight. \n\n• Incorrect DP State Transitions\nIn the bottom-up DP approach, the iteration order matters. Processing from the end of both strings toward the beginning ensures that required subproblem solutions are available. A common mistake is iterating in the wrong direction or incorrectly referencing dp[i+1][j+1] when it has not been computed yet. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "jump-game",
        "title": "Jump Game",
        "difficulty": "Medium",
        "category": "Greedy",
        "tags": [
            "greedy"
        ],
        "description": "You are given an integer array nums where each element nums[i] indicates your maximum jump length at that position. Return true if you can reach the last index starting from index 0, or false otherwise.",
        "constraints": [],
        "examples": [
            {
                "input": "nums = [1,2,0,1,0]",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "nums = [1,2,1,0,1]",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "5\n1 2 0 1 0",
                "expectedOutput": "true"
            },
            {
                "input": "5\n1 2 1 0 1",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void jumpGame() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nThis problem asks whether we can reach the last index of the array starting from the first index.\n\nComplexity:\nTime: O(n!)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down)\n\nThis problem asks whether we can reach the last index of the array starting from index 0.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nWe want to know if we can reach the last index starting from index 0.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n4. Greedy\n\nWe want to check if we can reach the last index starting from index 0.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Confusing Jump Value with Index\nThe value nums[i] represents the maximum jump length, not the destination index. From position i, you can reach any index in [i + 1, i + nums[i]], not just i + nums[i]. Treating the jump value as a fixed destination misses valid shorter jumps. \n\n• Not Handling Zero Values Correctly\nA zero at position i means you cannot move forward from that position. If all paths lead to a position with nums[i] == 0 before reaching the end, the answer is false. Ensure your algorithm properly detects when you are stuck. \n\n• Iterating in the Wrong Direction for Greedy\nThe greedy approach works backward, updating the goal position. A common mistake is iterating forward and incorrectly maintaining state. When going backward, the condition i + nums[i] >= goal correctly checks reachability. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "gas-station",
        "title": "Gas Station",
        "difficulty": "Medium",
        "category": "Greedy",
        "tags": [
            "greedy"
        ],
        "description": "There are n gas stations along a circular route. You are given two integer arrays gas and cost where: You have a car that can store an unlimited amount of gas, but you begin the journey with an empty tank at one of the gas stations. Return the starting gas station's index such that you can travel around the circuit once in the clockwise direction. If it's impossible, then return -1. It's guaranteed that at most one solution exists.",
        "constraints": [],
        "examples": [
            {
                "input": "gas = [1,2,3,4], cost = [2,2,4,1]",
                "output": "3",
                "explanation": ""
            },
            {
                "input": "gas = [1,2,3], cost = [2,3,2]",
                "output": "-1",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1 2 3 4\n4\n2 2 4 1",
                "expectedOutput": "3"
            },
            {
                "input": "3\n1 2 3\n3\n2 3 2",
                "expectedOutput": "-1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void gasStation() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe need to find a starting gas station index such that we can travel around the entire circle exactly once without the gas tank ever going negative.\n\nComplexity:\nTime: O(n2)\nSpace: O(1)\n\n\n2. Two Pointers\n\nWe need to find a gas station index from which we can complete the full circular route without the gas tank ever becoming negative.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\n3. Greedy\n\nWe want to find a gas station index from which we can complete the entire circular route without the gas tank ever going negative.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Forgetting to Check Total Gas vs Total Cost First\nThe greedy solution assumes a valid starting point exists if total gas is sufficient. However, skipping this global check can cause returning an invalid index when no solution exists. Always verify sum(gas) >= sum(cost) before applying the greedy logic, or the algorithm may return a false positive starting index. \n\n• Resetting to an Invalid Starting Index\nWhen the running tank goes negative at index i, the new candidate start should be i + 1. A common mistake is setting it to i, which is guaranteed to fail since we just proved the journey fails at that point. Additionally, when i + 1 equals n, there's no valid start, but this is handled by the total gas check. \n\n• Not Understanding Why Failed Stations Can Be Skipped\nThe greedy approach skips all stations between the previous start and the failing point. This works because if we cannot reach station j starting from station i, we also cannot reach j starting from any station between i and j. Those intermediate stations have strictly less accumulated gas when reaching j. Understanding this principle is key to trusting the linear-time solution. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "hand-of-straights",
        "title": "Hand Of Straights",
        "difficulty": "Medium",
        "category": "Greedy",
        "tags": [
            "greedy"
        ],
        "description": "You are given an integer array hand where hand[i] is the value written on the ith card and an integer groupSize. You want to rearrange the cards into groups so that each group is of size groupSize, and card values are consecutively increasing by 1. Return true if it's possible to rearrange the cards in this way, otherwise, return false.",
        "constraints": [],
        "examples": [
            {
                "input": "hand = [1,2,4,2,3,5,3,4], groupSize = 4",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "hand = [1,2,3,3,4,5,6,7], groupSize = 4",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "8\n1 2 4 2 3 5 3 4\n4",
                "expectedOutput": "true"
            },
            {
                "input": "8\n1 2 3 3 4 5 6 7\n4",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void handOfStraights() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Sorting\n\nWe are given a hand of cards and a group size. The goal is to check whether we can divide all cards into groups of size groupSize such that:\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n2. Heap\n\nWe need to split the cards into groups of size groupSize, where each group is made of consecutive numbers, and every card is used exactly once.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n3. Ordered Map\n\nWe want to check if the cards can be divided into groups of size groupSize, where each group consists of consecutive numbers and every card is used exactly once.\n\nComplexity:\nTime: O(nlog n)\nSpace: O(n)\n\n\n4. Hash Map\n\nWe need to split the hand into groups of size groupSize, where each group is made of consecutive numbers and every card is used exactly once.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\nCommon Pitfalls\n\n• Forgetting to Check Divisibility First\nIf the total number of cards is not divisible by groupSize, it is impossible to form complete groups. Skipping this initial check wastes time processing the array and may lead to subtle bugs where the algorithm appears to succeed but produces an invalid grouping. \n\n• Not Starting Groups from the Smallest Available Card\nGroups must be formed starting from the smallest available card value to ensure consecutive sequences work correctly. Starting from an arbitrary card can leave smaller cards stranded without enough consecutive neighbors to form a valid group. Always process cards in sorted order or use a min-heap to find the smallest available value. \n\n• Failing to Decrement Counts Properly\nWhen forming a group, each card in the consecutive sequence must have its count decremented. A common bug is forgetting to decrement or decrementing the wrong key, which causes cards to be reused or leaves cards unused. Additionally, when a card's count reaches zero, it must be handled correctly to avoid checking for cards that no longer exist. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "valid-parenthesis-string",
        "title": "Valid Parenthesis String",
        "difficulty": "Medium",
        "category": "Greedy",
        "tags": [
            "greedy"
        ],
        "description": "You are given a string s which contains only three types of characters: '(', ')' and '*'. Return true if s is valid, otherwise return false. A string is valid if it follows all of the following rules:",
        "constraints": [],
        "examples": [
            {
                "input": "s = \"((**)\"",
                "output": "true",
                "explanation": ""
            },
            {
                "input": "s = \"(((*)\"",
                "output": "false",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "((**)",
                "expectedOutput": "true"
            },
            {
                "input": "(((*)",
                "expectedOutput": "false"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void validParenthesisString() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nThis problem asks whether a string containing '(', ')', and '*' can be interpreted as a valid parentheses string.\n\nComplexity:\nTime: O(3n)\nSpace: O(n)\n\n\n2. Dynamic Programming (Top-Down)\n\nWe need to decide if a string containing '(', ')', and '*' can be turned into a valid parentheses string.\n\nComplexity:\nTime: O(n2)\nSpace: O(n2)\n\n\n3. Dynamic Programming (Bottom-Up)\n\nWe need to check if a string containing '(', ')', and '*' can be interpreted as a valid parentheses string.\n\nComplexity:\nTime: O(n2)\nSpace: O(n2)\n\n\n4. Dynamic Programming (Space Optimized)\n\nWe need to check if a string containing '(', ')', and '*' can be interpreted as a valid parentheses string.\n\nComplexity:\nTime: O(n2)\nSpace: O(n)\n\n\n5. Stack\n\nWe want to check whether a string containing '(', ')', and '*' can be interpreted as a valid parentheses string.\n\nComplexity:\nTime: O(n)\nSpace: O(n)\n\n\n6. Greedy\n\nWe want to check whether a string containing '(', ')', and '*' can be interpreted as a valid parentheses string.\n\nComplexity:\nTime: O(n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Forgetting That Wildcards Have Three Options\nA common mistake is treating '*' as only representing '(' or ')'. Remember that '*' can also represent an empty string. This third option is crucial for cases like \"(*)\" where the '*' should be treated as empty to form a valid string. \n\n• Not Checking for Negative Open Count\nWhen processing ')' or treating '*' as ')', you must ensure the open parenthesis count never goes negative. A negative count means there are more closing parentheses than opening ones at that point, which is invalid regardless of what comes later. Always check open >= 0 before proceeding. \n\n• Ignoring the Position of Wildcards in Stack Approach\nIn the stack-based solution, simply counting unmatched '(' and '*' is not enough. You must also verify that each remaining '(' has a '*' that appears after it (at a higher index). A '*' appearing before a '(' cannot act as a matching ')' for it. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "minimum-interval-to-include-each-query",
        "title": "Minimum Interval To Include Each Query",
        "difficulty": "Hard",
        "category": "Heap",
        "tags": [
            "heap",
            "sliding-window"
        ],
        "description": "You are given a 2D integer array intervals, where intervals[i] = [left_i, right_i] represents the ith interval starting at left_i and ending at right_i (inclusive). You are also given an integer array of query points queries. The result of query[j] is the length of the shortest interval i such that left_i <= queries[j] <= right_i. If no such interval exists, the result of this query is -1. Return an array output where output[j] is the result of query[j]. Note: The length of an interval is calculated as right_i - left_i + 1.",
        "constraints": [],
        "examples": [
            {
                "input": "intervals = [[1,3],[2,3],[3,7],[6,6]], queries = [2,3,1,7,6,8]",
                "output": "[2,2,3,5,1,-1]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "4\n1,3 2,3 3,7 6,6\n6\n2 3 1 7 6 8",
                "expectedOutput": "2 2 3 5 1 -1"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void minimumIntervalToIncludeEachQuery() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nFor each query value q, we want to find the smallest interval length among all intervals [l, r] that contain q (meaning l <= q <= r).If no interval contains q, we return -1.\n\nComplexity:\nTime: O(m * n)\nSpace: O(1)\n\n\n2. Sweep Line Algorithm\n\nFor each query value q, we want the length of the smallest interval [l, r] that contains q (l <= q <= r). If none exists, the answer is -1.\n\nComplexity:\nTime: O((n+m)\nSpace: O(n+m)\n\n\n3. Min Heap\n\nFor each query q, we want the length of the smallest interval [l, r] such thatl ≤ q ≤ r. If no interval covers q, the answer is -1.\n\nComplexity:\nTime: O(nlog n+mlog m)\nSpace: O(n+m)\n\n\n4. Min Segment Tree (Lazy Propagation)\n\nFor each query q, we need the length of the smallest interval [l, r] such that l <= q <= r.If no interval covers q, the answer is -1.\n\nComplexity:\nTime: O((n+m)\nSpace: O(k)\n\n\nCommon Pitfalls\n\n• Losing Original Query Order After Sorting\nWhen sorting queries for efficient processing, the original indices must be preserved. Returning results in sorted query order instead of the original order produces incorrect output. Always pair each query with its original index before sorting. \n\n• Forgetting to Remove Expired Intervals from the Heap\nIntervals that have ended (their right endpoint is less than the current query) must be removed from the heap before answering. Failing to pop expired intervals means the heap may return an interval that does not actually contain the query point. \n\n• Incorrect Event Ordering in Sweep Line Approach\nWhen multiple events occur at the same coordinate, processing order matters. Interval end events should typically be processed before query events at the same point to ensure intervals ending exactly at the query point are still considered active. \n\n• Using Wrong Interval Length Calculation\nThe length of interval [l, r] is r - l + 1, not r - l. This off-by-one error affects which interval is considered smallest and leads to incorrect results when intervals differ by exactly one unit. \n\n• Not Handling Queries Outside All Intervals\nWhen no interval covers a query, the answer must be -1. Forgetting to initialize the result array with -1 or not checking for an empty heap after removing expired intervals causes undefined or incorrect values to be returned. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "spiral-matrix",
        "title": "Spiral Matrix",
        "difficulty": "Medium",
        "category": "Array",
        "tags": [
            "array",
            "matrix"
        ],
        "description": "Given an m x n matrix of integers matrix, return a list of all elements within the matrix in spiral order.",
        "constraints": [],
        "examples": [
            {
                "input": "matrix = [[1,2],[3,4]]",
                "output": "[1,2,4,3]",
                "explanation": ""
            },
            {
                "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
                "output": "[1,2,3,6,9,8,7,4,5]",
                "explanation": ""
            },
            {
                "input": "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
                "output": "[1,2,3,4,8,12,11,10,9,5,6,7]",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "2\n1,2 3,4",
                "expectedOutput": "1 2 4 3"
            },
            {
                "input": "3\n1,2,3 4,5,6 7,8,9",
                "expectedOutput": "1 2 3 6 9 8 7 4 5"
            },
            {
                "input": "3\n1,2,3,4 5,6,7,8 9,10,11,12",
                "expectedOutput": "1 2 3 4 8 12 11 10 9 5 6 7"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void spiralMatrix() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Recursion\n\nWe want to print the matrix in spiral order (right → down → left → up, repeating).\n\nComplexity:\nTime: O(m * n)\nSpace: O(min(m,n)\n\n\n2. Iteration\n\nWe want to traverse a matrix in spiral order:right → down → left → up, repeatedly, moving inward layer by layer.\n\nComplexity:\nTime: O(m * n)\nSpace: O(1)\n\n\n3. Iteration (Optimal)\n\nWe want to read the matrix in spiral order: right → down → left → up, repeating.\n\nComplexity:\nTime: O(m * n)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Not Checking Boundaries After Each Direction\nAfter completing a horizontal traversal, the vertical bounds may have crossed (or vice versa). Failing to check left < right && top < bottom before the third and fourth directions causes duplicate elements to be added when the matrix reduces to a single row or column. \n\n• Mishandling Non-Square Matrices\nRectangular matrices with significantly different row and column counts can cause issues if the algorithm assumes square behavior. The spiral may terminate early or add extra elements if boundary checks do not account for both dimensions independently. \n\n• Incorrect Direction Rotation\nWhen using direction vectors, rotating incorrectly (e.g., counterclockwise instead of clockwise, or incorrect sign changes) produces a non-spiral traversal pattern. The correct clockwise rotation transforms (dr, dc) to (dc, -dr). ",
        "acceptanceRate": 0.5
    },
    {
        "id": "multiply-strings",
        "title": "Multiply Strings",
        "difficulty": "Medium",
        "category": "String",
        "tags": [
            "string",
            "math"
        ],
        "description": "You are given two strings num1 and num2 that represent non-negative integers. Return the product of num1 and num2 in the form of a string. Assume that neither num1 nor num2 contain any leading zero, unless they are the number 0 itself. Note: You can not use any built-in library to convert the inputs directly into integers.",
        "constraints": [],
        "examples": [
            {
                "input": "num1 = \"3\", num2 = \"4\"",
                "output": "\"12\"",
                "explanation": ""
            },
            {
                "input": "num1 = \"111\", num2 = \"222\"",
                "output": "\"24642\"",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "3\n4",
                "expectedOutput": "\"12\""
            },
            {
                "input": "111\n222",
                "expectedOutput": "\"24642\""
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void multiplyStrings() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Multiplication & Addition\n\nThis approach mimics how we multiply numbers by hand. We multiply the larger number by each digit of the smaller number (starting from the rightmost digit), shifting the result appropriately by appending zeros. Then we add all these partial products together. This simulates the grade-school multiplication algorithm but operates entirely on strings to handle arbitrarily large numbers.\n\nComplexity:\nTime: O(min(m,n)\nSpace: O(m+n)\n\n\n2. Multiplication\n\nInstead of generating partial products and adding them as separate strings, we can use a single result array to accumulate all digit multiplications in place. When we multiply digit i of num1 by digit j of num2, the result contributes to position i + j in the final answer. By reversing both strings first, we can work with indices that naturally align with place values. After processing all digit pairs, we handle carries and convert the result array back to a string.\n\nComplexity:\nTime: O(m * n)\nSpace: O(m+n)\n\n\nCommon Pitfalls\n\n• Not Handling the Zero Case\nWhen either input is \"0\", the result must be \"0\". Failing to check this upfront can lead to returning an empty string or a string with leading zeros. Always check for zero inputs before proceeding with multiplication to avoid unnecessary computation and incorrect output formatting. \n\n• Incorrect Position Indexing for Digit Products\nWhen multiplying digit i of num1 by digit j of num2, the result contributes to a specific position in the output array. If strings are reversed, the position is i + j; if not, careful index calculation is needed. Off-by-one errors in position calculation cause digits to be placed incorrectly, resulting in a wrong final product. \n\n• Forgetting to Handle Leading Zeros in the Result\nAfter populating the result array, there may be leading zeros (especially at the highest index positions after reversing). Skipping these zeros before converting to a string is essential. However, if all digits are zero (which should not happen if the zero case is handled), ensure at least one \"0\" is returned rather than an empty string. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "reverse-bits",
        "title": "Reverse Bits",
        "difficulty": "Easy",
        "category": "Bit Manipulation",
        "tags": [
            "bit-manipulation"
        ],
        "description": "Given a 32-bit unsigned integer n, reverse the bits of the binary representation of n and return the result.",
        "constraints": [],
        "examples": [
            {
                "input": "n = 00000000000000000000000000010101",
                "output": "2818572288 (10101000000000000000000000000000)",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "00000000000000000000000000010101",
                "expectedOutput": "2818572288 (10101000000000000000000000000000)"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void reverseBits() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe are given a 32-bit unsigned integer, and we need to reverse its bits.\n\nComplexity:\nTime: O(1)\nSpace: O(1)\n\n\n2. Bit Manipulation\n\nWe are given a 32-bit unsigned integer and need to reverse all its bits.\n\nComplexity:\nTime: O(1)\nSpace: O(1)\n\n\n3. Bit Manipulation (Optimal)\n\nWe are given a 32-bit unsigned integer and need to reverse its bits.\n\nComplexity:\nTime: O(1)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Using Signed Right Shift Instead of Unsigned\nIn languages like Java and JavaScript, using >> (signed right shift) instead of >>> (unsigned right shift) can cause incorrect results. The signed shift preserves the sign bit, which leads to unexpected behavior when the most significant bit is set. Always use unsigned right shift for bit reversal operations. \n\n• Hardcoding the Wrong Bit Width\nThe problem specifies a 32-bit unsigned integer, so all operations must process exactly 32 bits. A common mistake is iterating fewer than 32 times or not accounting for leading zeros. Every bit position matters in reversal, so the loop must always run for all 32 bits regardless of the input value. ",
        "acceptanceRate": 0.5
    },
    {
        "id": "reverse-integer",
        "title": "Reverse Integer",
        "difficulty": "Medium",
        "category": "Math",
        "tags": [
            "math"
        ],
        "description": "You are given a signed 32-bit integer x. Return x after reversing each of its digits. After reversing, if x goes outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0 instead. Solve the problem without using integers that are outside the signed 32-bit integer range.",
        "constraints": [],
        "examples": [
            {
                "input": "x = 1234",
                "output": "4321",
                "explanation": ""
            },
            {
                "input": "x = -1234",
                "output": "-4321",
                "explanation": ""
            },
            {
                "input": "x = 1234236467",
                "output": "0",
                "explanation": ""
            }
        ],
        "testCases": [
            {
                "input": "1234",
                "expectedOutput": "4321"
            },
            {
                "input": "-1234",
                "expectedOutput": "-4321"
            },
            {
                "input": "1234236467",
                "expectedOutput": "0"
            }
        ],
        "judge0Limits": {
            "cpu_time_limit": 2,
            "wall_time_limit": 5,
            "memory_limit": 256000,
            "stack_limit": 64000
        },
        "languageId": 54,
        "starterCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    // TODO: Update return type and parameters based on problem\n    void reverseInteger() {\n        // Write your code here\n    }\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    Solution sol;\n    // TODO: Implement input parsing\n    \n    return 0;\n}",
        "editorial": "Approach\n\n1. Brute Force\n\nWe want to reverse the digits of an integer x (for example, 123 -> 321, -120 -> -21).\n\nComplexity:\nTime: O(1)\nSpace: O(1)\n\n\n2. Recursion\n\nWe want to reverse the digits of an integer while preserving its sign and ensuring the result fits within the 32-bit signed integer range.\n\nComplexity:\nTime: O(1)\nSpace: O(1)\n\n\n3. Iteration\n\nWe want to reverse the digits of an integer without using strings, while also ensuring the result fits within the 32-bit signed integer range.\n\nComplexity:\nTime: O(1)\nSpace: O(1)\n\n\nCommon Pitfalls\n\n• Checking for Overflow After It Happens\nA critical mistake is multiplying res by 10 and adding the digit before checking if the result overflows. By that point, overflow has already occurred and the value is corrupted. The overflow check must happen before the multiplication to determine if the next operation would exceed the 32-bit signed integer bounds. \n\n• Incorrect Handling of Negative Numbers with Modulo\nDifferent programming languages handle the modulo operation differently for negative numbers. In Python, -123 % 10 returns 7, not -3. Using the wrong modulo behavior leads to incorrect digit extraction for negative inputs. Use language-specific functions like math.fmod() in Python or ensure consistent handling across languages. \n\n• Forgetting the Asymmetric Range of 32-bit Signed Integers\nThe 32-bit signed integer range is asymmetric: -2^31 to 2^31 - 1. This means the minimum value has a larger absolute value than the maximum. When checking for overflow, both boundaries must be validated separately. Simply checking against one limit and assuming symmetry causes edge cases like reversing 1534236469 to fail silently. ",
        "acceptanceRate": 0.5
    }
];
