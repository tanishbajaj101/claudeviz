const MOCK_FRIENDS: { name: string; initial: string; online: boolean; activity: string; color: string; unread?: boolean }[] = [
  { name: 'alice', initial: 'A', online: true, activity: 'Solving: Two Sum', color: 'bg-violet-600' },
  { name: 'bob_dev', initial: 'B', online: true, activity: 'Solving: Merge Sort', color: 'bg-blue-600' },
  { name: 'charlie', initial: 'C', online: false, activity: 'Active 2h ago', color: 'bg-emerald-600' },
  { name: 'diana_42', initial: 'D', online: false, activity: 'Active 1d ago', color: 'bg-amber-600', unread: true },
];

export function FriendsShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
        // friends & activity
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text */}
        <div>
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Learn together, solve together
          </h2>
          <div className="mt-6 space-y-3">
            <Bullet text="See what your friends are solving in real-time" />
            <Bullet text="Chat directly within the platform" />
            <Bullet text="Track each other's progress and streaks" />
          </div>
        </div>

        {/* Mock friends panel — right side */}
        <div className="rounded-lg border border-border bg-card overflow-hidden w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-mono text-xs font-semibold text-foreground">Friends</span>
            <span className="font-mono text-[10px] text-muted-foreground">4 friends</span>
          </div>

          {/* Friend entries */}
          <div className="p-2 space-y-0.5">
            {MOCK_FRIENDS.map((f) => (
              <div
                key={f.name}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-muted/60 ${f.unread ? 'bg-muted/40' : ''}`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className={`h-9 w-9 rounded-full ${f.color} flex items-center justify-center text-sm font-bold text-white`}>
                    {f.initial}
                  </div>
                  {f.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`truncate text-sm font-mono ${f.unread ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
                      {f.name}
                    </span>
                    {f.unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="truncate text-xs font-mono text-muted-foreground">
                    {f.activity.startsWith('Solving') ? (
                      <>
                        solving{' '}
                        <span className="text-emerald-400/80">{f.activity.replace('Solving: ', '')}</span>
                        ...
                      </>
                    ) : (
                      f.activity
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <p className="font-mono text-sm text-muted-foreground">
      <span className="text-primary mr-2">{'>'}</span>
      {text}
    </p>
  );
}
