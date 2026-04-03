export function AiCoachShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
        // ai coach
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text */}
        <div>
          <h2 className="font-mono text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Your AI mentor that understands your thinking
          </h2>
          <div className="mt-6 space-y-3">
            <Bullet text="Understands your approach through the code you write" />
            <Bullet text="Guides with Socratic questions — never spoils the answer" />
            <Bullet text="Trained on multiple solution strategies per problem" />
          </div>
        </div>

        {/* Mock chat panel */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs font-semibold text-foreground">AI Coach</span>
          </div>

          {/* Messages */}
          <div className="px-4 py-4 space-y-3 min-h-[260px]">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-lg bg-primary/20 px-3 py-2">
                <p className="font-mono text-xs text-foreground">
                  My nested loop is O(n²). How can I optimize?
                </p>
              </div>
            </div>

            {/* Assistant message */}
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2">
                <p className="font-mono text-xs text-muted-foreground">
                  Good instinct to optimize! Think about this: when you check if a complement exists, what data structure gives you O(1) lookups?
                </p>
              </div>
            </div>

            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-lg bg-primary/20 px-3 py-2">
                <p className="font-mono text-xs text-foreground">A hash map!</p>
              </div>
            </div>

            {/* Assistant typing indicator */}
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          </div>

          {/* Mock input */}
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
              <span className="font-mono text-xs text-muted-foreground">Ask the AI coach...</span>
            </div>
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
