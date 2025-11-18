/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllContacts } from "@/services/userService";
import type { TUserPlayground } from "@/services/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatWindow } from "@/components/chats/chatWindow";
import { useUsersStore } from "@/store/onlineUsersStore";
import { useSidebarContext } from "@/context/SidebarContext";
import { SidebarSkeleton, UserListItem } from "@/components/playground/basicComponents";

export default function Playground() {
  const [selectedUser, setSelectedUser] = useState<TUserPlayground | null>(null);
  // const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  const {isMobileSidebarOpen, toggleSidebar}= useSidebarContext()

  const onlineUsers = useUsersStore((s) => s.onlineUsers);

  const { data: users, isLoading } = useQuery<TUserPlayground[]>({
    queryKey: ["all-users"],
    queryFn: fetchAllContacts,
  });

  function handleUserSelect(user: any) {
    setSelectedUser(user);
    toggleSidebar();
  }

  function handleBack() {
    toggleSidebar();
  }

  const finalUsers: TUserPlayground[] = useMemo(() => {
  if (!users) return [];

  return users
    .map((u) => ({
      ...u,
      isOnline: onlineUsers.includes(u._id),
    }))
    .sort((a, b) => {
      if (a.isOnline === b.isOnline) {
        return a.username.localeCompare(b.username);
      }
      return a.isOnline ? -1 : 1;
    });
}, [users, onlineUsers]);

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
                {finalUsers?.map((u) => (
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
        <ChatWindow user={selectedUser} onBack={handleBack}  />
      </div>
    </div>
  );
}





