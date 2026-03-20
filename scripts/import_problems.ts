import fs from 'fs';
import path from 'path';

const problemsJsonPath = path.join(process.cwd(), 'problems.json');
const outputPath = path.join(process.cwd(), 'packages/backend/src/data/problems/all_problems.ts');

const problemsJson = JSON.parse(fs.readFileSync(problemsJsonPath, 'utf8'));

const problemMetadataMap: Record<string, { difficulty: "Easy" | "Medium" | "Hard", category: string, tags: string[] }> = {
    "Score Of A String": { difficulty: "Easy", category: "String", tags: ["string"] },
    "Concatenation Of Array": { difficulty: "Easy", category: "Array", tags: ["array"] },
    "Contains Duplicate": { difficulty: "Easy", category: "Array", tags: ["array", "hash-table"] },
    "Valid Anagram": { difficulty: "Easy", category: "String", tags: ["string", "hash-table"] },
    "Two Sum": { difficulty: "Easy", category: "Array", tags: ["array", "hash-table"] },
    "Replace Elements With Greatest Element On Right Side": { difficulty: "Easy", category: "Array", tags: ["array"] },
    "Is Subsequence": { difficulty: "Easy", category: "String", tags: ["string", "two-pointers"] },
    "Length Of Last Word": { difficulty: "Easy", category: "String", tags: ["string"] },
    "Longest Common Prefix": { difficulty: "Easy", category: "String", tags: ["string"] },
    "Group Anagrams": { difficulty: "Medium", category: "String", tags: ["string", "hash-table"] },
    "Top K Frequent Elements": { difficulty: "Medium", category: "Heap", tags: ["array", "hash-table", "heap"] },
    "Product Of Array Except Self": { difficulty: "Medium", category: "Array", tags: ["array", "prefix-sum"] },
    "Valid Sudoku": { difficulty: "Medium", category: "Array", tags: ["array", "hash-table"] },
    "Longest Consecutive Sequence": { difficulty: "Medium", category: "Array", tags: ["array", "hash-table"] },
    "Encode And Decode Strings": { difficulty: "Medium", category: "String", tags: ["string"] },
    "Check If Array Is Sorted And Rotated": { difficulty: "Easy", category: "Array", tags: ["array"] },
    "Maximum Distance In Arrays": { difficulty: "Medium", category: "Array", tags: ["array"] },
    "Valid Palindrome": { difficulty: "Easy", category: "String", tags: ["string", "two-pointers"] },
    "Two Sum Ii Input Array Is Sorted": { difficulty: "Medium", category: "Array", tags: ["array", "two-pointers"] },
    "3Sum": { difficulty: "Medium", category: "Array", tags: ["array", "two-pointers"] },
    "3Sum Closest": { difficulty: "Medium", category: "Array", tags: ["array", "two-pointers"] },
    "Trapping Rain Water": { difficulty: "Hard", category: "Array", tags: ["array", "two-pointers", "stack"] },
    "Remove Duplicates From Sorted Array": { difficulty: "Easy", category: "Array", tags: ["array", "two-pointers"] },
    "Remove Element": { difficulty: "Easy", category: "Array", tags: ["array", "two-pointers"] },
    "Move Zeroes": { difficulty: "Easy", category: "Array", tags: ["array", "two-pointers"] },
    "Reverse String": { difficulty: "Easy", category: "String", tags: ["string", "two-pointers"] },
    "Reverse String Ii": { difficulty: "Easy", category: "String", tags: ["string"] },
    "Squares Of A Sorted Array": { difficulty: "Easy", category: "Array", tags: ["array", "two-pointers"] },
    "Valid Palindrome Ii": { difficulty: "Easy", category: "String", tags: ["string", "two-pointers"] },
    "Best Time To Buy And Sell Stock": { difficulty: "Easy", category: "Array", tags: ["array", "sliding-window"] },
    "Longest Substring Without Repeating Characters": { difficulty: "Medium", category: "String", tags: ["string", "sliding-window"] },
    "Longest Repeating Character Replacement": { difficulty: "Medium", category: "String", tags: ["string", "sliding-window"] },
    "Permutation In String": { difficulty: "Medium", category: "String", tags: ["string", "sliding-window"] },
    "Minimum Window Substring": { difficulty: "Hard", category: "String", tags: ["string", "sliding-window"] },
    "Sliding Window Maximum": { difficulty: "Hard", category: "Array", tags: ["array", "sliding-window", "deque"] },
    "Valid Parentheses": { difficulty: "Easy", category: "Stack", tags: ["string", "stack"] },
    "Min Stack": { difficulty: "Medium", category: "Stack", tags: ["stack", "design"] },
    "Evaluate Reverse Polish Notation": { difficulty: "Medium", category: "Stack", tags: ["stack"] },
    "Generate Parentheses": { difficulty: "Medium", category: "Backtracking", tags: ["string", "backtracking"] },
    "Daily Temperatures": { difficulty: "Medium", category: "Stack", tags: ["array", "stack"] },
    "Car Fleet": { difficulty: "Medium", category: "Stack", tags: ["array", "stack"] },
    "Largest Rectangle In Histogram": { difficulty: "Hard", category: "Stack", tags: ["array", "stack"] },
    "Binary Search": { difficulty: "Easy", category: "Binary Search", tags: ["array", "binary-search"] },
    "Search A 2D Matrix": { difficulty: "Medium", category: "Binary Search", tags: ["matrix", "binary-search"] },
    "Koko Eating Bananas": { difficulty: "Medium", category: "Binary Search", tags: ["array", "binary-search"] },
    "Search In Rotated Sorted Array": { difficulty: "Medium", category: "Binary Search", tags: ["array", "binary-search"] },
    "Find Minimum In Rotated Sorted Array": { difficulty: "Medium", category: "Binary Search", tags: ["array", "binary-search"] },
    "Time Based Key Value Store": { difficulty: "Medium", category: "Binary Search", tags: ["hash-table", "binary-search", "design"] },
    "Median Of Two Sorted Arrays": { difficulty: "Hard", category: "Binary Search", tags: ["array", "binary-search"] },
    "Reverse Linked List": { difficulty: "Easy", category: "Linked List", tags: ["linked-list"] },
    "Merge Two Sorted Lists": { difficulty: "Easy", category: "Linked List", tags: ["linked-list"] },
    "Reorder List": { difficulty: "Medium", category: "Linked List", tags: ["linked-list"] },
    "Remove Nth Node From End Of List": { difficulty: "Medium", category: "Linked List", tags: ["linked-list"] },
    "Copy List With Random Pointer": { difficulty: "Medium", category: "Linked List", tags: ["linked-list"] },
    "Add Two Numbers": { difficulty: "Medium", category: "Linked List", tags: ["linked-list"] },
    "Linked List Cycle": { difficulty: "Easy", category: "Linked List", tags: ["linked-list"] },
    "Find The Duplicate Number": { difficulty: "Medium", category: "Linked List", tags: ["linked-list"] },
    "Lru Cache": { difficulty: "Medium", category: "Linked List", tags: ["linked-list", "design"] },
    "Merge K Sorted Lists": { difficulty: "Hard", category: "Linked List", tags: ["linked-list", "heap"] },
    "Reverse Nodes In K Group": { difficulty: "Hard", category: "Linked List", tags: ["linked-list"] },
    "Invert Binary Tree": { difficulty: "Easy", category: "Binary Tree", tags: ["binary-tree"] },
    "Maximum Depth Of Binary Tree": { difficulty: "Easy", category: "Binary Tree", tags: ["binary-tree"] },
    "Diameter Of Binary Tree": { difficulty: "Easy", category: "Binary Tree", tags: ["binary-tree"] },
    "Balanced Binary Tree": { difficulty: "Easy", category: "Binary Tree", tags: ["binary-tree"] },
    "Same Tree": { difficulty: "Easy", category: "Binary Tree", tags: ["binary-tree"] },
    "Subtree Of Another Tree": { difficulty: "Easy", category: "Binary Tree", tags: ["binary-tree"] },
    "Lowest Common Ancestor Of A Binary Search Tree": { difficulty: "Medium", category: "Binary Tree", tags: ["binary-tree"] },
    "Binary Tree Level Order Traversal": { difficulty: "Medium", category: "Binary Tree", tags: ["binary-tree"] },
    "Binary Tree Right Side View": { difficulty: "Medium", category: "Binary Tree", tags: ["binary-tree"] },
    "Count Good Nodes In Binary Tree": { difficulty: "Medium", category: "Binary Tree", tags: ["binary-tree"] },
    "Validate Binary Search Tree": { difficulty: "Medium", category: "Binary Tree", tags: ["binary-tree"] },
    "Kth Smallest Element In A BST": { difficulty: "Medium", category: "Binary Tree", tags: ["binary-tree"] },
    "Construct Binary Tree From Preorder And Inorder Traversal": { difficulty: "Medium", category: "Binary Tree", tags: ["binary-tree"] },
    "Binary Tree Maximum Path Sum": { difficulty: "Hard", category: "Binary Tree", tags: ["binary-tree"] },
    "Serialize And Deserialize Binary Tree": { difficulty: "Hard", category: "Binary Tree", tags: ["binary-tree"] },
    "Implement Trie Prefix Tree": { difficulty: "Medium", category: "Trie", tags: ["trie", "design"] },
    "Design Add And Search Words Data Structure": { difficulty: "Medium", category: "Trie", tags: ["trie", "design"] },
    "Word Search Ii": { difficulty: "Hard", category: "Trie", tags: ["trie", "backtracking"] },
    "Kth Largest Element In A Stream": { difficulty: "Easy", category: "Heap", tags: ["heap", "design"] },
    "Last Stone Weight": { difficulty: "Easy", category: "Heap", tags: ["heap"] },
    "K Closest Points To Origin": { difficulty: "Medium", category: "Heap", tags: ["heap"] },
    "Kth Largest Element In An Array": { difficulty: "Medium", category: "Heap", tags: ["heap", "quickselect"] },
    "Task Scheduler": { difficulty: "Medium", category: "Heap", tags: ["heap", "greedy"] },
    "Design Twitter": { difficulty: "Medium", category: "Heap", tags: ["heap", "design"] },
    "Find Median From Data Stream": { difficulty: "Hard", category: "Heap", tags: ["heap", "design"] },
    "Subsets": { difficulty: "Medium", category: "Backtracking", tags: ["backtracking"] },
    "Combination Sum": { difficulty: "Medium", category: "Backtracking", tags: ["backtracking"] },
    "Permutations": { difficulty: "Medium", category: "Backtracking", tags: ["backtracking"] },
    "Subsets Ii": { difficulty: "Medium", category: "Backtracking", tags: ["backtracking"] },
    "Combination Sum Ii": { difficulty: "Medium", category: "Backtracking", tags: ["backtracking"] },
    "Word Search": { difficulty: "Medium", category: "Backtracking", tags: ["backtracking"] },
    "Palindrome Partitioning": { difficulty: "Medium", category: "Backtracking", tags: ["backtracking"] },
    "Letter Combinations Of A Phone Number": { difficulty: "Medium", category: "Backtracking", tags: ["backtracking"] },
    "N Queens": { difficulty: "Hard", category: "Backtracking", tags: ["backtracking"] },
    "Number Of Islands": { difficulty: "Medium", category: "Graph", tags: ["graph", "bfs", "dfs"] },
    "Clone Graph": { difficulty: "Medium", category: "Graph", tags: ["graph", "bfs", "dfs"] },
    "Max Area Of Island": { difficulty: "Medium", category: "Graph", tags: ["graph", "bfs", "dfs"] },
    "Pacific Atlantic Water Flow": { difficulty: "Medium", category: "Graph", tags: ["graph", "bfs", "dfs"] },
    "Surrounded Regions": { difficulty: "Medium", category: "Graph", tags: ["graph", "bfs", "dfs"] },
    "Rotting Oranges": { difficulty: "Medium", category: "Graph", tags: ["graph", "bfs"] },
    "Walls And Gates": { difficulty: "Medium", category: "Graph", tags: ["graph", "bfs"] },
    "Course Schedule": { difficulty: "Medium", category: "Graph", tags: ["graph", "topological-sort"] },
    "Course Schedule Ii": { difficulty: "Medium", category: "Graph", tags: ["graph", "topological-sort"] },
    "Redundant Connection": { difficulty: "Medium", category: "Graph", tags: ["graph", "union-find"] },
    "Number Of Connected Components In An Undirected Graph": { difficulty: "Medium", category: "Graph", tags: ["graph", "union-find"] },
    "Graph Valid Tree": { difficulty: "Medium", category: "Graph", tags: ["graph", "union-find"] },
    "Word Ladder": { difficulty: "Hard", category: "Graph", tags: ["graph", "bfs"] },
    "Alien Dictionary": { difficulty: "Hard", category: "Graph", tags: ["graph", "topological-sort"] },
    "Network Delay Time": { difficulty: "Medium", category: "Advanced Graph", tags: ["graph", "dijkstra"] },
    "Swim In Rising Water": { difficulty: "Hard", category: "Advanced Graph", tags: ["graph", "dijkstra"] },
    "Reconstruct Itinerary": { difficulty: "Hard", category: "Advanced Graph", tags: ["graph", "dfs"] },
    "Min Cost To Connect All Points": { difficulty: "Medium", category: "Advanced Graph", tags: ["graph", "prim", "kruskal"] },
    "Cheapest Flights Within K Stops": { difficulty: "Medium", category: "Advanced Graph", tags: ["graph", "dijkstra", "bellman-ford"] },
    "Min Cost Climbing Stairs": { difficulty: "Easy", category: "DP", tags: ["dp"] },
    "House Robber": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "House Robber Ii": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Longest Palindromic Substring": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Palindromic Substrings": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Decode Ways": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Coin Change": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Maximum Product Subarray": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Word Break": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Longest Increasing Subsequence": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Partition Equal Subset Sum": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Unique Paths": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Longest Common Subsequence": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Best Time To Buy And Sell Stock With Cooldown": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Coin Change Ii": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Target Sum": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Interleaving String": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Longest Increasing Path In A Matrix": { difficulty: "Hard", category: "DP", tags: ["dp"] },
    "Edit Distance": { difficulty: "Medium", category: "DP", tags: ["dp"] },
    "Distinct Subsequences": { difficulty: "Hard", category: "DP", tags: ["dp"] },
    "Regular Expression Matching": { difficulty: "Hard", category: "DP", tags: ["dp"] },
    "Burst Balloons": { difficulty: "Hard", category: "DP", tags: ["dp"] },
    "Jump Game": { difficulty: "Medium", category: "Greedy", tags: ["greedy"] },
    "Jump Game Ii": { difficulty: "Medium", category: "Greedy", tags: ["greedy"] },
    "Gas Station": { difficulty: "Medium", category: "Greedy", tags: ["greedy"] },
    "Hand Of Straights": { difficulty: "Medium", category: "Greedy", tags: ["greedy"] },
    "Merge Triplets To Form Target Triplet": { difficulty: "Medium", category: "Greedy", tags: ["greedy"] },
    "Partition Labels": { difficulty: "Medium", category: "Greedy", tags: ["greedy"] },
    "Valid Parenthesis String": { difficulty: "Medium", category: "Greedy", tags: ["greedy"] },
    "Minimum Interval To Include Each Query": { difficulty: "Hard", category: "Heap", tags: ["heap", "sliding-window"] },
    "Spiral Matrix": { difficulty: "Medium", category: "Array", tags: ["array", "matrix"] },
    "Multiply Strings": { difficulty: "Medium", category: "String", tags: ["string", "math"] },
    "Reverse Bits": { difficulty: "Easy", category: "Bit Manipulation", tags: ["bit-manipulation"] },
    "Reverse Integer": { difficulty: "Medium", category: "Math", tags: ["math"] },
};

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]/g, '');
}

