"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 font-mono text-sm font-bold text-zinc-950">
            AA
          </div>
          <span className="font-mono text-lg font-semibold tracking-tight text-zinc-100">
            AlgoArena
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="font-mono">{session.user.name}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-md border border-zinc-700 px-3 py-1.5 font-mono text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-md bg-emerald-600 px-4 py-1.5 font-mono text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
