/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllContacts } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import type { TUserPlayground } from "@/services/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatWindow } from "@/components/chats/chatWindow";

export default function Playground() {
  const [selectedUser, setSelectedUser] = useState<TUserPlayground | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

  const { data: users, isLoading } = useQuery<TUserPlayground[]>({
    queryKey: ["all-users"],
    queryFn: fetchAllContacts,
  });

  function handleUserSelect(user: any) {
    setSelectedUser(user);
    setIsMobileSidebarOpen(false);
  }

  function handleBack() {
    setIsMobileSidebarOpen(true);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* SIDEBAR */}
      <aside
        className={`${
          isMobileSidebarOpen ? "flex" : "hidden"
        } md:flex w-full md:w-80 lg:w-96 border-r bg-card flex-col`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Contacts</h2>
        </div>

        <ScrollArea className="flex-1 h-[80vh]">
          <div className="p-2">
            {isLoading ? (
              <SidebarSkeleton />
            ) : (
              <div className="space-y-1">
                {users?.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    onSelect={() => handleUserSelect(u)}
                    isSelected={selectedUser?._id === u._id}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* RIGHT CHAT WINDOW */}
      <div
        className={`${
          isMobileSidebarOpen ? "hidden" : "flex"
        } md:flex flex-1`}
      >
        <ChatWindow user={selectedUser} onBack={handleBack} />
      </div>
    </div>
  );
}


function UserListItem({
  user,
  onSelect,
  isSelected,
}: {
  user: TUserPlayground;
  onSelect: () => void;
  isSelected?: boolean;
}) {
  const userInfo = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
    >
      <div className="relative shrink-0">
        <div className="h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          {user.username[0].toUpperCase()}
        </div>

        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${
            user.isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">
          {user.username} {userInfo?.id === user._id ? "(You)" : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          {user.isOnline ? "Online" : "Offline"}
        </p>
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
