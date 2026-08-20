<p align="center">
  <img src="./banner.jpeg" alt="CodeTracer banner" width="100%" />
</p>

<h1 align="center">CodeTracer</h1>

<p align="center">
  <em>Master DSA. One problem at a time.</em>
</p>

---

I got tired of grinding LeetCode in a browser tab with fifteen other tabs open, so I built my own version. CodeTracer is a place to pick a problem, write C++ in a real editor, run it against real test cases, and actually *see* your algorithm move instead of just staring at a green checkmark.

It's got an AI coach that nudges you instead of handing you the answer, visualizations that animate what your code is actually doing, and contests + friends + chat if you want to make the grind less lonely.

Built for fun, not for a paycheck. Still very much a work in progress.

## Demo

<video src="./codetracer_demo.mp4" controls width="100%"></video>

## What's in it

- 🧩 **A pile of DSA problems**, split-pane editor next to the problem description
- ⚙️ **Real C++ execution** against real test cases (Judge0 under the hood)
- 🤖 **An AI coach** that gives hints and nudges — never the full solution
- 🎞️ **Algorithm visualizations** so you can watch your solution run, step by step
- 🏆 **Contests** with live leaderboards
- 👥 **Friends, DMs, and notifications** — because solo grinding gets old
- 🔥 **A profile page with a solve heatmap**, because everyone loves a streak

## Run it yourself

```bash
git clone https://github.com/tanishbajaj101/codetracer.git
cd codetracer
npm install
```

Copy the `.env.example` files in `packages/backend` and `packages/frontend` to `.env` / `.env.local` and fill in the blanks (Google OAuth, a Postgres URL, a Judge0 key, an OpenAI key).

```bash
npm run dev
```

Frontend's at `localhost:5173`, backend at `localhost:3001`.

## Contributing

Found a bug, have an idea, or just want to add a problem? PRs and issues are welcome — fork it, branch off, and open a pull request. Nothing formal, just be nice and explain what you changed and why.
