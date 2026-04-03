import { Trophy, Clock } from 'lucide-react';

const MOCK_LEADERBOARD: { rank: number; name: string; score: number; solved: number; rankColor: string; isYou?: boolean }[] = [
  { rank: 1, name: 'alice', score: 600, solved: 3, rankColor: 'text-yellow-400' },
  { rank: 2, name: 'bob_dev', score: 300, solved: 2, rankColor: 'text-muted-foreground' },
  { rank: 3, name: 'charlie', score: 200, solved: 1, rankColor: 'text-amber-600' },
  { rank: 4, name: 'you', score: 100, solved: 1, rankColor: 'text-muted-foreground', isYou: true },
];

export function ContestShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
        // private contests
      </p>

      <div className="text-center mb-10">
        <h2 className="font-mono text-2xl md:text-3xl font-bold text-foreground leading-tight">
          Challenge your friends in private contests
        </h2>
        <p className="font-mono text-sm text-muted-foreground mt-3 max-w-lg mx-auto">
          Create timed rounds, pick problems by difficulty, and climb the leaderboard together.
        </p>
      </div>

      {/* Mock contest card */}
      <div className="rounded-lg border border-border bg-card overflow-hidden max-w-2xl mx-auto">
        {/* Contest header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-semibold text-foreground">Weekend DSA Battle</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono text-xs font-medium">23:47 remaining</span>
          </div>
        </div>

        {/* Scoring legend */}
        <div className="flex items-center gap-4 border-b border-border px-4 py-2 md:px-6">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Scoring:</span>
          <span className="font-mono text-[10px] text-emerald-400">Easy +100</span>
          <span className="font-mono text-[10px] text-amber-400">Medium +200</span>
          <span className="font-mono text-[10px] text-red-400">Hard +300</span>
        </div>

        {/* Leaderboard table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono text-xs font-medium text-muted-foreground md:px-6">Rank</th>
                <th className="px-4 py-2.5 text-left font-mono text-xs font-medium text-muted-foreground">Player</th>
                <th className="px-4 py-2.5 text-right font-mono text-xs font-medium text-muted-foreground">Score</th>
                <th className="px-4 py-2.5 text-right font-mono text-xs font-medium text-muted-foreground md:px-6">Solved</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERBOARD.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`border-b border-border last:border-0 transition-colors ${entry.isYou ? 'bg-primary/5' : 'hover:bg-muted'}`}
                >
                  <td className="px-4 py-3 md:px-6">
                    <span className={`font-mono text-sm font-semibold ${entry.rankColor}`}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm ${entry.isYou ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                        @{entry.name}
                      </span>
                      {entry.isYou && (
                        <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-sm font-semibold text-primary">{entry.score}</span>
                  </td>
                  <td className="px-4 py-3 text-right md:px-6">
                    <span className="font-mono text-sm text-muted-foreground">{entry.solved}/3</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
