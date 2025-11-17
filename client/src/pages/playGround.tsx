import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllContacts } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import type { TUserPlayground } from "@/services/types";
import ChatWindow from "@/components/chats/chatWindow";

export default function Playground() {
  const [selectedUser, setSelectedUser] = useState<TUserPlayground | null>(null);

  const { data: users, isLoading } = useQuery<TUserPlayground[]>({
    queryKey: ["all-users"],
    queryFn: fetchAllContacts,
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT SIDEBAR */}
      <aside className="w-[300px] border-r bg-card p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Contacts</h2>

        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <div className="space-y-2">
            {users?.map((u) => (
              <UserListItem
                key={u.id}
                user={u}
                onSelect={() => setSelectedUser(u)} 
              />
            ))}
          </div>
        )}
      </aside>

      {/* RIGHT CHAT WINDOW */}
      <ChatWindow user={selectedUser} />
    </div>
  );
}

/* ------------------------------
   USER LIST ITEM
------------------------------- */
function UserListItem({
  user,
  onSelect,
}: {
  user: TUserPlayground;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
    >
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          {user.username[0].toUpperCase()}
        </div>

        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
            user.isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-xs text-muted-foreground">
          {user.isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------
   SIDEBAR SKELETON
------------------------------- */
function SidebarSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
