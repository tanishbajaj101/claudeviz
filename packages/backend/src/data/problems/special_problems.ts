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

  // ─── MEDIUM ───────────────────────────────────────────────────────────────

  {
    id: "sp-run-down-the-city",
    title: "Run Down the City",
    difficulty: "Medium",
    category: "Graph",
    tags: ["BFS"],

    description: `You and Yalina were out clubbing in the city. Suddenly, the police are chasing you both through the city streets.

The city is represented as a grid with \`n\` rows and \`m\` columns. Some cells are buildings (walls), some are open streets, and some have police patrols. You and Yalina start at the same position marked \`Y\`.

**Rules:**
- Police move one step per turn in all four cardinal directions (up, down, left, right), but cannot pass through buildings. They spread from every officer simultaneously.
- You can move one step per turn in the same four directions, and also cannot pass through buildings.
- You **cannot** move into a cell that a police officer currently occupies, nor a cell that any police officer will reach on that same turn.

**Goal:** Escape the city by reaching any open street cell on the **boundary** of the grid before (or as) the police arrive.

**Input Format:**
- First line: two integers \`n\` and \`m\` — the rows and columns of the city grid.
- Next \`n\` lines: each a string of \`m\` characters:
  - \`.\` = empty street
  - \`#\` = building (impassable wall)
  - \`P\` = police officer (starting position)
  - \`Y\` = your starting position

**Output Format:**
- If escape is possible, print \`YES\` on the first line, then a sequence of moves on the second line using the characters \`U\` (up), \`D\` (down), \`L\` (left), \`R\` (right) representing a valid path to any boundary exit.
- If escape is impossible, print \`NO\`.

Any valid escape path is accepted.`,

    constraints: [
      "1 ≤ n, m ≤ 1000",
      "The grid contains exactly one 'Y' cell (your starting position)",
      "There may be zero or more 'P' cells (police officers)",
      "Buildings '#' cannot be entered by you or the police",
      "You cannot enter a cell occupied by police at the same timestep",
      "The starting cell 'Y' is never on the grid boundary",
      "Police cells 'P' are treated as passable streets for movement purposes",
    ],

    examples: [
      {
        input: `4 5\n#####\nPY...\n#....\n#####`,
        output: `YES\nRRR`,
        explanation: `Police start at (row 1, col 0) and spread rightward. Y starts at (row 1, col 1) and sprints right: (1,1)→(1,2)→(1,3)→(1,4). Column 4 is the right boundary — escape! At each step, Y is always one cell ahead of where the police can reach that turn.`,
      },
      {
        input: `3 3\n###\n#YP\n###`,
        output: `NO`,
        explanation: `Y is at (1,1) surrounded by walls on three sides. The only open neighbor is (1,2), which is a police cell (police_time = 0). By turn 1 the police already occupy (1,2) and spread to (1,1). There are no reachable boundary exits, so escape is impossible.`,
      },
    ],

    testCases: [
      {
        input: `4 5\n#####\nPY...\n#....\n#####`,
        expectedOutput: `YES\nRRR`,
      },
      {
        input: `3 3\n###\n#YP\n###`,
        expectedOutput: `NO`,
      },
      {
        input: `5 7\n#######\n#.....#\n#.Y.P.#\n#.....#\n##...##`,
        expectedOutput: `YES\nDDR`,
      },
      {
        input: `3 5\n#####\n#YPP#\n#####`,
        expectedOutput: `NO`,
      },
      {
        input: `6 6\n######\nP....#\n#.##.#\n#.##Y#\n#....#\n######`,
        expectedOutput: `YES\nDLLLL`,
      },
    ],

    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 4,
      memory_limit: 256000,
      stack_limit: 64000,
    },

    languageId: 54,

    starterCode: `#include <bits/stdc++.h>
using namespace std;


void runDownTheCity() {
    int n, m;
    cin >> n >> m;

    vector<string> grid(n);
    for (int i = 0; i < n; i++) {
        cin >> grid[i];
    }

    cout << "NO\\n";
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    runDownTheCity();
    return 0;
}`,

    editorial: `## Run Down the City — Editorial

### Core Insight

At turn \`t\`, a cell \`(r, c)\` is **police-occupied** if any officer can reach it in \`≤ t\` steps. This lets us decouple the problem into two independent BFS passes.

---

### Step 1 — Multi-source BFS for Police Coverage

Run a single BFS from **all police starting positions simultaneously**. This gives us:

\`\`\`
police_time[r][c] = minimum number of turns for any officer to reach (r, c)
\`\`\`

A cell is dangerous at turn \`t\` if \`police_time[r][c] ≤ t\`.

**Time complexity:** O(n × m)

\`\`\`cpp
vector<vector<int>> police_time(n, vector<int>(m, INT_MAX));
queue<pair<int,int>> pq;

for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        if (grid[i][j] == 'P') {
            police_time[i][j] = 0;
            pq.push({i, j});
        }

int dx[] = {-1, 1, 0, 0};
int dy[] = {0, 0, -1, 1};

while (!pq.empty()) {
    auto [r, c] = pq.front(); pq.pop();
    for (int d = 0; d < 4; d++) {
        int nr = r + dx[d], nc = c + dy[d];
        if (nr >= 0 && nr < n && nc >= 0 && nc < m
            && grid[nr][nc] != '#'
            && police_time[nr][nc] == INT_MAX) {
            police_time[nr][nc] = police_time[r][c] + 1;
            pq.push({nr, nc});
        }
    }
}
\`\`\`

---

### Step 2 — BFS for Your Escape Path

BFS from your starting position \`Y\`. When you are at cell \`(r, c)\` at turn \`t\` and try to move to \`(nr, nc)\` at turn \`t + 1\`, the move is **valid** if and only if:

> \`grid[nr][nc] != '#'\`  **and**  \`police_time[nr][nc] > t + 1\`

Because BFS visits cells in order of increasing distance (= turn number), the **first time** a cell is reached is the **earliest** it can ever be visited. This is also the safest: police only spread over time, so if a cell isn't safe at minimum arrival time, it's never safe.

\`\`\`cpp
vector<vector<int>> y_time(n, vector<int>(m, INT_MAX));
vector<vector<pair<int,int>>> parent(n, vector<pair<int,int>>(m, {-1,-1}));
vector<vector<char>> move_dir(n, vector<char>(m, ' '));
char dirs[] = {'U', 'D', 'L', 'R'};

queue<pair<int,int>> yq;
y_time[sy][sx] = 0;
yq.push({sy, sx});

int er = -1, ec = -1;

while (!yq.empty() && er == -1) {
    auto [r, c] = yq.front(); yq.pop();
    int t = y_time[r][c];

    for (int d = 0; d < 4; d++) {
        int nr = r + dx[d], nc = c + dy[d];
        if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
        if (grid[nr][nc] == '#') continue;
        if (y_time[nr][nc] != INT_MAX) continue;
        if (police_time[nr][nc] <= t + 1) continue; // police arrive same turn or earlier

        y_time[nr][nc] = t + 1;
        parent[nr][nc] = {r, c};
        move_dir[nr][nc] = dirs[d];
        yq.push({nr, nc});

        if (nr == 0 || nr == n-1 || nc == 0 || nc == m-1) {
            er = nr; ec = nc; break;
        }
    }
}
\`\`\`

---

### Step 3 — Path Reconstruction

Walk the \`parent\` array backwards from the exit cell to the start, collecting \`move_dir\` characters, then reverse.

\`\`\`cpp
if (er == -1) {
    cout << "NO\\n";
} else {
    cout << "YES\\n";
    string path;
    int r = er, c = ec;
    while (r != sy || c != sx) {
        path += move_dir[r][c];
        auto [pr, pc] = parent[r][c];
        r = pr; c = pc;
    }
    reverse(path.begin(), path.end());
    cout << path << "\\n";
}
\`\`\`

---

### Complexity Summary

| Step | Time | Space |
|------|------|-------|
| Police BFS | O(n × m) | O(n × m) |
| Player BFS | O(n × m) | O(n × m) |
| **Total** | **O(n × m)** | **O(n × m)** |

For n = m = 1000, this handles 10⁶ cells well within the 2-second time limit.

---

### Common Pitfalls

1. **Off-by-one on the safety check:** The condition must be \`police_time[nr][nc] > t + 1\` (strictly greater), not \`≥\`. Police arriving at the *same* turn as you counts as a catch.
2. **Initial position safety:** If a police officer starts adjacent to \`Y\`, they reach \`Y\` at \`t = 1\`. \`Y\`'s starting cell itself has \`police_time = ∞\` (assuming no officer spawns on \`Y\`), so \`t = 0\` is always safe.
3. **Boundary ≠ automatic exit:** A boundary cell blocked by a wall \`#\` is not an exit. Only reachable non-wall boundary cells count.
4. **Grid cell type for \`P\`:** Police cells are open streets. Only \`#\` is impassable. Don't accidentally skip \`P\`-marked cells during BFS expansion.`,

    acceptanceRate: 18.7,
  },

  {
    id: "sp-et-tu-brutus",
    title: "Et tu, Brute?",
    difficulty: "Medium",
    category: "Graph",
    tags: ["Dijkstra"],
    acceptanceRate: 41.7,

    description: `You have joined hands with SP Aslam to overthrow Sher-e-Baloch. Aslam has divided Lyari into an **n × m** grid. Each cell holds an integer — the **loyalty score** of that zone towards Rehman Dakait.

You are at the **top-left corner (0, 0)**. SP Aslam is waiting at the **bottom-right corner (n-1, m-1)**. From any cell, you can move to an adjacent cell in four directions: **up, down, left, or right**.

To manage reinforcements, you need to pass a threshold **X** to Aslam — the minimum danger level you must tolerate so that a path to Aslam exists, only stepping through zones with loyalty score **at most X**.

Find the **minimum possible value of X**.`,

    constraints: [
      "1 ≤ n, m ≤ 500",
      "0 ≤ grid[i][j] ≤ 10^9",
      "It is always guaranteed that a path exists (i.e., the grid is fully connected when all cells are allowed).",
      "The first line contains two integers n and m.",
      "The next n lines each contain m space-separated integers representing the grid.",
    ],

    examples: [
      {
        input: "3 3\n0 2 0\n2 1 2\n0 2 0",
        output: "2",
        explanation:
          "With X = 2, a path (0,0) → (0,1) → (0,2) → (1,2) → (2,2) exists where every zone has loyalty ≤ 2. " +
          "With X = 1, you get stuck at (0,0) because all neighbors have loyalty score 2.",
      },
      {
        input: "2 2\n0 5\n5 0",
        output: "5",
        explanation:
          "No matter which direction you move first, you must pass through a zone with loyalty 5. " +
          "So the minimum threshold to report to Aslam is 5.",
      },
      {
        input: "1 1\n7",
        output: "7",
        explanation:
          "The start and end are the same cell. You must tolerate a loyalty score of 7.",
      },
    ],

    testCases: [
      { input: "3 3\n0 2 0\n2 1 2\n0 2 0", expectedOutput: "2" },
      { input: "2 2\n0 5\n5 0", expectedOutput: "5" },
      { input: "1 1\n7", expectedOutput: "7" },
      { input: "1 5\n3 1 4 1 5", expectedOutput: "5" },
      { input: "5 1\n2\n8\n1\n3\n6", expectedOutput: "8" },
      { input: "4 4\n1 4 7 2\n3 2 5 1\n6 1 2 3\n4 5 1 2", expectedOutput: "3" },
      { input: "2 3\n5 5 5\n5 5 5", expectedOutput: "5" },
      { input: "3 3\n0 0 0\n0 0 0\n0 0 0", expectedOutput: "0" },
      { input: "2 2\n0 1000000000\n1000000000 0", expectedOutput: "1000000000" },
      { input: "3 3\n1 1000000000 1\n1 1000000000 1\n1 1 1", expectedOutput: "1" },
    ],

    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 3,
      memory_limit: 262144,
      stack_limit: 65536,
    },

    languageId: 54,

    starterCode: `#include <bits/stdc++.h>
using namespace std;


long long minDangerThreshold(const vector<vector<long long>>& grid) {

}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    cin >> n >> m;

    vector<vector<long long>> grid(n, vector<long long>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> grid[i][j];

    long long ans = minDangerThreshold(grid);
    cout << ans << "\\n";

    return 0;
}`,

    editorial: `## Intuition

You need the minimum **bottleneck** of any path from (0, 0) to (n-1, m-1), where the bottleneck of a path is the **maximum cell value** along it. This is the classic **Minimax Path** problem.

---

## Approach 1: Modified Dijkstra (Recommended) — O(n·m·log(n·m))

Instead of minimizing the **sum** of weights, we minimize the **maximum weight** encountered along the path.

Define \`dist[i][j]\` as the minimum possible bottleneck to reach cell (i, j) from (0, 0).

**Relaxation rule:**
\`\`\`
dist[nx][ny] = min(dist[nx][ny], max(dist[x][y], grid[nx][ny]))
\`\`\`

Use a **min-heap** keyed on \`dist[i][j]\`. This is Dijkstra with max instead of addition.

**Answer:** \`dist[n-1][m-1]\`

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    cin >> n >> m;

    vector<vector<long long>> grid(n, vector<long long>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> grid[i][j];

    const long long INF = LLONG_MAX;
    vector<vector<long long>> dist(n, vector<long long>(m, INF));
    priority_queue<tuple<long long,int,int>,
                   vector<tuple<long long,int,int>>,
                   greater<>> pq;

    dist[0][0] = grid[0][0];
    pq.push({grid[0][0], 0, 0});

    int dx[] = {0, 0, 1, -1};
    int dy[] = {1, -1, 0, 0};

    while (!pq.empty()) {
        auto [d, x, y] = pq.top(); pq.pop();
        if (d > dist[x][y]) continue;
        if (x == n - 1 && y == m - 1) break;
        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k], ny = y + dy[k];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
            long long nd = max(d, grid[nx][ny]);
            if (nd < dist[nx][ny]) {
                dist[nx][ny] = nd;
                pq.push({nd, nx, ny});
            }
        }
    }

    cout << dist[n - 1][m - 1] << "\\n";
    return 0;
}
\`\`\`

---

## Approach 2: Binary Search + BFS — O(n·m·log(max_val))

Binary search on X over \`[0, 10^9]\`. For each candidate X, BFS/DFS to check if (n-1, m-1) is reachable using only cells with value ≤ X.

- Reachable → try smaller X (go left)
- Not reachable → increase X (go right)

Compress values to at most n·m unique ones to bring complexity to O(n·m·log(n·m)).

---

## Approach 3: DSU (Kruskal-style) — O(n·m·log(n·m))

- Flatten all cells into a list and sort by loyalty score.
- Add cells one by one in increasing order, unioning each with its already-added neighbors via DSU.
- Stop as soon as (0, 0) and (n-1, m-1) are in the same component. That cell's value is the answer.

---

## Complexity Summary

| Approach | Time | Space |
|---|---|---|
| Dijkstra (Bottleneck) | O(n·m·log(n·m)) | O(n·m) |
| Binary Search + BFS | O(n·m·log(max_val)) | O(n·m) |
| DSU / Kruskal-style | O(n·m·log(n·m)) | O(n·m) |

**Recommended:** Dijkstra — clean, no value compression needed, handles \`10^9\` naturally.`,
  },

  {
    id: "sp-sher-e-baloch",
    title: "Sher-e-Baloch",
    difficulty: "Medium",
    category: "Graph",
    tags: ["DSU", "Union-Find", "BFS", "Grid", "Connected Components"],
    description: `You are **Sher-e-Baloch**, the strategic warlord of Lyari.

The city is divided into an \`n × n\` grid. Each cell represents a neighborhood:
- \`1\` → already under **your control**
- \`0\` → controlled by **enemy factions**

You want to expand your network by conquering **exactly one** enemy-controlled neighborhood (\`0\`). Your goal is to **maximize the size of your connected territory**, where neighborhoods are connected **horizontally or vertically**.

Return the **maximum size** of your network after conquering a single enemy neighborhood.

> If the entire grid is already under your control, return \`n * n\`.`,

    constraints: [
      "1 <= n <= 500",
      "grid[i][j] is either 0 or 1",
      "There is at least one cell equal to 1",
    ],

    examples: [
      {
        input: "grid = [[1,0],[0,1]]",
        output: "3",
        explanation:
          "Conquer the top-right cell (0,1). It bridges two isolated networks of size 1 each. Total: 1 + 1 + 1 (conquered cell) = 3.",
      },
      {
        input: "grid = [[1,1],[1,0]]",
        output: "4",
        explanation:
          "Conquer the bottom-right cell (1,1). It connects to the existing network of size 3. Total: 3 + 1 = 4. Absolute dominance.",
      },
      {
        input: "grid = [[0,0,0],[0,1,0],[0,0,0]]",
        output: "2",
        explanation:
          "No matter which enemy cell you conquer adjacent to the center, you gain at most 1 + 1 = 2.",
      },
    ],

    testCases: [
      { input: "2\n1 0\n0 1", expectedOutput: "3" },
      { input: "2\n1 1\n1 0", expectedOutput: "4" },
      { input: "3\n0 0 0\n0 1 0\n0 0 0", expectedOutput: "2" },
      { input: "1\n0", expectedOutput: "1" },
      { input: "3\n1 1 0\n0 0 0\n0 1 1", expectedOutput: "3" },
      { input: "4\n1 1 0 0\n1 0 0 1\n0 0 1 1\n0 1 1 1", expectedOutput: "7" },
      { input: "2\n1 1\n1 1", expectedOutput: "4" },
    ],

    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 3,
      memory_limit: 256000,
      stack_limit: 64000,
    },

    languageId: 54,

    starterCode: `#include <bits/stdc++.h>
using namespace std;



class Solution {
public:
    int maxNetworkSize(vector<vector<int>>& grid) {

        return 0;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    cin >> n;
    vector<vector<int>> grid(n, vector<int>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> grid[i][j];

    Solution sol;
    cout << sol.maxNetworkSize(grid) << endl;
    return 0;
}`,

    editorial: `## Strategy: DSU (Disjoint Set Union)

### Key Insight
Brute-force flipping every \`0\` and running BFS/DFS each time is **O(n⁴)** — too slow for n = 500.

Instead, pre-compute connected component sizes once using **DSU**, then evaluate each \`0\` cell in **O(α(n))** amortized.

---

### Step 1 — Build the DSU

Map each cell \`(i, j)\` to a 1D index: \`id = i * n + j\`.

Iterate over all \`1\` cells. For each, union it with its **right** and **down** neighbors if they are also \`1\`. This builds all connected components in one pass.

\`\`\`cpp
DSU dsu(n * n);
int dx[] = {0, 1};
int dy[] = {1, 0};

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        if (grid[i][j] == 1) {
            for (int d = 0; d < 2; d++) {
                int ni = i + dx[d], nj = j + dy[d];
                if (ni < n && nj < n && grid[ni][nj] == 1)
                    dsu.unite(i * n + j, ni * n + nj);
            }
        }
    }
}
\`\`\`

---

### Step 2 — Evaluate Each Enemy Cell

For every \`0\` cell, look at all **4 neighbors**. Collect the **unique** root IDs of neighboring \`1\` components (use a set to avoid double-counting). Sum their sizes and add \`1\` for the conquered cell itself.

\`\`\`cpp
int ans = 0;
int dirs[] = {-1, 0, 1, 0, -1};

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        if (grid[i][j] == 0) {
            set<int> seen;
            int gain = 1;
            for (int d = 0; d < 4; d++) {
                int ni = i + dirs[d], nj = j + dirs[d + 1];
                if (ni >= 0 && ni < n && nj >= 0 && nj < n && grid[ni][nj] == 1) {
                    int root = dsu.find(ni * n + nj);
                    if (!seen.count(root)) {
                        seen.insert(root);
                        gain += dsu.getSize(root);
                    }
                }
            }
            ans = max(ans, gain);
        }
    }
}
\`\`\`

---

### Step 3 — Edge Case: No \`0\` Exists

If the grid is entirely \`1\`s, every cell is already yours. Return \`n * n\`.

\`\`\`cpp
if (ans == 0) return n * n;
return ans;
\`\`\`

---

### Complexity

| | Complexity |
|---|---|
| **Time** | O(n² · α(n²)) ≈ O(n²) |
| **Space** | O(n²) for DSU arrays |

Well within limits for n = 500 (250,000 cells).

---

### DSU Implementation

\`\`\`cpp
int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]); // path compression
    return parent[x];
}

void unite(int x, int y) {
    x = find(x); y = find(y);
    if (x == y) return;
    if (size[x] < size[y]) swap(x, y);
    parent[y] = x;
    size[x] += size[y]; // union by size
}
\`\`\``,

    acceptanceRate: 61.4,
  },

  // ─── HARD ────────────────────────────────────────────────────────────────
  {
    id: "sp-bade-Sahab",
    title: "Bade Sahab",
    difficulty: "Hard",
    category: "Dynamic Programming",
    tags: ["2D DP", "Grid", "Bottom-Up DP", "Matrix Traversal"],

    description: `You are Jameel Jamali, starting at the top-left corner \`(0, 0)\` of a city grid.
Your mission: reach and take down **Bade Sahab**, hiding at the bottom-right corner \`(n-1, m-1)\`.

The city is represented as a 2D grid \`city[n][m]\`. Each cell contains an integer:
- **Negative** (\`-x\`): Encounter enemy forces or traps — you lose \`x\` health points.
- **Zero** (\`0\`): Empty street — safe passage.
- **Positive** (\`+x\`): Find intel, gadgets, or secret info — you gain \`x\` health points.

You can only move **right** or **down** at each step.
Your health must **never drop to 0 or below**, or the mission fails.

**Objective**: Determine the **minimum initial health** Jameel needs to reach Bade Sahab alive.`,

    constraints: [
      "1 <= n, m <= 200",
      "-1000 <= city[i][j] <= 1000",
      "You may only move right or down.",
      "Health must remain strictly greater than 0 at all times.",
    ],

    examples: [
      {
        input: `city = [\n  [-2, -3,  3],\n  [-5,-10,  1],\n  [10, 30, -5]\n]`,
        output: "7",
        explanation: `Jameel starts with 7 HP and takes the path (0,0)→(0,1)→(0,2)→(1,2)→(2,2):\n1. (0,0): 7 - 2 = 5  (enemy encounter)\n2. (0,1): 5 - 3 = 2  (trap)\n3. (0,2): 2 + 3 = 5  (find intel)\n4. (1,2): 5 + 1 = 6  (more intel)\n5. (2,2): 6 - 5 = 1  (final showdown — still alive!)\nStarting with 6 would leave Jameel dead at (0,1), so 7 is the minimum.`,
      },
      {
        input: `city = [[0]]`,
        output: "1",
        explanation: "No damage taken, but Jameel still needs at least 1 HP to be alive.",
      },
      {
        input: `city = [\n  [-5],\n  [-3]\n]`,
        output: "9",
        explanation: `Only path is straight down: needs 5 HP for (0,0) → survive with 1+, then loses 3 more. So min start = 9.`,
      },
    ],

    testCases: [
      { input: "3 3\n-2 -3 3\n-5 -10 1\n10 30 -5", expectedOutput: "7" },
      { input: "1 1\n0",                            expectedOutput: "1" },
      { input: "2 1\n-5\n-3",                       expectedOutput: "9" },
      { input: "1 3\n1 -3 5",                       expectedOutput: "3" },
      { input: "3 3\n1 -3 3\n0 -2 0\n-3 -3 -3",    expectedOutput: "3" },
      { input: "1 1\n-1000",                         expectedOutput: "1001" },
      { input: "2 2\n0 0\n0 0",                      expectedOutput: "1" },
    ],

    judge0Limits: {
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 128000,
      stack_limit: 64000,
    },

    languageId: 54,

    starterCode: `#include <bits/stdc++.h>
using namespace std;

int calculateMinimumHP(vector<vector<int>>& city) {

}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, m;
    cin >> n >> m;

    vector<vector<int>> city(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> city[i][j];

    cout << calculateMinimumHP(city) << endl;
    return 0;
}`,

    editorial: `## Editorial — Jameel Jamali and the Crime Nexus

### Intuition

A greedy approach from the start doesn't work — gaining health early can lure you down a path that kills you later.
The key insight is to **think backwards**: instead of asking "how much health do I start with?", ask
"how much health do I need when I arrive at each cell to survive from here to the end?"

---

### Approach: Bottom-Up DP (Reverse Traversal)

Define \`dp[i][j]\` = **minimum health needed upon entering cell (i, j)** to complete the mission.

**Base Case — Bottom-Right Corner (Bade Sahab's hideout):**
\`\`\`
dp[n-1][m-1] = max(1, 1 - city[n-1][m-1])
\`\`\`
You need at least 1 HP after this cell. If the cell drains health, you must compensate.

**Last Row (can only move right → only one choice):**
\`\`\`
dp[n-1][j] = max(1, dp[n-1][j+1] - city[n-1][j])
\`\`\`

**Last Column (can only move down → only one choice):**
\`\`\`
dp[i][m-1] = max(1, dp[i+1][m-1] - city[i][m-1])
\`\`\`

**General Cell:**
\`\`\`
dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - city[i][j])
\`\`\`
- Pick the cheaper successor (right or down).
- Subtract the cell's contribution (negative cell increases needed health, positive decreases it).
- Always clamp to at least 1 — you can never enter a cell with 0 health.

**Answer:** \`dp[0][0]\`

---

### Implementation

\`\`\`cpp
int calculateMinimumHP(vector<vector<int>>& city) {
    int n = city.size(), m = city[0].size();
    vector<vector<int>> dp(n, vector<int>(m, 0));

    dp[n-1][m-1] = max(1, 1 - city[n-1][m-1]);

    for (int j = m - 2; j >= 0; j--)
        dp[n-1][j] = max(1, dp[n-1][j+1] - city[n-1][j]);

    for (int i = n - 2; i >= 0; i--)
        dp[i][m-1] = max(1, dp[i+1][m-1] - city[i][m-1]);

    for (int i = n - 2; i >= 0; i--)
        for (int j = m - 2; j >= 0; j--)
            dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - city[i][j]);

    return dp[0][0];
}
\`\`\`

---

### Complexity

| | |
|---|---|
| **Time** | O(n × m) |
| **Space** | O(n × m) — reducible to O(m) with a 1D rolling array |

---

### Common Pitfalls

- **Forgetting the \`max(1, ...)\` clamp**: Even if a cell gives you a ton of health, you still need at least 1 HP to enter it.
- **Going forward**: Forward DP doesn't work because maximising health at a cell doesn't guarantee survival on all future paths.
- **Off-by-one on the final cell**: The minimum needed at \`(n-1, m-1)\` is \`1\` after processing, not \`0\`.`,

    acceptanceRate: 38.4,
  },
  {
    id: "sp-wrath-of-god",
    title: "Wrath of God",
    difficulty: "Hard",
    category: "Dynamic Programming",
    tags: ["dp"],

    description: `You face the Angel of Death in a battle lasting **n rounds**.

In each round, you choose **one of three actions**:

- **Strike** — deals \`A[i]\` damage. Always available.
- **Block** — deals 0 damage. Always available.
- **Counter** — deals \`C[i]\` damage. Only available if your previous move was **Block**.

**Constraints on actions:**
- You **cannot use the same action in two consecutive rounds**.
- **Counter** is only available if your immediately previous action was **Block**.

Return the **maximum total damage** you can deal to the boss across all n rounds.`,

    constraints: [
      "1 ≤ n ≤ 10^5",
      "1 ≤ A[i] ≤ 10^4",
      "1 ≤ C[i] ≤ 10^4",
    ],

    examples: [
      {
        input: "n = 3\nA = [2, 3, 5]\nC = [4, 2, 6]",
        output: "8",
        explanation:
          "Optimal sequence: Strike(2) → Block(0) → Counter(6) = 8.\n" +
          "Note: Block → Counter is valid, and Counter is not the same as Block.\n" +
          "Alternative Strike → Strike is invalid (same action twice).",
      },
      {
        input: "n = 4\nA = [3, 6, 2, 8]\nC = [5, 1, 9, 4]",
        output: "20",
        explanation:
          "Optimal sequence: Strike(3) → Block(0) → Counter(9) → Strike(8) = 20.\n" +
          "Counter at round 2 is valid because round 1 was Block.\n" +
          "Strike at round 3 is valid because round 2 was Counter (not Strike).",
      },
      {
        input: "n = 1\nA = [10]\nC = [99]",
        output: "10",
        explanation:
          "Only one round. Counter is unavailable (no prior Block). Best action is Strike(10).",
      },
      {
        input: "n = 2\nA = [1, 1]\nC = [10, 10]",
        output: "10",
        explanation:
          "Block(0) → Counter(10) = 10 beats Strike(1) → Block(0) = 1 and Strike(1) → Strike — invalid.",
      },
    ],

    testCases: [
      { input: "3\n2 3 5\n4 2 6",          expectedOutput: "8"  },
      { input: "4\n3 6 2 8\n5 1 9 4",      expectedOutput: "20" },
      { input: "1\n10\n99",                expectedOutput: "10" },
      { input: "2\n1 1\n10 10",            expectedOutput: "10" },
      { input: "5\n5 3 8 2 7\n1 9 4 6 3", expectedOutput: "24" },
      { input: "4\n9 9 9 9\n0 0 0 0",      expectedOutput: "27" },
      { input: "2\n5 3\n0 7",             expectedOutput: "7"  },
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

int maxDamage(int n, vector<int>& A, vector<int>& C) {

}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    cin >> n;
    vector<int> A(n), C(n);
    for (int i = 0; i < n; i++) cin >> A[i];
    for (int i = 0; i < n; i++) cin >> C[i];

    cout << maxDamage(n, A, C) << endl;
    return 0;
}`,

    editorial: `## Approach: Dynamic Programming (State Machine)

This is a classic **Ninja Training**-style DP where, at each step, the choice you can make depends on what you did in the previous step.

### States
Define three DP states at round \`i\`:
- \`dp[i][0]\` = max damage achievable ending with **Strike** at round i
- \`dp[i][1]\` = max damage achievable ending with **Block** at round i
- \`dp[i][2]\` = max damage achievable ending with **Counter** at round i

### Transitions
Based on the action rules:
\`\`\`
dp[i][0] = A[i] + max(dp[i-1][1], dp[i-1][2])   // Strike: prev must be Block or Counter
dp[i][1] = 0    + max(dp[i-1][0], dp[i-1][2])   // Block:  prev must be Strike or Counter
dp[i][2] = C[i] + dp[i-1][1]                     // Counter: ONLY if prev was Block
\`\`\`

### Base Case (round 0)
- \`dp[0][0] = A[0]\`  (Strike)
- \`dp[0][1] = 0\`      (Block)
- \`dp[0][2] = -∞\`     (Counter is impossible with no prior move)

### Answer
\`max(dp[n-1][0], dp[n-1][1], dp[n-1][2])\`

### Space Optimization
You only ever need the previous row — reduce space from O(n) to O(1) using two arrays or three variables.

### Complexity
- **Time:** O(n)
- **Space:** O(1) after optimization

\`\`\`cpp
int maxDamage(int n, vector<int>& A, vector<int>& C) {
    const int NEG_INF = INT_MIN / 2;
    long long s = A[0], b = 0, c = NEG_INF; // Strike, Block, Counter

    for (int i = 1; i < n; i++) {
        long long ns = A[i] + max(b, c);     // Strike: from Block or Counter
        long long nb = 0    + max(s, c);     // Block:  from Strike or Counter
        long long nc = (b == NEG_INF) ? NEG_INF : C[i] + b; // Counter: ONLY from Block
        s = ns; b = nb; c = nc;
    }
    return (int)max({s, b, c});
}
\`\`\``,

    acceptanceRate: 52.3,
  },
];