function inferTitle(problem: any): string {
    if (problem.title) return problem.title;
    
    const desc = problem.description.toLowerCase();
    if (desc.includes("return true if s is a subsequence of t")) return "Is Subsequence";
    if (desc.includes("length of the last word in the string")) return "Length Of Last Word";
    if (desc.includes("group all anagrams together")) return "Group Anagrams";
    if (desc.includes("longest common prefix")) return "Longest Common Prefix";
    if (desc.includes("serialize and deserialize a binary tree")) return "Serialize And Deserialize Binary Tree";
    if (desc.includes("kth largest element in a stream")) return "Kth Largest Element In A Stream";
    if (desc.includes("reverse nodes in k-group")) return "Reverse Nodes In K Group";
    if (desc.includes("valid sudoku")) return "Valid Sudoku";
    if (desc.includes("lru cache")) return "Lru Cache";
    if (desc.includes("combination sum")) return "Combination Sum";
    if (desc.includes("combination sum ii")) return "Combination Sum Ii";
    if (desc.includes("course schedule")) return "Course Schedule";
    if (desc.includes("course schedule ii")) return "Course Schedule Ii";
    if (desc.includes("n-queens")) return "N Queens";
    if (desc.includes("word search ii")) return "Word Search Ii";
    if (desc.includes("median of two sorted arrays")) return "Median Of Two Sorted Arrays";
    if (desc.includes("sliding window maximum")) return "Sliding Window Maximum";
    if (desc.includes("largest rectangle in histogram")) return "Largest Rectangle In Histogram";
    if (desc.includes("binary tree maximum path sum")) return "Binary Tree Maximum Path Sum";
    if (desc.includes("find median from data stream")) return "Find Median From Data Stream";
    if (desc.includes("regular expression matching")) return "Regular Expression Matching";
    if (desc.includes("minimum window substring")) return "Minimum Window Substring";
    if (desc.includes("swim in rising water")) return "Swim In Rising Water";
    if (desc.includes("word search")) return "Word Search";
    if (desc.includes("clone graph")) return "Clone Graph";
    if (desc.includes("max area of island")) return "Max Area Of Island";
    if (desc.includes("number of islands")) return "Number Of Islands";
    
    return "Unknown Problem";
}

