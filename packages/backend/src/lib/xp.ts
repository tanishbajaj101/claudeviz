import { prisma } from './prisma.js';

export const XP_VALUES = { Easy: 100, Medium: 250, Hard: 600 } as const;

export function calculateXP(difficulty: 'Easy' | 'Medium' | 'Hard', isBounty: boolean): number {
  const base = XP_VALUES[difficulty];
  return isBounty ? Math.round(base * 1.5) : base;
}

export async function awardXP(userId: number, xp: number): Promise<number> {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xp } },
    select: { xp: true },
  });
  return updated.xp;
}
