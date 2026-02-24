"use client";

import { useState, useRef, useEffect } from "react";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { useFriends } from "@/hooks/useFriends";

interface InviteFriendsDropdownProps {
    contestId: number;
    currentUserId?: number;
}

export function InviteFriendsDropdown({ contestId, currentUserId }: InviteFriendsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { friends, onlineFriends } = useFriends(currentUserId);
    const [invitingIds, setInvitingIds] = useState<Set<number>>(new Set());
    const [invitedIds, setInvitedIds] = useState<Set<number>>(new Set());

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInvite = async (friendId: number) => {
        setInvitingIds(prev => new Set(prev).add(friendId));
        try {
            const res = await fetch(`/api/contests/${contestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite", friendId })
      });
      if (res.ok) {
        setInvitedIds(prev => new Set(prev).add(friendId));
      }
    } catch (err) {
      console.error("Failed to invite friend:", err);
    } finally {
      setInvitingIds(prev => {
        const next = new Set(prev);
        next.delete(friendId);
        return next;
      });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
      >
        <UserPlus size={16} className="text-zinc-400" />
        Invite Friends
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-md border border-zinc-700 bg-zinc-900 py-2 shadow-xl z-50">
          <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
            Your Friends
          </div>
          
          <div className="max-h-60 overflow-y-auto pt-2">
            {friends.length === 0 ? (
              <p className="px-4 py-2 text-sm text-zinc-500">No friends to invite.</p>
            ) : (
              friends.map(friend => {
                const isOnline = onlineFriends.has(friend.id);
                const isInvited = invitedIds.has(friend.id);
                const isInviting = invitingIds.has(friend.id);

                return (
                  <div key={friend.id} className="flex items-center justify-between px-4 py-2 hover:bg-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img 
                          src={`/api/users/avatar?username=${friend.username}`}
                          alt={friend.username}
                          className="h-6 w-6 rounded-full bg-zinc-800"
                        />
                        <div className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-zinc-900 ${isOnline ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
                      </div>
                      <span className="text-sm font-medium text-zinc-200 truncate max-w-[100px]">
                        {friend.username}
                      </span>
                    </div>

                    <button
                      disabled={isInvited || isInviting}
                      onClick={() => handleInvite(friend.id)}
                      className={`rounded-md px-2 py-1 flex items-center justify-center text-xs font-medium transition-colors min-w-[60px] ${
                        isInvited 
                          ? "bg-zinc-800 text-emerald-500"
                          : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                      }`}
                    >
                      {isInviting ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : isInvited ? (
                        <span className="flex items-center gap-1"><Check size={12}/> Sent</span>
                      ) : (
                        "Invite"
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
