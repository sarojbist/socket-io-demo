import type { TUserPlayground } from "@/services/types";
import { Skeleton } from "../ui/skeleton";

export const UserListItem = ({
    user,
    onSelect,
    isSelected,
}: {
    user: TUserPlayground;
    onSelect: () => void;
    isSelected?: boolean;
}) => {
    const userInfo = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null;

    return (
        <div
            onClick={onSelect}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors ${isSelected ? "bg-accent" : ""
                }`}
        >
            <div className="relative shrink-0">
                <div className="h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {user.username[0].toUpperCase()}
                </div>

                <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${user.isOnline ? "bg-green-500" : "bg-gray-400"
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

export const SidebarSkeleton = () => {
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