function extractConstraints(description: string): string[] {
    const parts = description.split("Constraints:");
    if (parts.length > 1) {
        return parts[1]
            .split("\n")
            .map(s => s.trim())
            .filter(s => s.length > 0 && s.length < 100);
    }
    return [];
}

function generateStarterCode(title: string): string {
    const className = "Solution";
    // We try to guess the function name from the title
    let functionName = slugify(title).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    
    return `#include <bits/stdc++.h>
using namespace std;

class ${className} {
public:
    // TODO: Update return type and parameters based on problem
    void ${functionName}() {
        // Write your code here
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    ${className} sol;
    // TODO: Implement input parsing
    
    return 0;
}`;
}

const processedProblems = problemsJson.map((p: any) => {
    const title = inferTitle(p);
    const id = slugify(title);
    const metadata = problemMetadataMap[title] || { difficulty: "Medium", category: "Miscellaneous", tags: [] };
    
    const constraints = extractConstraints(p.description);
    const description = p.description.split("Example 1:")[0].split("Constraints:")[0].trim();

    return {
        id,
        title,
        difficulty: metadata.difficulty,
        category: metadata.category,
        tags: metadata.tags,
        description,
        constraints,
        examples: p.examples.map((ex: any) => ({
            input: ex.input,
            output: ex.output,
            explanation: ex.explanation || ""
        })),
        testCases: p.examples.map((ex: any) => ({
            input: ex.input,
            expectedOutput: ex.output
        })),
        judge0Limits: {
            cpu_time_limit: 2,
            wall_time_limit: 5,
            memory_limit: 256000,
            stack_limit: 64000,
        },
        languageId: 54,
        starterCode: generateStarterCode(title),
        editorial: p.editorial,
        acceptanceRate: 0.5
    };
});

const fileContent = `import { Problem } from "@algoarena/shared";

export const importedProblems: Problem[] = ${JSON.stringify(processedProblems, null, 4)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log(`Successfully processed ${processedProblems.length} problems and saved to ${outputPath}`);
